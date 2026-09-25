/**
 * Skeleton / public-interface sketch for a preset-based pixel sprite composer.
 * Fill in method bodies. Method names/signatures are a starting point —
 * adjust freely, this is just to get you committing something today.
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
    this.pixels = Array.from({ length: height }, () => new Array(width).fill(fill))
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string|null} color - null means transparent
   */
  setPixel(x, y, color) {
    if (!this.isInBounds(x, y)) return
    this.pixels[y][x] = color
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {string|null}
   */
  getPixel(x, y) {
    if (!this.isInBounds(x, y)) return null
    return this.pixels[y][x]
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height
  }

  /**
   * Returns a deep copy of this layer (useful before recoloring, so
   * presets in the library are never mutated in place).
   * @returns {PixelLayer}
   */
  clone() {
    const copy = new PixelLayer(this.width, this.height)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        copy.pixels[y][x] = this.pixels[y][x]
      }
    }
    return copy
  }
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
  addPreset(category, name, layer) {
    if (!this.categories.has(category)) {
      this.categories.set(category, new Map())
    }
    this.categories.get(category).set(name, layer)
  }

  /**
   * @param {string} category
   * @param {string} name
   * @returns {PixelLayer}
   * @throws if the category or name doesn't exist
   */
  getPreset(category, name) {
    const presets = this.categories.get(category)
    if (!presets) throw new Error(`Unknown category: "${category}"`)
    const layer = presets.get(name)
    if (!layer) throw new Error(`Unknown preset "${name}" in category "${category}"`)
    return layer
  }

  /**
   * @param {string} category
   * @returns {string[]} names of all presets in that category
   */
  listPresets(category) {
    const presets = this.categories.get(category)
    return presets ? Array.from(presets.keys()) : []
  }
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
  resolve(key) {
    if (!(key in this.colorMap)) throw new Error(`Unknown color key: "${key}"`)
    return this.colorMap[key]
  }

  /**
   * Returns a NEW layer with matching pixel values remapped according to
   * `mapping`. Original layer (e.g. a library preset) is left untouched.
   * @param {PixelLayer} layer
   * @param {Object<string,string>} mapping - old value -> new value
   * @returns {PixelLayer}
   */
  static recolor(layer, mapping) {
    const copy = layer.clone()
    for (let y = 0; y < copy.height; y++) {
      for (let x = 0; x < copy.width; x++) {
        const current = copy.getPixel(x, y)
        if (current !== null && current in mapping) {
          copy.setPixel(x, y, mapping[current])
        }
      }
    }
    return copy
  }
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
   * show through. Each entry can be a bare PixelLayer (placed at 0,0)
   * or { layer, offsetX, offsetY } to position it within the canvas.
   * @param {(PixelLayer|{layer: PixelLayer, offsetX?: number, offsetY?: number})[]} layers
   * @returns {PixelLayer} the composed result
   */
  compose(layers) {
    const out = new PixelLayer(this.width, this.height)
    for (const entry of layers) {
      const layer = entry instanceof PixelLayer ? entry : entry.layer
      const offsetX = entry instanceof PixelLayer ? 0 : entry.offsetX || 0
      const offsetY = entry instanceof PixelLayer ? 0 : entry.offsetY || 0
      for (let y = 0; y < layer.height; y++) {
        for (let x = 0; x < layer.width; x++) {
          const color = layer.getPixel(x, y)
          if (color !== null) out.setPixel(x + offsetX, y + offsetY, color)
        }
      }
    }
    return out
  }
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
  static toSVG(layer, pixelSize = 8) {
    const w = layer.width * pixelSize
    const h = layer.height * pixelSize
    const rects = []
    for (let y = 0; y < layer.height; y++) {
      for (let x = 0; x < layer.width; x++) {
        const color = layer.getPixel(x, y)
        if (color === null) continue
        rects.push(
          `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`
        )
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${rects.join('')}</svg>`
  }

  /**
   * @param {PixelLayer} layer
   * @returns {Object} plain JSON-serializable representation
   */
  static toJSON(layer) {
    return {
      width: layer.width,
      height: layer.height,
      pixels: layer.pixels.map(row => row.slice()),
    }
  }
}

export { PixelLayer, AssetLibrary, Palette, SpriteComposer, SpriteExporter }