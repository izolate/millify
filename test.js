const { millify } = require("./dist/millify");
const test = require("ava");

test("returns a string", (t) => {
  t.is(typeof millify(100), "string");
});

test("uses correct suffixes with default options", (t) => {
  const tests = new Map([
    [100, "100"],
    [1000, "1K"],
    [1000000, "1M"],
    [1000000000, "1B"],
    [1000000000000, "1T"],
    [1000000000000000, "1P"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value), expected);
  }
});

test("uses correct suffixes with 'unsafeInteger' option", (t) => {
  const tests = new Map([
    [1000000000000000000, "1E"],
    [1000000000000000000000, "1Z"],
    [1000000000000000000000000, "1Y"],
    [1000000000000000000000000000, "1R"],
    [1700000000000000000000000000000, "1.7Q"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value, { unsafeInteger: true }), expected);
  }
});

test("uses correct suffixes without 'unsafeInteger' option", (t) => {
  const tests = new Map([
    ["1000000000000000000", "1000000000000000000"],
    ["1000000000000000000000", "1000000000000000000000"],
    ["1000000000000000000000000", "1000000000000000000000000"],
    ["1000000000000000000000000000", "1000000000000000000000000000"],
    ["1000000000000000000000000000000", "1000000000000000000000000000000"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value), expected);
  }
});

test("rounds up to the nearest group", (t) => {
  const tests = new Map([
    [999999, "1M"], // Not 1000K
    [999999999, "1B"], // Not 1000M
    [999999999999, "1T"], // Not 1000B
    [999000000000, "999B"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value, { precision: 1 }), expected);
  }
});

test("handles negative numbers like positive ones", (t) => {
  const tests = new Map([
    [-100, "-100"],
    [-1000, "-1K"],
    [-1000000, "-1M"],
    [-1000000000, "-1B"],
    [-1000000000000, "-1T"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value), expected);
  }
});

test("uses lowercase suffixes", (t) => {
  const options = { lowercase: true };
  const tests = new Map([
    [1000, "1k"],
    [1000000, "1m"],
    [1000000000, "1b"],
    [1000000000000, "1t"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value, options), expected);
  }
});

test("precision adjusts according to options", (t) => {
  const value = 12345.6789;
  const expected = [
    "12K",
    "12.3K",
    "12.35K",
    "12.346K",
    "12.3457K",
    "12.34568K",
    "12.345679K",
    "12.3456789K",
  ];

  expected.forEach((exp, precision) =>
    t.is(exp, millify(value, { precision })),
  );
});

test("formats to different languages", (t) => {
  const tests = new Map([
    ["en-US", "1.2"],
    ["de-DE", "1,2"],
    ["ar-SA", "١٫٢"],
  ]);
  for (const [locales, expected] of tests.entries()) {
    t.is(millify(1.2, { locales }), expected);
  }
});

test("allows a space between decimal and unit", (t) => {
  const result = millify(55500, { space: true });
  const expected = "55.5 K";
  t.is(expected, result);
});

test("allows custom units", (t) => {
  const options = { units: ["mg", "g", "kg", "tonne"], space: true };

  const tests = new Map([
    [Math.pow(10, 0), "1 mg"],
    [Math.pow(10, 3), "1 g"],
    [Math.pow(10, 6), "1 kg"],
    [Math.pow(10, 9), "1 tonne"],
  ]);

  for (const [value, expected] of tests.entries()) {
    t.is(millify(value, options), expected);
  }

  // It should return the original number if there is no unit available
  const largeVal = Math.pow(10, 12);
  t.is(millify(largeVal, options), largeVal.toString());
});

test("graceful fallback if value is invalid", (t) => {
  const invalidValues = [
    Number.MAX_SAFE_INTEGER + 1,
    Number.MIN_SAFE_INTEGER - 1,
    undefined,
    null,
    Symbol("foo"),
    new Set([1, 2, 3]),
    new Map(),
    { foo: 1 },
  ];
  for (const value of invalidValues) {
    t.is(String(value), millify(value));
  }
});

test("throws error if precision is invalid", (t) => {
  t.throws(() => millify(10000, { precision: Infinity }));
  t.throws(() => millify(10000, { precision: Math.PI }));
});

test("throws error if units is invalid", (t) => {
  t.throws(() => millify(1000, { units: [] }));
  t.throws(() => millify(1000, { units: {} }));
});
