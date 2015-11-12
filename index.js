'use strict'

const suffixes = new Map()
suffixes.set(3, 'K')
suffixes.set(6, 'M')
suffixes.set(9, 'B')
suffixes.set(12, 'T')

// Figure out the appropriate unit for the number
const units = (num) => {
  let zeroes
  for (let z of suffixes.keys()) if (num > z) zeroes = z
  return { suffix: suffixes.get(zeroes), zeroes }
}

// Figure out how many digits in the integer
const digits = (num => Math.floor(Math.log10(Math.abs(num))) + 1)

// Make sure value is a number
const validate = (num => {
  num = parseFloat(num)
  if (isNaN(num)) throw new Error('Not a number')
  else return num
})

module.exports = (ugly, decimal) => {

  ugly = validate(ugly)

  const d = digits(ugly), unit = units(d)
  const pretty = ugly/Math.pow(10, unit.zeroes)

  decimal = (pretty % 1 === 0) ? 1 : Math.max(1, (decimal + 1)) || 2

  if (ugly < 1000) return ugly
  else return `${parseFloat(pretty.toPrecision(decimal))}${unit.suffix}`
}
