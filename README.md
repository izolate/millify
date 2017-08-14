# millify
Converts long `numbers` into pretty, human-readable `strings`.

Examples:

* `45000` to `"45K"`
* `1250000` to `"1.25M"`

## Install

Get it on [npm](https://www.npmjs.com/package/millify):

```bash
npm i millify
```
## Usage

### CLI

```bash
$ millify 10000
# 10K
```
Requires Node `7.6` or later. See `millify --help` for options.

### Programmatically

**`millify(number, decimal)`**

```js
import millify from 'millify'

millify(2500)
// 2.5K

millify(1250000, 3)
// 1.25M

millify(5000000000)
// 5B
```

### Options

Name | Type | Default | Description
--- | --- | --- | ---
number | `number` | - | Input number
precision | `number` | 2 | Number of significant figures
lowercase | `boolean` | false | Lowercase abbreviations
