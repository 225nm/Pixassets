import test from 'node:test'
import assert from 'node:assert/strict'
import { PixelLayer } from './skeleton.js'

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