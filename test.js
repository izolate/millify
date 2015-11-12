const assert = require('assert')
const millify = require('./index')

describe('Units', () => {
  it('identifies hundreds', () => assert.equal(millify(100), 100))
  it('identifies thousands', () => assert.equal(millify(1000), '1K'))
  it('identifies millions', () => assert.equal(millify(1000000), '1M'))
  it('identifies billions', () => assert.equal(millify(1000000000), '1B'))
  it('identifies trillions', () => assert.equal(millify(1000000000000), '1T'))
})

describe('Decimal places', () => {
  it('defaults to 1 decimal place', () => assert.equal(millify(2500), '2.5K'))
  it('returns desired decimal place', () => assert.equal(millify(3333, 3), '3.333K'))
})

describe('Errors', () => {
  it('Throws an error if a number is not given', () => {
    assert.throws(function () { millify('woo') }, Error, 'Not a number')
  })
})
