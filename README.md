# Millify
Converts long `numbers` into pretty, human-readable `strings`.

Before :unamused: | After :tada:
--- | ---
`2000` | `'2K'`
`10000` | `'10k'`
`42500` | `'42.5 kg'`
`1250000` | `'1.25 MB'`
`2700000000` | `'2.7 bil'`


## Install

Get it on [npm](https://www.npmjs.com/package/millify):

```bash
npm install millify
```

## Command line
```bash
millify 10000
# 10K
```
See `millify --help` for options.

## Programmatic usage

### `millify(number, options)`

```js
import millify from 'millify'

millify(2500)
// 2.5K

millify(1024000, {
  precision: 3,
  lowerCase: true
})
// 1.024m

millify(39500, {
  precision: 2,  
  decimalSeparator: ','
})
// 3,95K

millify(1440000, {
  units: ['B', 'KB', 'MB', 'GB'],
  space: true,
})
// 1.44 MB
```

## Options

Name | Type | Default | Description
--- | --- | --- | ---
`precision` | `number` | `2` | Number of significant figures to use
`decimalSeparator` | `string` | `'.'` | Desired decimal separator (e.g. decimal point or comma)
`lowerCase` | `boolean` | `false` | Use lowercase abbreviations
`space` | `boolean` | `false` | Add a space between number and abbreviation
`units` | `Array<string>` | `['', 'K', 'M', 'B', 'T', 'P', 'E']` | Unit abbreviations
