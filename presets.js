/**
 * Preset pixel art assets, grouped by category.
 * Each preset is a 16x16 grid of single-character color keys;
 * '.' means transparent. COLOR_KEYS maps keys to hex colors and
 * matches the kind of lookup table your Palette class expects.
 *
 * loadPresetsInto(library, PixelLayer) registers all of these into
 * an AssetLibrary instance from skeleton.js.
 */

const COLOR_KEYS = {
  "a": "#9aa5ad",
  "d": "#2b2b2b",
  "k": "#111111",
  "s": "#e0ac69",
  "h": "#4a2f1c",
  "p": "#6a3fb5",
  "r": "#3b5a8a",
  "g": "#d4af37",
  "w": "#d8dee2",
  "b": "#5b3a21",
  "e": "#c94b4b"
};

const PRESETS = [
  {
    category: "head",
    name: "head_helmet",
    width: 16,
    height: 16,
    rows: [
      "........d.......",
      ".....dddaddd....",
      "....daaaaaaad...",
      "...daaaaaaaaad..",
      "..daaaaaaaaaaad.",
      "..daaaaaaaaaaad.",
      "..daaaaaaaaaaad.",
      ".daaaaaaaaaaaaad",
      "..dakkkkkkkkaad.",
      "..dakkkkkkkkaad.",
      "..da........aad.",
      "...d........ad..",
      "............d...",
      "................",
      "................",
      "................",
    ],
  },
  {
    category: "head",
    name: "head_hair_short",
    width: 16,
    height: 16,
    rows: [
      "................",
      "................",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      ".hhhhhhhhhhhhhh.",
      ".hhhhhhhhhhhhhh.",
      ".hhhhsssssshhhh.",
      "..sssssssssssss.",
      "...sskssssksss..",
      "...sssssssssss..",
      "...sssssssssss..",
      "....sssssssss...",
      ".....sssssss....",
      "........s.......",
      "................",
    ],
  },
  {
    category: "head",
    name: "head_wizard_hat",
    width: 16,
    height: 16,
    rows: [
      "........p.......",
      ".......ppp......",
      "......ppppp.....",
      "......ppppp.....",
      ".....ppppppp....",
      "....ppppppppp...",
      "....ppppppppp...",
      "...ggggggggggp..",
      ".ppggggggggggpp.",
      ".pppppppppppppp.",
      "...sssssssssss..",
      "....sssssssss...",
      "....sssssssss...",
      "....sssssssss...",
      ".....sssssss....",
      "........s.......",
    ],
  },
  {
    category: "body",
    name: "body_armor",
    width: 16,
    height: 16,
    rows: [
      "................",
      "..dddddddddddd..",
      "dddddaaddaaddddd",
      "daaadaaddaadaaad",
      "daaadaaddaadaaad",
      "daaadaaddaadaaad",
      "dddddaaddaaddddd",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
      "..daaaaddaaaad..",
    ],
  },
  {
    category: "body",
    name: "body_robe",
    width: 16,
    height: 16,
    rows: [
      "......rrrr......",
      "......rrrr......",
      ".....rrrrrr.....",
      ".....rrrrrr.....",
      "....rrrrrrrr....",
      "....rrrrrrrr....",
      "...rrrrrrrrrr...",
      "...rrrrrrrrrr...",
      ".bbbbbbbbbbbbbb.",
      ".bbbbbbbbbbbbbb.",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
    ],
  },
  {
    category: "accessory",
    name: "accessory_sword",
    width: 16,
    height: 16,
    rows: [
      ".......ww.......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "......wwww......",
      "...gggggggggg...",
      "......bbbb......",
      "......bbbb......",
      "......bbbb......",
      "......gggg......",
      "......gggg......",
    ],
  },
  {
    category: "accessory",
    name: "accessory_shield",
    width: 16,
    height: 16,
    rows: [
      "...ddaaaaaaadd..",
      "..ddaaaaaaaaadd.",
      "..daaaaaaaaaaad.",
      ".daaaaaaaaaaaaad",
      ".daaaaaaaaaaaaad",
      ".daaaaaaaaaaaaad",
      ".daaaaaaeaaaaad.",
      ".daaaaaeeeaaaad.",
      ".daaaaeeeeeaaad.",
      ".daaaaaeeeaaaad.",
      ".daaaaaaeaaaaad.",
      ".daaaaaaaaaaaad.",
      ".daaaaaaaaaaaad.",
      "..aaaaaaaaaaaa..",
      ".....aaaaaa.....",
      "................",
    ],
  },
];

/**
 * Converts a preset's row-strings into a PixelLayer, resolving each
 * character through COLOR_KEYS ('.' becomes a transparent/null pixel).
 * @param {Object} preset - one entry from PRESETS
 * @param {new (w: number, h: number) => any} PixelLayer
 * @returns {any} a populated PixelLayer instance
 */
function presetToLayer(preset, PixelLayer) {
  const layer = new PixelLayer(preset.width, preset.height)
  for (let y = 0; y < preset.height; y++) {
    const row = preset.rows[y]
    for (let x = 0; x < preset.width; x++) {
      const key = row[x]
      const color = key === '.' ? null : COLOR_KEYS[key]
      layer.setPixel(x, y, color)
    }
  }
  return layer
}

/**
 * Registers every preset above into an AssetLibrary.
 * @param {any} library - an AssetLibrary instance
 * @param {new (w: number, h: number) => any} PixelLayer
 */
function loadPresetsInto(library, PixelLayer) {
  for (const preset of PRESETS) {
    library.addPreset(preset.category, preset.name, presetToLayer(preset, PixelLayer))
  }
}

export { COLOR_KEYS, PRESETS, presetToLayer, loadPresetsInto };