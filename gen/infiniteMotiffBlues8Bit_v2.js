// Required modules
const Speaker = require('speaker');
const { Readable } = require('stream');
const { state } = require('../server.js');

const getConfig = (state) => {
  const beatDuration = 60 / state.bpm;
  return {
    SAMPLE_RATE: 44100,
    BPM: state.bpm,
    BEAT_DURATION: beatDuration,
    BAR_DURATION: beatDuration * 4,
    CHANNELS: 1,
  }
}

const NOTES = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.00,
  A: 440.00,
  B: 493.88
};

const CHORDS = [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 0];
const BLUES_SCALE = [0, 3, 5, 6, 7, 10];
const BASE_KEY = 'C';

// NES-style motifs (interval offsets in semitones)
const MOTIF_BANK = [
  [0, 4, 7],        // like Mega Man leap
  [0, 3, 5, 3],     // bluesy Zelda phrase
  [0, 5, 7, 5, 3],  // descending Castlevania vibe
  [7, 5, 3, 2],     // closing lick
  [0, 2, 4, 5, 7],  // ascending major run
  [0, 4, 7, 11, 12],                     // Balatro-style minor 7 arpeggio
  [0, 0, 0, -3, 0, 5],                   // Mario intro style motif
  [0, 5, 9, 7, 5],                       // Zelda theme lift
  [0, 4, 7, 9, 5, 2],                    // Mega Man stage sequence
  [0, 3, 5, 6, 8],                       // Castlevania battle walk
  [0, -2, -4, -5, -7],                   // Sonic descending melody
  [0, 4, 7, 11, 12, 16, 19],              // Final Fantasy prelude arpeggio
  [0, 2, 5, 7, 9],                       // GTA: San Andreas funky groove
  [0, 7, 5, 3, 2, 0],                    // GTA: Vice City synth sweep (simplified)
  [0, 3, 5, 7, 6, 4],                    // GTA IV noir phrase
  [0, 5, 10, 7, 3],                      // GTA V cinematic
  [0, 0, 3, 5, 3, 0]                     // GTA classic urban loop
];

function noteFreq(rootOffset, semitoneOffset) {
  const baseFreq = NOTES[BASE_KEY] * Math.pow(2, rootOffset / 12);
  return baseFreq * Math.pow(2, semitoneOffset / 12);
}

function squareWave(freq, t) {
  return Math.sign(Math.sin(2 * Math.PI * freq * t));
}

// Audio stream setup
const speaker = new Speaker({
  channels: getConfig(state).CHANNELS,
  bitDepth: 16,
  sampleRate: getConfig(state).SAMPLE_RATE
});

const stream = new Readable();
stream._read = () => {}; // No-op
stream.pipe(speaker);

let t = 0;
let barIndex = 0;

function generateMelodyPattern(rootOffset) {
  const enbledMotifs = MOTIF_BANK.filter((motif, index) => state.motifs.includes(index));
  const randomIndex = Math.floor(Math.random() * enbledMotifs.length)
  const motif = enbledMotifs[randomIndex];
  console.log('enbledMotifs.length', enbledMotifs.length)
  console.log('chosen motif index', randomIndex)
  console.log('motif', motif)
  return (motif ?? []).map(semi => noteFreq(rootOffset, semi + 12));
}

function generateBarSamples(barNum) {
  const clonedState = structuredClone(state);
  const secondsPerSample = 1 / getConfig(clonedState).SAMPLE_RATE;
  const samples = [];
  const rootOffset = CHORDS[barNum % CHORDS.length];
  const melody = generateMelodyPattern(rootOffset);
  const beatSamples = Math.floor(getConfig(clonedState).BEAT_DURATION * getConfig(clonedState).SAMPLE_RATE);

  for (let i = 0; i < 4; i++) {
    const tone1 = noteFreq(rootOffset - 24, 0);       // bass
    const tone2 = noteFreq(rootOffset, 0);            // chord root
    const melodyNote = melody[i % melody.length];     // melody

    for (let j = 0; j < beatSamples; j++) {
      const currentTime = t;
      const val = 0.15 * squareWave(tone1, currentTime) +
                  0.1 * squareWave(tone2, currentTime) +
                  0.1 * squareWave(melodyNote, currentTime);
      const clamped = Math.max(-1, Math.min(1, val));
      samples.push(clamped);
      t += secondsPerSample;
    }
  }

  return samples;
}

// Audio scheduling
const AUDIO_QUEUE = [];

function scheduleBarsAhead(n = 2) {
  console.log('state', state.bpm)
  while (AUDIO_QUEUE.length < n) {
    const samples = generateBarSamples(barIndex);
    const buffer = Buffer.alloc(samples.length * 2);
    samples.forEach((s, i) => buffer.writeInt16LE(s * 32767, i * 2));
    AUDIO_QUEUE.push(buffer);
    barIndex++;
  }
}

function loopToBPM() {
    if (AUDIO_QUEUE.length === 0) return;

    const nextBuffer = AUDIO_QUEUE.shift();
    stream.push(nextBuffer);
    scheduleBarsAhead();

    setTimeout(() => {
        loopToBPM();
    }, getConfig(state).BAR_DURATION * 990);
}

scheduleBarsAhead();
loopToBPM();
