import { defaultOptions, Options, UserOptions } from "./options";
import { parseValue, roundTo } from "./utils";

/**
 * Divides a number [value] until a decimal value is found.
 *
 * A generator that divides a number [value] by a denominator,
 * defined by the grouping base (e.g. 1000 by default).
 *
 * The denominator is increased every turn by multiplying
 * the base by itself, until a decimal value is created.
 *
 * @param {number} value - Number to be divided
 * @param {number} base - Grouping base/interval
 */
function* divider(value: number, base: number): IterableIterator<number> {
  let denominator: number = base;

  while (true) {
    const result: number = value / denominator;
    if (result < 1) {
      return; // End of operation
    }

    yield result;

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
function Millify(value: number, userOptions: UserOptions = {}): string {
  // Override default options with supplied ones
  const options: Options = { ...defaultOptions, ...userOptions };

  if (!Array.isArray(options.units) || !options.units.length) {
    throw new Error("Option `units` must be a non-empty array");
  }

  // Validate value for type and length
  let val: number = parseValue(value);

  // Add a minus sign (-) prefix if it's a negative number
  const prefix: string = val < 0 ? "-" : "";

  // Work with positive values
  val = Math.abs(val);

  // Keep dividing the input value by the numerical grouping value (base)
  // until the decimal and unit index is deciphered
  let unitIndex: number = 0;
  for (const result of divider(val, options.base)) {
    val = result;
    unitIndex += 1;
  }

  // Avoid out of bounds error by using the last available unit
  unitIndex =
    unitIndex > options.units.length ? options.units.length - 1 : unitIndex;

  // Calculate the unit suffix and apply lowercase option
  const suffix = options.lowerCase
    ? options.units[unitIndex].toLowerCase()
    : options.units[unitIndex];

  // Add a space between number and abbreviation
  const space: string = options.space ? " " : "";

  // Round decimal up to desired precision
  const rounded: number = roundTo(val, options.precision);

  // Replace decimal mark if desired
  const formatted: string = rounded
    .toString()
    .replace(defaultOptions.decimalSeparator, options.decimalSeparator);

  return `${prefix}${formatted}${space}${suffix}`;
}

export default Millify;
