/* global describe, expect, it */
/* eslint-disable @typescript-eslint/no-require-imports */

const { formatCurrency } = require("../../src/utils/format-currency");

describe("formatCurrency", () => {
  it("convierte centavos a pesos argentinos", () => {
    expect(formatCurrency(2_800_000)).toBe("$\u00a028.000,00");
  });

  it("formatea la parte decimal de un saldo", () => {
    expect(formatCurrency(12_345)).toBe("$\u00a0123,45");
  });
});
