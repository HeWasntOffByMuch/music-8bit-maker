/**
 * Musical Motif Generator
 *
 * Generates musical motifs with:
 * - Variable lengths
 * - Rhythmic durations (in 16ths)
 * - Articulated phrasing (rests, syncopation)
 * - Contour shaping with tension and resolution
 * - Advanced variation logic
 */

function generateMotif(options = {}) {
  // Default options
  const defaults = {
    length: 4,                  // Number of elements (notes + rests)
    minLength: 3,               // Minimum length for random generation
    maxLength: 8,               // Maximum length for random generation
    scale: [0, 2, 4, 5, 7, 9, 11], // Major scale degrees (C major by default)
    restProbability: 0.15,      // Probability of generating a rest
    syncopationProbability: 0.3, // Probability of generating syncopation
    contourComplexity: 0.5,     // 0-1 value determining contour complexity
    forceResolution: true,      // End on a stable scale degree
    maxIntervalJump: 7,         // Maximum interval jump in semitones
  };

  // Merge provided options with defaults
  const config = { ...defaults, ...options };

  // Determine motif length if randomized
  const motifLength = config.length || Math.floor(
    Math.random() * (config.maxLength - config.minLength + 1) + config.minLength
  );

  // Initialize empty motif
  const motif = [];

  // Track current position for contour shaping
  let position = 0;
  let previousPitch = null;
  let contourDirection = Math.random() > 0.5 ? 1 : -1; // Initial direction
  let contourPhase = 0; // 0: rising, 1: peak, 2: falling, 3: resolution

  // Create initial contour shape based on complexity
  const contourShapeLength = Math.max(3, Math.floor(motifLength * 0.7));
  const contourPoints = generateContourPoints(contourShapeLength, config.contourComplexity);

  // Generate each note/rest of the motif
  while (position < motifLength) {
    const isLast = position === motifLength - 1;

    // Determine if this should be a rest
    const isRest = !isLast && Math.random() < config.restProbability;

    // Determine duration (in 16th notes)
    const duration = determineDuration(position, motifLength, isRest, config);

    // Create note or rest
    if (isRest) {
      // Rest
      motif.push({ pitchOffset: null, duration16th: duration });
    } else {
      // Note - determine pitch
      const contourValue = getContourValueAtPosition(position, motifLength, contourPoints);
      const pitchOffset = determinePitch(
        previousPitch,
        contourValue,
        isLast,
        config
      );

      // Store this note
      motif.push({ pitchOffset, duration16th: duration });
      previousPitch = pitchOffset;
    }

    position++;
  }

  return motif;
}

/**
 * Generates a series of contour points to guide the melodic shape
 */
function generateContourPoints(length, complexity) {
  // For simple contours, just create an arch shape
  if (complexity < 0.3) {
    return Array(length).fill().map((_, i) => {
      const x = i / (length - 1);
      // Simple arch shape: y = 4x(1-x)
      return 4 * x * (1 - x);
    });
  }

  // For medium complexity, add a secondary peak
  if (complexity < 0.7) {
    return Array(length).fill().map((_, i) => {
      const x = i / (length - 1);
      // Main arch plus secondary smaller arch
      return 4 * x * (1 - x) + 0.3 * Math.sin(2 * Math.PI * x);
    });
  }

  // For high complexity, use multiple sine waves of different frequencies
  return Array(length).fill().map((_, i) => {
    const x = i / (length - 1);
    const mainShape = 4 * x * (1 - x); // Basic arch shape
    const complexity1 = 0.3 * Math.sin(2 * Math.PI * x);
    const complexity2 = 0.2 * Math.sin(4 * Math.PI * x);
    return mainShape + complexity1 + complexity2;
  });
}

/**
 * Gets the contour value at a specific position in the motif
 */
function getContourValueAtPosition(position, totalLength, contourPoints) {
  const normalizedPosition = position / (totalLength - 1);
  const pointIndex = Math.floor(normalizedPosition * (contourPoints.length - 1));

  // Interpolate between points for smoother contour
  if (pointIndex < contourPoints.length - 1) {
    const remainder = normalizedPosition * (contourPoints.length - 1) - pointIndex;
    return contourPoints[pointIndex] * (1 - remainder) +
           contourPoints[pointIndex + 1] * remainder;
  }

  return contourPoints[pointIndex];
}

/**
 * Determines the pitch of a note based on contour and previous pitch
 */
function determinePitch(previousPitch, contourValue, isLast, config) {
  const { scale, maxIntervalJump, forceResolution } = config;

  // Scale the contour value (0-1) to the range of available scale degrees
  const contourPitchIndex = Math.floor(contourValue * scale.length);
  let targetPitch = scale[Math.min(contourPitchIndex, scale.length - 1)];

  // If this is the last note and we want to force resolution
  if (isLast && forceResolution) {
    // Choose a stable scale degree (0, 4, or 7 in a major scale - tonic, subdominant, dominant)
    const stableDegrees = [0, 4, 7].filter(deg => scale.includes(deg));
    return stableDegrees[Math.floor(Math.random() * stableDegrees.length)];
  }

  // If we have a previous pitch, limit the interval jump
  if (previousPitch !== null) {
    // Find the closest scale pitch to the desired contour that's within our interval limit
    const scaleCopy = [...scale];

    // Sort scale tones by their distance to the contour-suggested pitch
    scaleCopy.sort((a, b) => {
      return Math.abs(a - targetPitch) - Math.abs(b - targetPitch);
    });

    // Find the first scale tone that's within our max interval jump
    for (const candidate of scaleCopy) {
      if (Math.abs(candidate - previousPitch) <= maxIntervalJump) {
        return candidate;
      }
    }

    // If no suitable candidate found, just use the closest one within range
    if (targetPitch - previousPitch > maxIntervalJump) {
      return previousPitch + maxIntervalJump;
    } else if (previousPitch - targetPitch > maxIntervalJump) {
      return previousPitch - maxIntervalJump;
    }
  }

  return targetPitch;
}

/**
 * Determines the duration of a note or rest
 */
function determineDuration(position, totalLength, isRest, config) {
  const { syncopationProbability } = config;

  // Basic durations (in 16th notes)
  const standardDurations = [1, 2, 3, 4];

  // Determine if we should create syncopation
  const createSyncopation = Math.random() < syncopationProbability && position < totalLength - 1;

  if (isRest) {
    // Rests are usually shorter
    return Math.random() < 0.7 ? 1 : 2;
  }

  // Longer durations for first or last notes to emphasize them
  if (position === 0 || position === totalLength - 1) {
    return Math.random() < 0.6 ? 4 : 2;
  }

  // Create syncopation by using durations that cross beat boundaries
  if (createSyncopation) {
    // Odd durations or durations that will push the next note off the beat
    return Math.random() < 0.5 ? 3 : 1;
  }

  // Standard duration for other positions
  return standardDurations[Math.floor(Math.random() * standardDurations.length)];
}

/**
 * Creates variations of an existing motif
 * @param {Array} motif - The original motif
 * @param {String} variationType - Type of variation to apply
 * @returns {Array} - The varied motif
 */
function createMotifVariation(motif, variationType = 'random') {
  if (!motif || !motif.length) return [];

  // Choose a random variation type if not specified
  if (variationType === 'random') {
    const variationTypes = [
      'inversion', 'retrograde', 'rhythmicAugmentation',
      'rhythmicDiminution', 'truncation', 'expansion'
    ];
    variationType = variationTypes[Math.floor(Math.random() * variationTypes.length)];
  }

  // Create a copy of the motif to modify
  const newMotif = JSON.parse(JSON.stringify(motif));

  switch (variationType) {
    case 'inversion':
      // Invert the pitch intervals
      if (newMotif.length > 1) {
        // Find the first non-rest note as reference
        const firstNoteIndex = newMotif.findIndex(note => note.pitchOffset !== null);
        if (firstNoteIndex >= 0) {
          const reference = newMotif[firstNoteIndex].pitchOffset;

          // Invert all subsequent notes around the reference
          for (let i = firstNoteIndex + 1; i < newMotif.length; i++) {
            if (newMotif[i].pitchOffset !== null) {
              const interval = newMotif[i].pitchOffset - reference;
              newMotif[i].pitchOffset = reference - interval;
            }
          }
        }
      }
      break;

    case 'retrograde':
      // Reverse the order of notes
      return newMotif.reverse();

    case 'rhythmicAugmentation':
      // Double all durations
      newMotif.forEach(note => {
        note.duration16th *= 2;
      });
      break;

    case 'rhythmicDiminution':
      // Halve all durations (minimum 1)
      newMotif.forEach(note => {
        note.duration16th = Math.max(1, Math.floor(note.duration16th / 2));
      });
      break;

    case 'truncation':
      // Remove the last 1/3 of the motif
      const truncateAmount = Math.max(1, Math.floor(newMotif.length / 3));
      return newMotif.slice(0, newMotif.length - truncateAmount);

    case 'expansion':
      // Add notes that interpolate between existing notes
      const expandedMotif = [];
      for (let i = 0; i < newMotif.length - 1; i++) {
        expandedMotif.push(newMotif[i]);

        // Only interpolate between actual notes (not rests)
        if (newMotif[i].pitchOffset !== null && newMotif[i+1].pitchOffset !== null) {
          // Create an interpolated note
          const midPitch = Math.floor((newMotif[i].pitchOffset + newMotif[i+1].pitchOffset) / 2);
          expandedMotif.push({
            pitchOffset: midPitch,
            duration16th: Math.min(newMotif[i].duration16th, newMotif[i+1].duration16th)
          });
        }
      }
      // Add the last note
      expandedMotif.push(newMotif[newMotif.length - 1]);
      return expandedMotif;
  }

  return newMotif;
}

// Examples of usage:

// Generate a basic motif
const basicMotif = generateMotif();
// console.log("Basic Motif:", JSON.stringify(basicMotif, null, 2));

// Generate a complex motif with specific options
const complexMotif = generateMotif({
  length: 6,
  scale: [0, 2, 3, 5, 7, 9, 10], // Natural minor scale
  restProbability: 0.2,
  syncopationProbability: 0.4,
  contourComplexity: 0.7,
  maxIntervalJump: 5
});
// console.log("Complex Motif:", JSON.stringify(complexMotif, null, 2));

// Create a variation of the motif
const invertedMotif = createMotifVariation(complexMotif, 'inversion');
// console.log("Inverted Motif:", JSON.stringify(invertedMotif, null, 2));

module.exports = { generateMotif, basicMotif, invertedMotif, complexMotif }