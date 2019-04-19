#!/usr/bin/env node

const millify = require('./')

require('yargs').command(
  '$0 <number> [options]',
  'convert number to pretty, human-readable string',
  yargs => {
    return yargs
      .positional('number', {
        describe: 'Value to convert',
        type: 'number',
      })
      .option('precision', {
        describe: 'Decimal places',
        alias: 'p',
        type: 'number',
        default: 2,
      })
      .option('decimal', {
        describe: 'Decimal separator (mark)',
        alias: 'd',
        type: 'string',
        default: '.',
      })
      .option('lower-case', {
        describe: 'Lowercase attributes',
        alias: 'l',
        type: 'boolean',
        default: false,
      })
      .option('space', {
        describe: 'Space after value',
        alias: 's',
        type: 'boolean',
        default: false,
      })
      .option('units', {
        describe: 'Unit abbreviatons',
        alias: 'u',
        type: 'string',
      })
      .example('$0 1000', 'Run with default options')
      .example('$0 15025 --precision 2', 'Set precision value')
      .example('$0 1000 --lowercase --space', 'Lowercase and space set to true')
      .example('$0 1000 --decimal=","', 'Commas as decimal separator')
      .example('$0 1000 -u B -u KB -u MB -u GB', 'Specify units')
  },
  argv => {
    const options = { ...argv, decimalSeparator: argv.d }
    // eslint-disable-next-line no-console
    console.log(millify(argv.number, options))
  }
).argv
