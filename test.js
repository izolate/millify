import test from 'ava'
import millify from './src'

test('returns a string', t => {
  t.is(millify(100), '100')
})

test('uses correct suffixes with default options', t => {
  t.is(millify(100), '100')
  t.is(millify(1000), '1K')
  t.is(millify(1000000), '1M')
  t.is(millify(1000000000), '1B')
  t.is(millify(1000000000000), '1T')
})

test('handles negative numbers like positive ones', t => {
  t.is(millify(-100), '-100')
  t.is(millify(-1000), '-1K')
  t.is(millify(-1000000), '-1M')
  t.is(millify(-1000000000), '-1B')
  t.is(millify(-1000000000000), '-1T')
})

test('uses lowercase suffixes when lowerCase is true', t => {
  const options = { lowerCase: true }
  t.is(millify(1000, options), '1k')
  t.is(millify(1000000, options), '1m')
  t.is(millify(1000000000, options), '1b')
  t.is(millify(1000000000000, options), '1t')
})

test('precision adjusts according to options', t => {
  const num = 12345.67
  t.is(millify(num, { precision: 0 }), '12K')
  t.is(millify(num, { precision: 1 }), '12.3K')
  t.is(millify(num, { precision: 2 }), '12.35K')
  t.is(millify(num, { precision: 3 }), '12.346K')
  t.is(millify(num, { precision: 4 }), '12.3457K')
  t.is(millify(num, { precision: 5 }), '12.34567K')
})

test('throws error if input value is not a number', t => {
  t.throws(() => millify('totally not a number'))
})
