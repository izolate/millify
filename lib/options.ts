/**
 * Default options for Millify.
 */
export const defaultOptions: MillifyOptions = {
  decimalSeparator: ".",
  lowercase: false,
  precision: 1,
  space: false,
  units: [
    "",
    "K", // Thousand
    "M", // Million
    "B", // Billion
    "T", // Trillion
    "P", // Quadrillion
    "E", // Quintillion
  ],
};
