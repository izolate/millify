/**
 * Options used to configure Millify.
 */
export interface MillifyOptions {
  /**
   * The number of significant figures.
   */
  precision: number;
  /**
   * The active browser or server location. A string with a BCP 47 language
   * tag, or an array of such strings, e.g. "en-US".
   */
  locales?: string | string[];
  /**
   * Convert units to lower case.
   */
  lowercase: boolean;
  /**
   * Add a space between the number and the unit.
   */
  space: boolean;
  /**
   * A list of units to use.
   */
  units: string[];
  /**
   * Use unsafe integer
   * */
  unsafeInteger: boolean;
}

/**
 * Default options for Millify.
 */
export const defaultOptions: MillifyOptions = {
  lowercase: false,
  precision: 1,
  space: false,
  unsafeInteger: false,
  units: [
    "",
    "K", // Thousand
    "M", // Million
    "B", // Billion
    "T", // Trillion
    "P", // Quadrillion
    "E", // Quintillion
    "Z", // Sextillion
    "Y", // Septillion
    "R", // Octillion
    "Q", // Nonillion
  ],
};
