import { defaultOptions, Options } from "./options";
import { parseValue, roundTo } from "./utils";

/**
 * Divides a number [value] until a decimal value is found.
 *
 * A generator that divides a number [value] by a denominator,
 * defined by the grouping base (interval) - `1000` by default.
 *
 * The denominator is increased every turn by multiplying
 * the base by itself, until a decimal value is realized.
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
 */
function Millify(value: number, userOptions?: Partial<Options>): string {
  // Override default options with options supplied by user
  const options: Options = userOptions
    ? { ...defaultOptions, ...userOptions }
    : defaultOptions;

  if (!Array.isArray(options.units) || !options.units.length) {
    throw new Error("Option `units` must be a non-empty array");
  }

  // Validate value for type and length
  let val: number = parseValue(value);

  // Add a minus sign (-) prefix if it's a negative number
  const prefix: string = val < 0 ? "-" : "";

  // Work only with positive values for simplicity's sake
  val = Math.abs(val);

  // Keep dividing the input value by the numerical grouping value (base)
  // until the decimal and unit index is deciphered
  let unitIndex: number = 0;
  for (const result of divider(val, options.base!)) {
    val = result;
    unitIndex += 1;
  }

  // Account for out of range errors in case the units array is not complete.
  const unitIndexOutOfRange = unitIndex >= options.units.length

  // Calculate the unit suffix and make it lowercase (if needed).
  let suffix = ""
  if (!unitIndexOutOfRange) {
    const unit = options.units[unitIndex]
    suffix = options.lowerCase ? unit.toLowerCase() : unit
  } else {
    // tslint:disable-next-line:no-console
    console.warn("[Millify] Length of `units` array is insufficient. Add another number unit to remove this warning.")
  }

  // Add a space between number and abbreviation
  const space: string = options.space && !unitIndexOutOfRange ? " " : "";

  // Round decimal up to desired precision
  const rounded: number = roundTo(val, options.precision!);

  // Replace decimal mark if desired
  const formatted: string = rounded
    .toString()
    .replace(defaultOptions.decimalSeparator!, options.decimalSeparator!);

  return `${prefix}${formatted}${space}${suffix}`;
}

export default Millify;
