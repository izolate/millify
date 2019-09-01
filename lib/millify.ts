import { defaultOptions, Options } from './options';
import { parseValue, roundTo } from './utils';

// Defines the result by the divider.
interface Result {
  value: number;
  count: number;
}

/**
 * A generator that divides a number [value] by a denominator,
 * defined by the grouping base (e.g. 1000 by default).
 *
 * Each successive turn multipies the base by itself, eventually
 * resulting in a decimal number and a turn count.
 *
 * @param {number} value - Number to be divided
 * @param {number} base - Grouping base/interval
 */
function* divider(value: number, base: number): IterableIterator<Result> {
  let denominator: number = base;
  let count: number = 0;

  while (true) {
    const result: number = value / denominator;
    if (result < 1) {
      return; // End of operation
    }

    yield { value: result, count: ++count };

    // Increase the denominator after each turn
    denominator *= base;
  }
}

/**
 * Millify converts long numbers to human-readable strings.
 *
 * @param {number} value - Number to convert
 * @param {Options} options
 */
function Millify(value: number, options: Options): string {
  // Override default options with supplied ones
  const opts: Options = { ...defaultOptions, ...options };

  if (!Array.isArray(opts.units) || !opts.units.length) {
    throw new Error('Units is empty or not an Array');
  }

  // Validate value for type and length
  let val: number = parseValue(value);

  // Add a minus sign (-) prefix if it's a negative number
  const prefix: string = val < 0 ? '-' : '';

  // Work with positive values
  val = Math.abs(val);

  // Keep dividing the input value by the numerical grouping value (base)
  // until the decimal and unit is deciphered
  let unitIndex: number = 0;
  for (const turn of divider(val, opts.base)) {
    val = turn.value;
    // unitIndex = turn.count;
    unitIndex += 1;
  }

  // Avoid out of bounds error by using the last available unit
  unitIndex = unitIndex > opts.units.length ? opts.units.length - 1 : unitIndex;

  // Calculate the unit suffix and apply lowercase option
  const suffix = opts.lowerCase
    ? opts.units[unitIndex].toLowerCase()
    : opts.units[unitIndex];

  // Add a space between number and abbreviation
  const space: string = opts.space ? ' ' : '';

  // Round decimal up to desired precision
  const rounded: number = roundTo(val, opts.precision);

  // Replace decimal mark if desired
  const formatted: string = rounded
    .toString()
    .replace(defaultOptions.decimalSeparator, opts.decimalSeparator);

  return `${prefix}${formatted}${space}${suffix}`;
}

export default Millify;
