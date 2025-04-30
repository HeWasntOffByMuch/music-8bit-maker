// Required modules
const Speaker = require('speaker');
const { Readable } = require('stream');

// Constants
const SAMPLE_RATE = 44100;
const BPM = 90;
const BEAT_DURATION = 60 / BPM;
const BAR_DURATION = BEAT_DURATION * 4;
const CHANNELS = 1;

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
  [0, 2, 4, 5, 7]   // ascending major run
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
  channels: CHANNELS,
  bitDepth: 16,
  sampleRate: SAMPLE_RATE
});

const stream = new Readable();
stream._read = () => {}; // No-op
stream.pipe(speaker);

let t = 0;
let barIndex = 0;
const secondsPerSample = 1 / SAMPLE_RATE;

function generateMelodyPattern(rootOffset) {
  const motif = MOTIF_BANK[Math.floor(Math.random() * MOTIF_BANK.length)];
  return motif.map(semi => noteFreq(rootOffset, semi + 12));
}

function generateBarSamples(barNum) {
  const samples = [];
  const rootOffset = CHORDS[barNum % CHORDS.length];
  const melody = generateMelodyPattern(rootOffset);
  const beatSamples = Math.floor(BEAT_DURATION * SAMPLE_RATE);

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

function play() {
  setImmediate(() => {
    const samples = generateBarSamples(barIndex);
    const buffer = Buffer.alloc(samples.length * 2);
    samples.forEach((s, i) => buffer.writeInt16LE(s * 32767, i * 2));
    stream.push(buffer);
    barIndex++;
    play();
  });
}

play();

