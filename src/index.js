const suffixes = new Map()
suffixes.set(3, 'K')
suffixes.set(6, 'M')
suffixes.set(9, 'B')
suffixes.set(12, 'T')

// Figure out the appropriate unit for the number
const getUnits = digits => {
  let zeroes

  for (const key of suffixes.keys()) {
    if (digits > key) {
      zeroes = key
    }
  }

  return {
    suffix: suffixes.get(zeroes),
    zeroes
  }
}

module.exports = (input, { precision = 2, lowercase = false } = {}) => {
  // Ensure input value is a number
  if (typeof input !== 'number') {
    throw new Error('Input value is not a number')
  }

  input = parseFloat(input)

  // Figure out how many digits in the integer
  const digits = 1 + Math.floor(Math.log10(Math.abs(input)))

  // Get units
  let { suffix, zeroes } = getUnits(digits)

  // Convert to lowercase if necessary
  if (lowercase) {
    suffix = suffix.toLowerCase()
  }

  const pretty = input / Math.pow(10, zeroes)

  precision = pretty % 1 === 0 ? 2 : Math.min(Math.max(1, precision), 21)

  // Return original number if less than 1K
  if (input > -1000 && input < 1000) {
    return input
  }

  return `${parseFloat(pretty.toPrecision(precision))}${suffix}`
}
