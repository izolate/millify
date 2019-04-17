const millify = require('.')

const inputs = [
  10,
  100,
  500,
  1000,
  1250,
  5000,
  9999,
  10000,
  545999,
  1000001,
  1500000,
]

options = {
  precision: 2
}

inputs.forEach(num => {
  console.log(`${num} => ${millify(num, options)}`)
})
