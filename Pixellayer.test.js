import test from 'node:test'
import assert from 'node:assert/strict'
import { PixelLayer, AssetLibrary, Palette, SpriteComposer, SpriteExporter } from './skeleton.js'

test('setPixel/getPixel round-trip within bounds', () => {
  const layer = new PixelLayer(4, 4)
  layer.setPixel(1, 2, '#ff0000')
  assert.equal(layer.getPixel(1, 2), '#ff0000')
})

test('getPixel returns null for untouched pixels', () => {
  const layer = new PixelLayer(4, 4)
  assert.equal(layer.getPixel(0, 0), null)
})

test('isInBounds rejects out-of-range coordinates', () => {
  const layer = new PixelLayer(4, 4)
  assert.equal(layer.isInBounds(4, 0), false)
  assert.equal(layer.isInBounds(-1, 0), false)
  assert.equal(layer.isInBounds(0, 4), false)
})

test('setPixel outside bounds does not throw or corrupt state', () => {
  const layer = new PixelLayer(4, 4)
  assert.doesNotThrow(() => layer.setPixel(10, 10, '#000'))
})

test('clone produces an independent copy', () => {
  const layer = new PixelLayer(2, 2)
  layer.setPixel(0, 0, '#111')
  const copy = layer.clone()
  copy.setPixel(0, 0, '#222')
  assert.equal(layer.getPixel(0, 0), '#111')
  assert.equal(copy.getPixel(0, 0), '#222')
})

test('AssetLibrary stores and retrieves presets by category/name', () => {
  const library = new AssetLibrary()
  const layer = new PixelLayer(2, 2)
  library.addPreset('head', 'helmet', layer)
  assert.equal(library.getPreset('head', 'helmet'), layer)
  assert.deepEqual(library.listPresets('head'), ['helmet'])
})

test('AssetLibrary throws on unknown category or name', () => {
  const library = new AssetLibrary()
  assert.throws(() => library.getPreset('head', 'nope'))
  library.addPreset('head', 'helmet', new PixelLayer(2, 2))
  assert.throws(() => library.getPreset('head', 'nope'))
})

test('AssetLibrary.listPresets returns [] for an unknown category', () => {
  const library = new AssetLibrary()
  assert.deepEqual(library.listPresets('nope'), [])
})

test('Palette.resolve returns the mapped color', () => {
  const palette = new Palette({ skin: '#e0ac69' })
  assert.equal(palette.resolve('skin'), '#e0ac69')
})

test('Palette.resolve throws for an unknown key', () => {
  const palette = new Palette({ skin: '#e0ac69' })
  assert.throws(() => palette.resolve('nope'))
})

test('Palette.recolor swaps matching pixels without mutating the original', () => {
  const layer = new PixelLayer(2, 1)
  layer.setPixel(0, 0, '#a')
  layer.setPixel(1, 0, '#b')
  const recolored = Palette.recolor(layer, { '#a': '#z' })
  assert.equal(recolored.getPixel(0, 0), '#z')
  assert.equal(recolored.getPixel(1, 0), '#b')
  assert.equal(layer.getPixel(0, 0), '#a')
})

test('SpriteComposer stacks layers with transparency showing through', () => {
  const bottom = new PixelLayer(2, 2)
  bottom.setPixel(0, 0, '#bottom')
  bottom.setPixel(1, 1, '#bottom')
  const top = new PixelLayer(2, 2)
  top.setPixel(0, 0, '#top')
  const composer = new SpriteComposer(2, 2)
  const result = composer.compose([bottom, top])
  assert.equal(result.getPixel(0, 0), '#top')
  assert.equal(result.getPixel(1, 1), '#bottom')
})

test('SpriteComposer honors per-layer offsets', () => {
  const layer = new PixelLayer(1, 1)
  layer.setPixel(0, 0, '#x')
  const composer = new SpriteComposer(2, 2)
  const result = composer.compose([{ layer, offsetX: 1, offsetY: 1 }])
  assert.equal(result.getPixel(1, 1), '#x')
  assert.equal(result.getPixel(0, 0), null)
})

test('SpriteExporter.toSVG includes a rect per opaque pixel', () => {
  const layer = new PixelLayer(2, 1)
  layer.setPixel(0, 0, '#f00')
  const svg = SpriteExporter.toSVG(layer, 10)
  assert.match(svg, /<svg/)
  assert.equal((svg.match(/<rect/g) || []).length, 1)
})

test('SpriteExporter.toJSON returns a plain serializable copy', () => {
  const layer = new PixelLayer(1, 1)
  layer.setPixel(0, 0, '#f00')
  const json = SpriteExporter.toJSON(layer)
  assert.deepEqual(json, { width: 1, height: 1, pixels: [['#f00']] })
})