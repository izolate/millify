const roundTo = require('round-to')

const DEFAULT_BASE = 1000
const DEFAULT_PRECISION = 2
const DEFAULT_DECIMAL_SEPARATOR = '.'
const ERROR_INVALID_TYPE = 'Input value is not a number'
const ERROR_UNSAFE_NUMBER = 'Input value is either too big or too small'

const THOUSAND = 'K'
const MILLION = 'M'
const BILLION = 'B'
const TRILLION = 'T'
const QUADRILLION = 'P'
const QUINTILLION = 'E'

const units = [
  THOUSAND,
  MILLION,
  BILLION,
  TRILLION,
  QUADRILLION,
  QUINTILLION,
]

const defaultOptions = {
  base: DEFAULT_BASE,
  precision: DEFAULT_PRECISION,
  decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
  lowerCase: false,
  space: false,
}

/**
 * parseInput ensures the value is a number and within accepted range.
 *
 * @param {number} value
 */
const parseInput = value => {
  const val = parseFloat(value)
  if (Number.isNaN(val)) {
    throw new Error(ERROR_INVALID_TYPE)
  }
  if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
    throw new RangeError(ERROR_UNSAFE_NUMBER)
  }
  return val
}

/**
 * divider is a generator that divides a value by a denominator defined
 * by the grouping base (default 1000). Each successive turn multipies
 * the base by itself, resulting in a fraction and a grouping number (count).
 *
 * @param {number} value - Number to be divided
 * @param {number} base - Grouping base/interval
 */
const divider = function*(value, base) {
  let denominator = base
  let count = 0

  while (true) {
    const result = value / denominator
    if (result < 1) {
      return
    }

    yield { count, result }

    // Increase the denominator each turn
    denominator *= base
    // Increment the counter
    count++
  }
}

/**
 * Millify converts numbers to human-readable strings.
 *
 * @param {number} value - Number to convert
 * @param {Object} options
 * @param {number} options.precision - Number of significant figures
 * @param {string} options.decimalSeparator - Type of decimal marker
 * @param {boolean} options.lowerCase - Lowercase units
 */
const Millify = (value, options = {}) => {
  // Override default options with supplied ones
  const opts = { ...defaultOptions, ...options }

  // Validate value and create an input value to work with
  let val = parseInput(value)
  const isNegative = val < 1 ? true : false
  const input = Math.abs(val)

  // No need to continue since values < 1000 don't have an abbreviation
  if (input > -1000 && input < 1000) {
    return isNegative ? -input : input
  }

  // Keep dividing the input by the numerical grouping value (base)
  // until the decimal and unit suffix is deciphered
  const div = divider(input, opts.base)
  let count, result

  for (const round of div) {
    count = round.count
    result = round.result
  }

  // Add a minus sign (-) prefix if it's a negative number
  const prefix = isNegative ? '-' : ''

  // Calculate the numerical group suffix and apply lowercase option
  const suffix = opts.lowerCase ? units[count].toLowerCase() : units[count]

  // Round result up to desired precision
  const rounded = roundTo(result, opts.precision)

  // Replace decimal mark if desired
  const formatted = rounded
    .toString()
    .replace(DEFAULT_DECIMAL_SEPARATOR, opts.decimalSeparator)

  // Add a space between number and abbreviation
  const space = opts.space ? ' ' : ''

  return `${prefix}${formatted}${space}${suffix}`
}

module.exports = Millify
