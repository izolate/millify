import { defaultOptions, MillifyOptions } from "./options";
import { getFractionDigits, parseValue, roundTo } from "./utils";

// Most commonly used digit grouping base.
const DIGIT_GROUPING_BASE = 1000;

/**
 * Generator that divides a number until a decimal value is found.
 *
 * The denominator is defined by the numerical digit grouping base,
 * or interval. The most commonly-used digit group interval is 1000.
 *
 * e.g. 1,000,000 is grouped in multiples of 1000.
 */
function* divider(value: number): IterableIterator<number> {
  // Create a mutable copy of the base.
  let denominator = DIGIT_GROUPING_BASE;

  while (true) {
    const result = value / denominator;
    if (result < 1) {
      // End of operation. We can't divide the value any further.
      return;
    }

    yield result;

    // The denominator is increased every iteration by multiplying
    // the base by itself, until a decimal value remains.
    denominator *= DIGIT_GROUPING_BASE;
  }
}

/**
 * millify converts long numbers to human-readable strings.
 */
function millify(value: number, options?: Partial<MillifyOptions>): string {
  // Override default options with options supplied by user.
  const opts: MillifyOptions = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;

  if (!Array.isArray(opts.units) || !opts.units.length) {
    throw new Error("Option `units` must be a non-empty array");
  }

  // If the input value is invalid, then return the value in string form.
  // Originally this threw an error, but was changed to return a graceful fallback.
  let val: number;
  try {
    val = parseValue(value);
  } catch (e) {
    if (e instanceof Error) {
      console.warn(`WARN: ${e.message} (millify)`);
    }
    // Invalid values will be converted to string as per `String()`.
    return String(value);
  }

  // Add a minus sign (-) prefix if it's a negative number.
  const prefix = val < 0 ? "-" : "";

  // Work only with positive values for simplicity's sake.
  val = Math.abs(val);

  // Keep dividing the input value by the digit grouping base
  // until the decimal and the unit index is deciphered.
  let unitIndex = 0;
  for (const result of divider(val)) {
    val = result;
    unitIndex += 1;
  }

  // Return the original number if the number is too large to have
  // a corresponding unit. Returning anything else is ambiguous.
  const unitIndexOutOfRange = unitIndex >= opts.units.length;
  if (unitIndexOutOfRange) {
    // At this point we don't know what to do with the input value,
    // so we return it as is, without localizing the string.
    return value.toString();
  }

  // Round decimal up to desired precision.
  let rounded = roundTo(val, opts.precision);

  // Fixes an edge case bug that outputs certain numbers as 1000K instead of 1M.
  // The rounded value needs another iteration in the divider cycle.
  for (const result of divider(rounded)) {
    rounded = result;
    unitIndex += 1;
  }

  // Calculate the unit suffix and make it lowercase (if needed).
  const unit = opts.units[unitIndex] ?? "";
  const suffix = opts.lowercase ? unit.toLowerCase() : unit;

  // Add a space between number and abbreviation.
  const space = opts.space ? " " : "";

  // Format the number according to the desired locale.
  const formatted = rounded.toLocaleString(opts.locales, {
    // toLocaleString needs the explicit fraction digits.
    minimumFractionDigits: getFractionDigits(rounded),
  });

  return `${prefix}${formatted}${space}${suffix}`;
}

export { millify };

export default millify;
