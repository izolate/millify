/**
 * parseValue ensures the value is a number and within accepted range.
 */
export function parseValue(value: number): number {
  const val: number = parseFloat(value?.toString());

  if (isNaN(val)) {
    throw new Error(`Input value is not a number`);
  }
  if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
    throw new RangeError("Input value is outside of safe integer range");
  }
  return val;
}

/**
 * Rounds a number [value] up to a specified [precision].
 */
export function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("Input value is not a finite number");
  }
  if (!Number.isInteger(precision) || precision < 0) {
    throw new Error("Precision is not a positive integer");
  }
  if (Number.isInteger(value)) {
    return value;
  }
  return parseFloat(value.toFixed(precision));
}

/**
 * Returns the number of digits after the decimal.
 */
export function getFractionDigits(num: number): number {
  if (Number.isInteger(num)) {
    return 0;
  }
  const decimalPart = num.toString().split(".")[1];
  return decimalPart?.length ?? 0;
}

/**
 * Returns the default browser locales.
 */
export function getLocales(): string[] {
  if (typeof navigator === "undefined") {
    return [];
  }
  return Array.from(navigator.languages ?? []);
}
