const suffixes = new Map()
suffixes.set(3, 'K')
suffixes.set(6, 'M')
suffixes.set(9, 'B')
suffixes.set(12, 'T')

module.exports = (input, { precision = 2, lowercase = false } = {}) => {
  // Ensure input value is a number
  if (typeof input !== 'number') {
    throw new Error('Input value is not a number')
  }

  input = parseFloat(input)

  // Figure out how many digits in the integer
  const digits = 1 + Math.floor(Math.log10(Math.abs(input)))

  // Figure out the appropriate unit for the number
  const { suffix, zeroes } = ((num, zeroes) => {
    for (let z of suffixes.keys()) {
      if (num > z) {
        zeroes = z
      }
    }

    const suffix = suffixes.get(zeroes)

    return {
      suffix: lowercase ? suffix.toLowerCase() : suffix,
      zeroes
    }
  })(digits, null)

  const pretty = input / Math.pow(10, zeroes)

  precision = pretty % 1 === 0 ? 2 : Math.min(Math.max(1, precision), 21)

  // Return original number if less than 1K
  if (input > -1000 && input < 1000) {
    return input
  }

  return `${parseFloat(pretty.toPrecision(precision))}${suffix}`
}
