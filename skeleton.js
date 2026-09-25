/**
 * Skeleton / public-interface sketch for a preset-based pixel sprite composer.
 */

/**
 * A single grid of pixels representing one part of a sprite
 * (e.g. "head", "body", "weapon").
 */
class PixelLayer {
  /**
   * @param {number} width
   * @param {number} height
   * @param {string|null} [fill] - color to initialize every pixel with, or
   *   null for "transparent" everywhere.
   */
  constructor(width, height, fill = null) {
    this.width = width
    this.height = height
    // 2D array or flat array, your choice
    this.pixels = []
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string|null} color - null means transparent
   */
  setPixel(x, y, color) {}

  /**
   * @param {number} x
   * @param {number} y
   * @returns {string|null}
   */
  getPixel(x, y) {}

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInBounds(x, y) {}

  /**
   * Returns a deep copy of this layer (useful before recoloring, so
   * presets in the library are never mutated in place).
   * @returns {PixelLayer}
   */
  clone() {}
}

/**
 * Holds named presets grouped by category ("head", "body", "accessory"...).
 * Lets consumers of the module use built-in presets AND register their own.
 */
class AssetLibrary {
  constructor() {
    // e.g. Map<category, Map<name, PixelLayer>>
    this.categories = new Map()
  }

  /**
   * @param {string} category
   * @param {string} name
   * @param {PixelLayer} layer
   */
  addPreset(category, name, layer) {}

  /**
   * @param {string} category
   * @param {string} name
   * @returns {PixelLayer}
   * @throws if the category or name doesn't exist
   */
  getPreset(category, name) {}

  /**
   * @param {string} category
   * @returns {string[]} names of all presets in that category
   */
  listPresets(category) {}
}

/**
 * Maps color keys used inside PixelLayer pixel data to actual hex/RGB
 * values, and supports recoloring a layer by swapping its palette.
 */
class Palette {
  /**
   * @param {Object<string,string>} colorMap - e.g. { skin: "#e0ac69", armor: "#888" }
   */
  constructor(colorMap) {
    this.colorMap = colorMap
  }

  /**
   * @param {string} key
   * @returns {string} hex color
   * @throws if key is not defined in this palette
   */
  resolve(key) {}

  /**
   * Returns a NEW layer with color keys remapped according to `mapping`.
   * Original layer (e.g. a library preset) is left untouched.
   * @param {PixelLayer} layer
   * @param {Object<string,string>} mapping - old color key -> new color key
   * @returns {PixelLayer}
   */
  static recolor(layer, mapping) {}
}

/**
 * Merges several PixelLayers into one final sprite, in stacking order.
 * This is the core "do one thing" piece: composition + transparency rules.
 */
class SpriteComposer {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width
    this.height = height
  }

  /**
   * Stacks layers bottom-to-top; transparent pixels let lower layers
   * show through.
   * @param {PixelLayer[]} layers - in stacking order, first = bottom
   * @returns {PixelLayer} the composed result
   */
  compose(layers) {}
}

/**
 * Serializes a composed PixelLayer to an external, viewable format.
 * No rendering library required — hand-built string output.
 */
class SpriteExporter {
  /**
   * @param {PixelLayer} layer
   * @param {number} [pixelSize] - scale factor, e.g. 8 = each pixel drawn as 8x8 px
   * @returns {string} a full, standalone SVG document as a string
   */
  static toSVG(layer, pixelSize = 8) {}

  /**
   * @param {PixelLayer} layer
   * @returns {Object} plain JSON-serializable representation
   */
  static toJSON(layer) {}
}

export { PixelLayer, AssetLibrary, Palette, SpriteComposer, SpriteExporter }