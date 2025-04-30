const MOTIF_BANK = [
  [ // Mega Man leap
    { pitchOffset: 0, duration16th: 4 },
    { pitchOffset: 4, duration16th: 2 },
    { pitchOffset: 7, duration16th: 6 }
  ],
  [ // Zelda phrase
    { pitchOffset: 0, duration16th: 3 },
    { pitchOffset: 3, duration16th: 3 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 3, duration16th: 4 }
  ],
  [ // Castlevania fall
    { pitchOffset: 0, duration16th: 3 },
    { pitchOffset: 5, duration16th: 3 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 3, duration16th: 6 }
  ],
  [ // closing lick
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 2, duration16th: 4 }
  ],
  [ // major run
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 2, duration16th: 2 },
    { pitchOffset: 4, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 7, duration16th: 4 }
  ],
  [ // Balatro minor 7
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 4, duration16th: 2 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 11, duration16th: 2 },
    { pitchOffset: 12, duration16th: 4 }
  ],
  [ // Mario intro
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: -3, duration16th: 2 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 5, duration16th: 4 }
  ],
  [ // Zelda theme
    { pitchOffset: 0, duration16th: 4 },
    { pitchOffset: 5, duration16th: 4 },
    { pitchOffset: 9, duration16th: 2 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 5, duration16th: 4 }
  ],
  [ // Mega Man stage
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 4, duration16th: 2 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 9, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 2, duration16th: 4 }
  ],
  [ // Castlevania walk
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 6, duration16th: 2 },
    { pitchOffset: 8, duration16th: 4 }
  ],
  [ // Sonic descent
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: -2, duration16th: 2 },
    { pitchOffset: -4, duration16th: 2 },
    { pitchOffset: -5, duration16th: 2 },
    { pitchOffset: -7, duration16th: 4 }
  ],
  [ // Final Fantasy prelude
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 4, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 11, duration16th: 1 },
    { pitchOffset: 12, duration16th: 2 },
    { pitchOffset: 16, duration16th: 2 },
    { pitchOffset: 19, duration16th: 4 }
  ],
  [ // GTA SA groove
    { pitchOffset: 0, duration16th: 3 },
    { pitchOffset: 2, duration16th: 3 },
    { pitchOffset: 5, duration16th: 3 },
    { pitchOffset: 7, duration16th: 3 },
    { pitchOffset: 9, duration16th: 4 }
  ],
  [ // GTA VC sweep
    { pitchOffset: 0, duration16th: 3 },
    { pitchOffset: 7, duration16th: 3 },
    { pitchOffset: 5, duration16th: 3 },
    { pitchOffset: 3, duration16th: 3 },
    { pitchOffset: 2, duration16th: 2 },
    { pitchOffset: 0, duration16th: 4 }
  ],
  [ // GTA IV noir
    { pitchOffset: 0, duration16th: 3 },
    { pitchOffset: 3, duration16th: 3 },
    { pitchOffset: 5, duration16th: 3 },
    { pitchOffset: 7, duration16th: 3 },
    { pitchOffset: 6, duration16th: 2 },
    { pitchOffset: 4, duration16th: 4 }
  ],
  [ // GTA V cinematic
    { pitchOffset: 0, duration16th: 4 },
    { pitchOffset: 5, duration16th: 4 },
    { pitchOffset: 10, duration16th: 4 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 3, duration16th: 6 }
  ],
  [ // GTA classic loop
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 0, duration16th: 4 }
  ],
    [
    { pitchOffset: 0, duration16th: 6 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 12, duration16th: 8 }
  ], // Epic hero theme (think Skyrim)

  [
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 7, duration16th: 4 },
    { pitchOffset: null, duration16th: 2 },
    { pitchOffset: 10, duration16th: 6 }
  ], // Dramatic tension builder

  [
    { pitchOffset: 12, duration16th: 4 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 0, duration16th: 8 }
  ], // Majestic descent

  [
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 9, duration16th: 1 },
    { pitchOffset: 9, duration16th: 1 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: null, duration16th: 2 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: 4, duration16th: 1 },
    { pitchOffset: 4, duration16th: 1 },
    { pitchOffset: 2, duration16th: 1 },
    { pitchOffset: 2, duration16th: 1 }
  ], // Imperial march inspired (Star Wars)

  [
    { pitchOffset: 7, duration16th: 3 },
    { pitchOffset: 12, duration16th: 1 },
    { pitchOffset: 14, duration16th: 3 },
    { pitchOffset: 12, duration16th: 1 },
    { pitchOffset: 16, duration16th: 8 }
  ], // Triumphant fanfare

  [
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 4, duration16th: 2 },
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: null, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 12, duration16th: 2 },
    { pitchOffset: 11, duration16th: 2 },
    { pitchOffset: 12, duration16th: 4 }
  ], // Epic quest theme

  [
    { pitchOffset: -5, duration16th: 2 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 7, duration16th: 4 },
    { pitchOffset: 3, duration16th: 2 },
    { pitchOffset: 0, duration16th: 4 }
  ], // Adventure rising theme

  [
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 3, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 10, duration16th: 1 },
    { pitchOffset: 12, duration16th: 4 },
    { pitchOffset: null, duration16th: 1 },
    { pitchOffset: 14, duration16th: 1 },
    { pitchOffset: 12, duration16th: 1 },
    { pitchOffset: 10, duration16th: 1 },
    { pitchOffset: 7, duration16th: 4 }
  ], // Mystical arpeggiated theme

  [
    { pitchOffset: 0, duration16th: 6 },
    { pitchOffset: null, duration16th: 2 },
    { pitchOffset: -1, duration16th: 6 },
    { pitchOffset: null, duration16th: 2 },
    { pitchOffset: -3, duration16th: 8 },
    { pitchOffset: 0, duration16th: 8 }
  ], // Ominous boss theme

  [
    { pitchOffset: 7, duration16th: 2 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: 4, duration16th: 1 },
    { pitchOffset: 0, duration16th: 4 },
    { pitchOffset: 5, duration16th: 2 },
    { pitchOffset: 4, duration16th: 1 },
    { pitchOffset: 2, duration16th: 1 },
    { pitchOffset: -3, duration16th: 4 }
  ], // Epic battle sequence
  [
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: 7, duration16th: 1 },
    { pitchOffset: 4, duration16th: 1 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 1 },
    { pitchOffset: 0, duration16th: 2 }
  ], // Rhythmic groove pattern based on onomatopoeia
  [
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 1 },
    { pitchOffset: 5, duration16th: 1 },
    { pitchOffset: null, duration16th: 1 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: null, duration16th: 1 },
    { pitchOffset: -2, duration16th: 2 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: null, duration16th: 1 },
    { pitchOffset: 0, duration16th: 2 },
    { pitchOffset: 3, duration16th: 1 }
  ] // Rock-inspired riff with power chord feel
];

module.exports = MOTIF_BANK