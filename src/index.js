const DEFAULT_BASE = 1000
const DEFAULT_PRECISION = 2
const DEFAULT_DECIMAL_SEPARATOR = '.'

const ERROR_INVALID_VALUE = 'Value must be a valid number'
const ERROR_UNSAFE_VALUE = 'Value is either too big or too small'
const ERROR_INFINITE_VALUE = 'Value must be a finite number'
const ERROR_INVALID_PRECISION = 'Precision must be a non-negative integer'
const ERROR_INVALID_UNITS = 'Units must be an array'

const UNIT_THOUSAND = 'K'
const UNIT_MILLION = 'M'
const UNIT_BILLION = 'B'
const UNIT_TRILLION = 'T'
const UNIT_QUADRILLION = 'P'
const UNIT_QUINTILLION = 'E'

const defaultOptions = {
  base: DEFAULT_BASE,
  precision: DEFAULT_PRECISION,
  decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
  lowerCase: false,
  space: false,
  units: [
    '',
    UNIT_THOUSAND,
    UNIT_MILLION,
    UNIT_BILLION,
    UNIT_TRILLION,
    UNIT_QUADRILLION,
    UNIT_QUINTILLION,
  ],
}

/**
 * parseValue ensures the value is a number and within accepted range.
 *
 * @param {number} value
 */
const parseValue = value => {
  const val = parseFloat(value)
  if (Number.isNaN(val)) {
    throw new Error(ERROR_INVALID_VALUE)
  }
  if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
    throw new RangeError(ERROR_UNSAFE_VALUE)
  }
  return val
}

/**
 * divider is a generator that divides a value by a denominator defined
 * by the grouping base (default 1000). Each successive turn multipies
 * the base by itself, resulting in a decimal and a unit (count).
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

    yield { result, count: ++count }

    // Increase the denominator each turn
    denominator *= base
  }
}

/**
 * round up a number to specified precision
 *
 * @param {number} value - Number to be rounded
 * @param {number} precision - Significant places
 */
const round = (value, precision) => {
  if (!Number.isFinite(value)) {
    throw new Error(ERROR_INFINITE_VALUE)
  }
  if (!Number.isInteger(precision) || precision < 0) {
    throw new Error(ERROR_INVALID_PRECISION)
  }
  if (Number.isInteger(value)) {
    return value
  }
  return parseFloat(value.toFixed(precision))
}

/**
 * Millify converts long numbers to human-readable strings.
 *
 * @param {number} value - Number to convert
 * @param {Object} options
 * @param {number} options.precision - Number of significant figures
 * @param {string} options.decimalSeparator - Type of decimal marker
 * @param {boolean} options.lowerCase - Lowercase units
 * @param {boolean} options.space - Space between number and abbreviation
 * @param {number} options.base - Numerical group
 * @param {Array<string>} options.units - List of units
 */
const Millify = (value, options = {}) => {
  // Override default options with supplied ones
  const opts = { ...defaultOptions, ...options }

  if (!Array.isArray(opts.units) || !opts.units.length) {
    throw new Error(ERROR_INVALID_UNITS)
  }

  // Validate value for type and length
  let val = parseValue(value)

  // Add a minus sign (-) prefix if it's a negative number
  const prefix = val < 0 ? '-' : ''

  // Work with positive values
  val = Math.abs(val)

  // Keep dividing the input value by the numerical grouping value (base)
  // until the decimal and unit is deciphered
  let unit = 0
  for (const div of divider(val, opts.base)) {
    val = div.result
    unit = div.count
  }

  // Avoid out of bounds error by using the last available unit
  unit = unit > opts.units.length ? opts.units.length - 1 : unit

  // Calculate the unit suffix and apply lowercase option
  const suffix = opts.lowerCase
    ? opts.units[unit].toLowerCase()
    : opts.units[unit]

  // Add a space between number and abbreviation
  const space = opts.space ? ' ' : ''

  // Round decimal up to desired precision
  const rounded = round(val, opts.precision)

  // Replace decimal mark if desired
  const formatted = rounded
    .toString()
    .replace(DEFAULT_DECIMAL_SEPARATOR, opts.decimalSeparator)

  return `${prefix}${formatted}${space}${suffix}`
}

module.exports = Millify
