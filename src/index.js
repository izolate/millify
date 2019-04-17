const roundTo = require('round-to')

const ERROR_INVALID_TYPE = 'Input value is not a number'

const suffixes = new Map()
suffixes.set(3, 'K')
suffixes.set(6, 'M')
suffixes.set(9, 'B')
suffixes.set(12, 'T')

const defaultOptions = {
  precision: 2,
  lowerCase: false,
}

// Calculate how many digits in the number.
// e.g. 5000 = 4
const countDigits = val => 1 + Math.floor(Math.log10(Math.abs(val)))

// Calculate which suffix group the number belongs to.
// e.g. K, M, B
const getNumericalGroup = val => {
  let group = null

  for (const key of suffixes.keys()) {
    if (countDigits(val) > key) {
      group = key
    } else {
      break
    }
  }

  return group
}

module.exports = (inputVal, options = {}) => {
  const opts = { ...defaultOptions, ...options }

  // Ensure input value is a number
  const input = parseFloat(inputVal)
  if (Number.isNaN(input)) {
    throw new Error(ERROR_INVALID_TYPE)
  }

  // Return original number if less than 1K
  if (input > -1000 && input < 1000) {
    return input
  }

  const group = getNumericalGroup(input)

  // Format suffix
  let suffix = suffixes.get(group)
  if (suffix && opts.lowerCase) {
    suffix = suffix.toLowerCase()
  }

  // Create a decimal value
  const output = input / Math.pow(10, group)

  return `${roundTo(output, opts.precision)}${suffix}`
}
