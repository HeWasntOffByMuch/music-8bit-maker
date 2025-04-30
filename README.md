# 8-Bit Music Motif Generator

A Node.js application that procedurally generates endless 8-bit style music based on musical motifs, supporting variable durations and articulation.

## Features

- **Procedural Music Generation**: Creates endless, non-repeating musical patterns
- **Motif-Based Composition**: Uses musical motifs as building blocks for melodies
- **Variable Durations**: Supports different note lengths for rhythmic variety
- **Articulated Phrasing**: Includes rests and syncopation for musical expressiveness  
- **Dynamic Motif Selection**: Chooses from a bank of pre-defined and generated motifs
- **Real-time Audio**: Outputs directly to your audio device
- **Customizable Parameters**: Adjust tempo, key, and other musical properties

## Requirements

- Node.js (v14+)
- npm

## Installation

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install speaker
npm install readable-stream
```

## Usage

### Basic Usage

Run the generator with default settings:

```bash
node gen/infiniteMotiffBlues8Bit_v2.js
```

### Configuration

The application can be configured by modifying the state object in the code:

```javascript
const state = {
  bpm: 120,         // Beats per minute
  key: 'C',         // Base key for generation
  motifs: [0, 1, 2, 3, 4, 5], // Indices of motifs to use from MOTIF_BANK
  USE_MOTIF_GENERATOR: true, // Enable dynamic motif generation
};
```

## Motif Structure

Motifs are defined as arrays of note objects with the following structure:

```javascript
[
  { pitchOffset: 0, duration16th: 2 },  // Root note, 2 sixteenth notes
  { pitchOffset: 4, duration16th: 1 },  // Major third, 1 sixteenth note
  { pitchOffset: null, duration16th: 1 }, // Rest, 1 sixteenth note
  { pitchOffset: 7, duration16th: 4 }   // Perfect fifth, 4 sixteenth notes
]
```

Where:
- `pitchOffset`: Semitone offset from the root note (null for rests)
- `duration16th`: Duration in sixteenth notes

## Included Motifs

The generator includes various motif styles:
- Classic 8-bit video game motifs (Mega Man, Zelda, Castlevania, etc.)
- Epic orchestral motifs
- Rock-inspired riffs
- And more!

## Building Custom Motifs

You can create your own motifs by adding to the `MOTIF_BANK` array:

```javascript
[
  { pitchOffset: 0, duration16th: 2 },
  { pitchOffset: 3, duration16th: 2 },
  { pitchOffset: 5, duration16th: 2 },
  { pitchOffset: 3, duration16th: 2 }
]
```

Or use the built-in motif generator function:

```javascript
const newMotif = generateMotif({
  length: 6,
  scale: [0, 2, 4, 5, 7, 9, 11], // Major scale
  restProbability: 0.2,
  contourComplexity: 0.6
});
```

## Advanced Features

### Procedural Motif Generation

The generator can create new motifs on the fly using the `generateMotif()` function with parameters:

- `length`: Number of elements (notes + rests)
- `scale`: Array of scale degrees (semitones)
- `restProbability`: Chance of generating a rest (0-1)
- `syncopationProbability`: Chance of generating syncopation (0-1)
- `contourComplexity`: Complexity of the melodic contour (0-1)
- `forceResolution`: Whether to end on a stable scale degree

### Motif Variations

Create variations of existing motifs using:

```javascript
const variation = createMotifVariation(originalMotif, 'inversion');
```

Supported variation types:
- `inversion`: Flips the intervals
- `retrograde`: Reverses the order of notes
- `rhythmicAugmentation`: Doubles all durations
- `rhythmicDiminution`: Halves all durations
- `truncation`: Removes the last third of the motif
- `expansion`: Adds interpolated notes between existing notes

## Troubleshooting

- If you experience audio issues, check your audio output device settings
- On some platforms, you may need to run with sudo for audio access
- Volume can be adjusted by modifying the amplitude values in the `squareWave` function

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic 8-bit video game music
- Built with Node.js and speaker library