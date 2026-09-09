/* global describe, expect, it */
/* eslint-disable @typescript-eslint/no-require-imports */

const {
  formatCurrency,
  stringAmountToCents,
} = require("../../src/utils/format-currency");

describe("formatCurrency", () => {
  it("convierte centavos a pesos argentinos", () => {
    expect(formatCurrency(2_800_000)).toBe("$\u00a028.000,00");
  });

  it("formatea la parte decimal de un saldo", () => {
    expect(formatCurrency(12_345)).toBe("$\u00a0123,45");
  });
});

describe("stringAmountToCents", () => {
  it.each([
    ["10", 1_000],
    ["10.5", 1_050],
    ["10,5", 1_050],
    ["10.50", 1_050],
    ["0.01", 1],
    ["0001.05", 105],
  ])("convierte %s a %i centavos", (amount, expectedCents) => {
    expect(stringAmountToCents(amount)).toBe(expectedCents);
  });

  it.each([
    "",
    "0",
    "0.00",
    "0,00",
    "-1",
    "10.",
    "10,",
    "10.123",
    "1.2.3",
    "abc",
    " 10",
    "10 ",
  ])("devuelve null para el monto inválido %j", (amount) => {
    expect(stringAmountToCents(amount)).toBeNull();
  });

  it("devuelve null para montos que no pueden representarse con seguridad", () => {
    expect(stringAmountToCents("999999999999999")).toBeNull();
  });
});
