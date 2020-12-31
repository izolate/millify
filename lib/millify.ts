import { Options, defaultOptions } from "./options";
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
 * millify converts long numbers to human-readable strings.
 */
function millify(value: number, options?: Partial<Options>): string {
  // Override default options with options supplied by user
  const opts: Options = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;

  // Allow backwards compatibility with API changes to lowercase option
  if (options?.lowerCase !== undefined) {
    opts.lowercase = options.lowerCase;
  }

  if (!Array.isArray(opts.units) || !opts.units.length) {
    throw new Error("Option `units` must be a non-empty array");
  }

  // Validate value for type and length
  let val = parseValue(value);

  // Add a minus sign (-) prefix if it's a negative number
  const prefix = val < 0 ? "-" : "";

  // Work only with positive values for simplicity's sake
  val = Math.abs(val);

  // Keep dividing the input value by the numerical grouping value (base)
  // until the decimal and unit index is deciphered
  let unitIndex = 0;
  for (const result of divider(val, opts.base)) {
    val = result;
    unitIndex += 1;
  }

  // Account for out of range errors in case the units array is not complete.
  const unitIndexOutOfRange = unitIndex >= opts.units.length;

  // Calculate the unit suffix and make it lowercase (if needed).
  let suffix = "";
  if (!unitIndexOutOfRange) {
    const unit = opts.units[unitIndex];
    suffix = opts.lowercase ? unit.toLowerCase() : unit;
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      "[millify] `options.units` array is of insufficient length. Add another unit to silence this warning.",
    );
  }

  // Add a space between number and abbreviation
  const space: string = opts.space && !unitIndexOutOfRange ? " " : "";

  // Round decimal up to desired precision
  const rounded = roundTo(val, opts.precision);

  // Replace decimal mark if desired
  const formatted = rounded
    .toString()
    .replace(defaultOptions.decimalSeparator, opts.decimalSeparator);

  return `${prefix}${formatted}${space}${suffix}`;
}

export { millify };

export default millify;
