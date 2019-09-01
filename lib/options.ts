/**
 * Defines the options for Millify.
 */
export interface Options {
  // Number of significant figures
  precision: number;
  // Type of decimal marker (e.g. ".")
  decimalSeparator: string;
  // Lowercase units
  lowerCase: boolean;
  // Space between number and unit
  space: boolean;
  // Numerical group
  base: number;
  // List of units
  units: string[];
}

/**
 * Default options for Millify
 */
export const defaultOptions: Options = {
  base: 1000,
  decimalSeparator: '.',
  lowerCase: false,
  precision: 2,
  space: false,
  units: [
    '',
    'K', // Thousand
    'M', // Million
    'B', // Billion
    'T', // Trillion
    'P', // Quadrillion
    'E', // Quintillion
  ],
};
