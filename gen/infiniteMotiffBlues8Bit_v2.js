// Required modules
const Speaker = require('speaker');
const { Readable } = require('stream');
const { state } = require('../server.js');
const { generateMusicalTheme } = require('./musicalThemeGenerator');
const { generateMotif } = require('./musicalMotifGeneratorClaude');
const MOTIF_BANK = require('./motif_bank');

const getConfig = (state) => {
  const beatDuration = 60 / state.bpm;
  return {
    SAMPLE_RATE: 44100,
    BPM: state.bpm,
    BEAT_DURATION: beatDuration,
    BAR_DURATION: beatDuration * 4,
    CHANNELS: 1,
    ENABLE_GENERATED_THEME: state.enableGeneratedTheme,
    USE_MOTIF_GENERATOR: state.useMotifGenerator,
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

const theme = generateMusicalTheme({
  motifCount: 4,
  phraseLength: 4,
  scale: [0, 2, 3, 5, 7, 9, 10], // Dorian for moody vibe
  contourBias: 'mixed'
});

console.log('theme', theme)

// NES-style motifs with new format (objects with pitchOffset and duration16th)

// Import the motif generator function we created
// Or paste it here from the previous artifact if you prefer

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

/**
 * Convert motif to frequencies with durations
 * @param {Array} motif - Motif in new format with durations
 * @param {Number} rootOffset - The root note offset
 * @returns {Array} - Array of note objects with frequency and duration
 */
function convertMotifToFrequencies(motif, rootOffset) {
  return motif.map(note => {
    // Calculate duration in seconds based on 16th notes
    const durationSec = (note.duration16th / 16) * getConfig(state).BAR_DURATION;

    // For rests (null pitchOffset), return frequency as null
    const freq = note.pitchOffset !== null
      ? noteFreq(rootOffset, note.pitchOffset + 12)
      : null;

    return {
      frequency: freq,
      durationSec: durationSec
    };
  });
}

const motifQueueForGeneratedTheme = []
function generateMelodyPattern(rootOffset) {
  // Use motif generator for new motifs if configured
  if (getConfig(state).USE_MOTIF_GENERATOR) {

    if (motifQueueForGeneratedTheme.length === 0) {
      // Use the motif generator to create a new motif
      const generatedMotif = generateMotif({
        length: 6,
        scale: [0, 2, 3, 5, 7, 9, 10], // Minor scale
        restProbability: 0.2
      });
      console.log('generatedMotif', generatedMotif)
      motifQueueForGeneratedTheme.push(generatedMotif);
    }

    const motif = motifQueueForGeneratedTheme.shift();
    console.log('motif', motif)
    return convertMotifToFrequencies(motif, rootOffset);
  }

  let usedMotifs = [];
  // Get enabled motifs from bank or use the motif generator
  const enabledMotifs = MOTIF_BANK.filter((motif, index) => state.motifs.includes(index));


  usedMotifs.push(...enabledMotifs);

  const appendGeneratedTheme = getConfig(state).ENABLE_GENERATED_THEME;
  if (appendGeneratedTheme) {
    usedMotifs.push(...theme);
  }



  const randomIndex = Math.floor(Math.random() * usedMotifs.length);
  const motif = usedMotifs[randomIndex];

  console.log('usedMotifs.length', usedMotifs.length);
  console.log('chosen motif index', randomIndex);
  console.log('motif', motif);

  // Convert motif notes to frequencies with durations
  return convertMotifToFrequencies(motif, rootOffset);
}

/**
 * Generate samples for an entire bar of music
 * Now supports variable note durations and rests
 */
function generateBarSamples(barNum) {
  const clonedState = structuredClone(state);
  const secondsPerSample = 1 / getConfig(clonedState).SAMPLE_RATE;
  const samples = [];
  const rootOffset = CHORDS[barNum % CHORDS.length];

  // Get melody with durations
  const melodyWithDurations = generateMelodyPattern(rootOffset);

  // Base tones for accompaniment
  const bassTone = noteFreq(rootOffset - 24, 0); // bass
  const chordRootTone = noteFreq(rootOffset, 0); // chord root

  // Calculate total samples needed for the bar
  const barSamples = Math.floor(getConfig(clonedState).BAR_DURATION * getConfig(clonedState).SAMPLE_RATE);

  // Track position within the melody
  let melodyIndex = 0;
  let melodySamplesRemaining = 0;
  let currentMelodyFreq = null;

  // Generate all samples for the bar
  for (let i = 0; i < barSamples; i++) {
    // Check if we need to move to the next melody note
    if (melodySamplesRemaining <= 0 && melodyIndex < melodyWithDurations.length) {
      // Get current note information
      const currentNote = melodyWithDurations[melodyIndex];

      // Set the frequency and calculate samples for this duration
      currentMelodyFreq = currentNote.frequency; // null for rests
      melodySamplesRemaining = Math.floor(currentNote.durationSec * getConfig(clonedState).SAMPLE_RATE);

      // Move to next note for next time
      melodyIndex++;
    }

    // Generate the sample
    const currentTime = t;

    // Bass and chord root always play
    let val = 0.15 * squareWave(bassTone, currentTime) +
              0.1 * squareWave(chordRootTone, currentTime);

    // Add melody note if it's not a rest
    if (currentMelodyFreq !== null) {
      val += 0.1 * squareWave(currentMelodyFreq, currentTime);
    }

    // Clamp value to [-1, 1]
    const clamped = Math.max(-1, Math.min(1, val));
    samples.push(clamped);

    // Increment time and decrement remaining samples for current note
    t += secondsPerSample;
    melodySamplesRemaining--;
  }

  return samples;
}

// Audio scheduling
const AUDIO_QUEUE = [];

function scheduleBarsAhead(n = 2) {
  console.log('state', state.bpm);
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

// For testing our motif generator
function testMotifGenerator() {
  // Generate a motif
  const testMotif = generateMotif({
    length: 5,
    restProbability: 0.2,
    contourComplexity: 0.6
  });

  console.log('Generated test motif:', testMotif);

  // Convert to frequencies (using C as root)
  const frequencies = convertMotifToFrequencies(testMotif, 0);
  console.log('Converted to frequencies:', frequencies);

  return testMotif;
}

// Uncomment to test:
// testMotifGenerator();

// Start the music
scheduleBarsAhead();
loopToBPM();