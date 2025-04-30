function generateMusicalTheme(options = {}) {
  const {
    motifCount = 4,
    phraseLength = 4,
    scale = [0, 2, 4, 5, 7, 9, 11], // major scale
    contourBias = 'mixed', // 'ascending', 'descending', 'mixed'
    variationChance = 0.3,
    maxInterval = 7,
  } = options;

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateMotif(len = phraseLength, base = 0) {
    let motif = [];
    let last = base;
    for (let i = 0; i < len; i++) {
      let step;
      const maxStep = Math.min(maxInterval, 7);
      if (contourBias === 'ascending') {
        step = Math.floor(Math.random() * (maxStep + 1));
      } else if (contourBias === 'descending') {
        step = -Math.floor(Math.random() * (maxStep + 1));
      } else {
        step = Math.floor(Math.random() * (2 * maxStep + 1)) - maxStep;
      }

      let next = last + step;
      let closestScaleNote = scale.reduce((a, b) =>
        Math.abs((b % 12) - (next % 12)) < Math.abs((a % 12) - (next % 12)) ? b : a
      );
      let offset = closestScaleNote - base;
      motif.push(offset);
      last = base + offset;
    }
    return motif;
  }

  function varyMotif(motif) {
    let variation = [...motif];
    if (Math.random() < 0.5 && variation.length > 2) {
      variation[Math.floor(Math.random() * variation.length)] +=
        Math.random() < 0.5 ? 1 : -1;
    }
    if (Math.random() < 0.3) {
      variation.reverse();
    }
    return variation;
  }

  const motifs = [];
  const baseNote = 0;

  // A - A - B - A’ structure
  const motifA = generateMotif(phraseLength, baseNote);
  const motifB = generateMotif(phraseLength, baseNote);
  const motifAprime = varyMotif(motifA);

  motifs.push(motifA);
  motifs.push(motifA);
  motifs.push(motifB);
  motifs.push(motifAprime);

  return motifs;
}

module.exports = { generateMusicalTheme };