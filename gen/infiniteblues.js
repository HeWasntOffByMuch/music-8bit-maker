const Speaker = require('speaker');
const { Readable } = require('stream');

const SAMPLE_RATE = 44100;
const BIT_DEPTH = 16;
const CHANNELS = 1;

const speaker = new Speaker({
  channels: CHANNELS,
  bitDepth: BIT_DEPTH,
  sampleRate: SAMPLE_RATE
});

// --- CONFIGURATION ---
const VOLUMES = {
  melody: 0.4,
  rhythm: 0.25,
  bass: 0.3
};

const TEMPO = 90; // bpm
const BAR_DURATION = 60 / TEMPO * 4; // seconds per bar (4 beats)
const BEAT = 60 / TEMPO;

const NOTES = {
  C: 261.63, D: 293.66, Dsharp: 311.13, E: 329.63,
  F: 349.23, Fsharp: 370.0, G: 392.0,
  Gsharp: 415.3, A: 440.0, Asharp: 466.16, B: 493.88
};

const BLUES_SCALE = [NOTES.C, NOTES.Dsharp, NOTES.F, NOTES.Fsharp, NOTES.G, NOTES.Asharp];

const CHORDS = [
  'C', 'C', 'C', 'C',
  'F', 'F', 'C', 'C',
  'G', 'F', 'C', 'C'
];

// --- AUDIO HELPERS ---
function squareWave(freq, duration, volume = 1) {
  const samples = Math.floor(duration * SAMPLE_RATE);
  const buffer = Buffer.alloc(samples * 2);
  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const val = Math.sign(Math.sin(2 * Math.PI * freq * t));
    const sample = Math.max(-1, Math.min(1, val * volume)) * 32767;
    buffer.writeInt16LE(sample, i * 2);
  }
  return buffer;
}

function silence(duration) {
  return Buffer.alloc(Math.floor(duration * SAMPLE_RATE) * 2);
}

function mix(buffers) {
  const len = Math.min(...buffers.map(b => b.length));
  const output = Buffer.alloc(len);
  for (let i = 0; i < len; i += 2) {
    let sum = 0;
    for (const buf of buffers) {
      sum += buf.readInt16LE(i);
    }
    const mixed = Math.max(-32768, Math.min(32767, sum));
    output.writeInt16LE(mixed, i);
  }
  return output;
}

// --- TRACK GENERATORS ---
function generateShuffleRhythm(chordRoot) {
  const root = NOTES[chordRoot];
  const fifth = root * 1.5;
  const long = squareWave(root, BEAT * 2 / 3, VOLUMES.rhythm);
  const short = squareWave(fifth, BEAT / 3, VOLUMES.rhythm);
  return Buffer.concat([long, short, long, short]);
}

function generateBassLine(chordRoot) {
  const root = NOTES[chordRoot] / 2;
  const fifth = root * 1.5;
  return Buffer.concat([
    squareWave(root, BEAT, VOLUMES.bass),
    squareWave(fifth, BEAT, VOLUMES.bass),
    squareWave(root, BEAT, VOLUMES.bass),
    squareWave(fifth, BEAT, VOLUMES.bass)
  ]);
}

const melodyPatterns = [
  { intervals: [0, 1, -1], durations: [BEAT, BEAT / 2, BEAT / 2] },
  { intervals: [0, 2, -1], durations: [BEAT, BEAT, BEAT] },
  { intervals: [1, -1], durations: [BEAT * 1.5, BEAT * 0.5] },
  { intervals: [0, 1, 0], durations: [BEAT, BEAT, BEAT] }
];

let lastNoteIndex = Math.floor(Math.random() * BLUES_SCALE.length);
function generateMelody() {
  const pattern = melodyPatterns[Math.floor(Math.random() * melodyPatterns.length)];
  const notes = [];
  for (let i = 0; i < pattern.intervals.length; i++) {
    lastNoteIndex = (lastNoteIndex + pattern.intervals[i] + BLUES_SCALE.length) % BLUES_SCALE.length;
    notes.push(squareWave(BLUES_SCALE[lastNoteIndex], pattern.durations[i], VOLUMES.melody));
  }
  const totalTime = pattern.durations.reduce((a, b) => a + b, 0);
  if (totalTime < BAR_DURATION) notes.push(silence(BAR_DURATION - totalTime));
  return Buffer.concat(notes);
}

// --- STREAMING LOOP ---
let barIndex = 0;

const stream = new Readable({
  read() {
    const chord = CHORDS[barIndex % CHORDS.length];
    const rhythm = generateShuffleRhythm(chord);
    const bass = generateBassLine(chord);
    const melody = generateMelody();
    const mixed = mix([rhythm, bass, melody]);
    this.push(mixed);
    barIndex++;
  }
});

stream.pipe(speaker);

