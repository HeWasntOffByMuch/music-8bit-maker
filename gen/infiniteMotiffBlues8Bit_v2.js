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

// NES-style motifs (pitch offsets in semitones) and duration multipliers:
const MOTIF_BANK = [
  [[0, 1], [4, 0.5], [7, 1.5]],               // Mega Man leap (more bounce)
  [[0, 1], [3, 0.5], [5, 0.5], [3, 1]],        // Zelda phrase
  [[0, 0.5], [5, 1], [7, 0.5], [5, 0.5], [3, 1]], // Castlevania descent
  [[7, 1], [5, 1], [3, 0.5], [2, 1.5]],        // Bluesy resolution
  [[0, 0.5], [2, 0.5], [4, 0.5], [5, 0.5], [7, 1]], // Major run
  [[0, 1], [4, 0.5], [7, 1], [11, 0.5], [12, 2]], // Balatro-style arpeggio
  [[0, 0.5], [0, 0.25], [-3, 0.25], [0, 1], [5, 0.5]], // Mario intro
  [[0, 1], [5, 1], [9, 1], [7, 1], [5, 0.5]],  // Zelda theme lift
  [[0, 0.5], [4, 0.25], [7, 0.5], [9, 0.25], [5, 1], [2, 1]], // Mega Man stage
  [[0, 0.5], [3, 1], [5, 0.5], [6, 0.5], [8, 1]], // Castlevania battle walk
  [[0, 1], [-2, 0.25], [-4, 0.25], [-5, 0.5], [-7, 1]], // Sonic descending melody
  [[0, 0.5], [4, 0.5], [7, 1], [11, 0.5], [12, 0.5], [16, 0.5], [19, 1]], // Final Fantasy prelude
  [[0, 1], [2, 0.5], [5, 1], [7, 0.5], [9, 0.25]], // GTA: San Andreas funky groove
  [[0, 1], [7, 0.5], [5, 0.25], [3, 0.5], [2, 1]], // GTA: Vice City synth sweep
  [[0, 0.5], [3, 0.5], [5, 0.5], [7, 1], [6, 0.5], [4, 0.5]], // GTA IV noir phrase
  [[0, 1], [5, 0.5], [10, 1], [7, 0.25], [3, 0.5]], // GTA V cinematic
  [[0, 0.5], [0, 0.5], [3, 1], [5, 0.5], [3, 0.25], [0, 1]] // GTA classic urban loop
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

  return motif.map(([semitone, durationMult = 1]) => ({
    freq: noteFreq(rootOffset, semitone + 12),
    durationMult: durationMult
  }));
}

function generateBarSamples(barNum) {
  const clonedState = structuredClone(state);
  const secondsPerSample = 1 / getConfig(clonedState).SAMPLE_RATE;
  const samples = [];
  const rootOffset = CHORDS[barNum % CHORDS.length];
  const melody = generateMelodyPattern(rootOffset);
  const beatSamples = Math.floor(getConfig(clonedState).BEAT_DURATION * getConfig(clonedState).SAMPLE_RATE);

  for (let i = 0; i < 4; i++) {
    const tone1 = noteFreq(rootOffset - 24, 0); // bass
    const tone2 = noteFreq(rootOffset, 0); // chord root
    const melodyNote = melody[i % melody.length]; // melody

    for (let j = 0; j < beatSamples * melodyNote.durationMult; j++) {
      const currentTime = t;
      const val = 0.15 * squareWave(tone1, currentTime) +
                  0.1 * squareWave(tone2, currentTime) +
                  0.1 * squareWave(melodyNote.freq, currentTime);
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
