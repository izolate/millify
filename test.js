import test from 'ava'
import millify from './src'

test('Identifies units', t => {
  t.is(millify(100), 100)
  t.is(millify(1000), '1K')
  t.is(millify(1000000), '1M')
  t.is(millify(1000000000), '1B')
  t.is(millify(1000000000000), '1T')
})

test('Lowercase units', t => {
  const options = { lowercase: true }
  t.is(millify(1000, options), '1k')
  t.is(millify(1000000, options), '1m')
  t.is(millify(1000000000, options), '1b')
})

test('Precision', t => {
  const num = 12345
  t.is(millify(num, { precision: 0 }), '10K')
  t.is(millify(num, { precision: 1 }), '10K')
  t.is(millify(num, { precision: 2 }), '12K')
  t.is(millify(num, { precision: 3 }), '12.3K')
  t.is(millify(num, { precision: 4 }), '12.35K')
  t.is(millify(num, { precision: 5 }), '12.345K')
})

test('Negative numbers', t => {
  t.is(millify(-100), -100)
  t.is(millify(-1000), '-1K')
  t.is(millify(-1000000), '-1M')
  t.is(millify(-1000000000), '-1B')
  t.is(millify(-1000000000000), '-1T')
})

test('Errors', t => {
  t.throws(() => millify('Throw an error'))
})
