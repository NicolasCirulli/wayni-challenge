/* global beforeEach, describe, expect, it, localStorage */
/* eslint-disable @typescript-eslint/no-require-imports */

const {
  getWallet,
  INITIAL_WALLET,
  initializeWallet,
  saveWallet,
} = require("../../src/services/wallet-service");

describe("servicio de billetera", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("devuelve null cuando no hay una billetera guardada", () => {
    expect(getWallet()).toBeNull();
  });

  it("crea y guarda la billetera inicial cuando no existe una", () => {
    const initialWallet = initializeWallet();

    expect(initialWallet).toEqual(INITIAL_WALLET);
    expect(getWallet()).toEqual(initialWallet);
  });

  it("devuelve la billetera guardada en lugar de crear una nueva", () => {
    const storedWallet = {
      balanceCents: 2_800_000,
      movements: [],
    };
    saveWallet(storedWallet);

    expect(initializeWallet()).toEqual(storedWallet);
  });

  it("guarda y recupera la billetera desde localStorage", () => {
    const wallet = {
      balanceCents: 2_800_000,
      movements: [
        {
          id: "movement-1",
          type: "transfer",
          direction: "outgoing",
          participant: {
            id: "user-1",
            name: "Rose Fleury",
            image: "https://randomuser.me/api/portraits/women/80.jpg",
          },
          concept: "Transfer",
          amountCents: 60_000,
          date: new Date("2026-09-08T12:00:00.000Z"),
        },
      ],
    };

    saveWallet(wallet);

    expect(getWallet()).toEqual(wallet);
  });

  it("conserva distintos tipos y direcciones de movimientos", () => {
    const wallet = {
      balanceCents: 2_800_000,
      movements: [
        {
          id: "movement-expense",
          type: "transfer",
          direction: "outgoing",
          participant: {
            id: "user-1",
            name: "Rose Fleury",
            image: "https://randomuser.me/api/portraits/women/80.jpg",
          },
          concept: "Internet",
          amountCents: 2_400,
          date: new Date("2026-09-08T10:00:00.000Z"),
        },
        {
          id: "movement-income",
          type: "cash-in",
          direction: "incoming",
          concept: "Cash in",
          amountCents: 26_000,
          date: new Date("2026-09-08T11:00:00.000Z"),
        },
      ],
    };

    saveWallet(wallet);

    expect(getWallet()).toEqual(wallet);
  });

  it("acepta una billetera que todavía no tiene movimientos", () => {
    const wallet = {
      balanceCents: 2_800_000,
      movements: [],
    };

    saveWallet(wallet);

    expect(getWallet()).toEqual(wallet);
  });

  it("no sobrescribe la billetera guardada con una billetera inválida", () => {
    const currentWallet = {
      balanceCents: 2_800_000,
      movements: [],
    };

    saveWallet(currentWallet);
    expect(() =>
      saveWallet({
        balanceCents: 2_800_000,
        movements: [{ id: "movement-invalid" }],
      }),
    ).toThrow("Invalid wallet");

    expect(getWallet()).toEqual(currentWallet);
  });

  it("devuelve la última billetera cuando se guarda más de una vez", () => {
    saveWallet({ balanceCents: 2_800_000, movements: [] });

    const latestWallet = {
      balanceCents: 2_740_000,
      movements: [
        {
          id: "movement-latest",
          type: "transfer",
          direction: "outgoing",
          participant: {
            id: "user-1",
            name: "Rose Fleury",
            image: "https://randomuser.me/api/portraits/women/80.jpg",
          },
          concept: "Transfer",
          amountCents: 60_000,
          date: new Date("2026-09-08T12:00:00.000Z"),
        },
      ],
    };

    saveWallet(latestWallet);

    expect(getWallet()).toEqual(latestWallet);
  });

  it("devuelve null cuando un movimiento es inválido", () => {
    localStorage.setItem(
      "wallet",
      JSON.stringify({
        balanceCents: 2_800_000,
        movements: [{ id: "movement-1", amountCents: 60_000 }],
      }),
    );

    expect(getWallet()).toBeNull();
  });

  it("rechaza movimientos con montos no positivos", () => {
    expect(() =>
      saveWallet({
        balanceCents: 2_800_000,
        movements: [
          {
            id: "movement-invalid-amount",
            type: "cash-in",
            direction: "incoming",
            concept: "Cash in",
            amountCents: 0,
            date: new Date("2026-09-08T12:00:00.000Z"),
          },
        ],
      }),
    ).toThrow("Invalid wallet");
  });

  it("devuelve null cuando el valor guardado no es una billetera válida", () => {
    localStorage.setItem("wallet", "invalid-json");

    expect(getWallet()).toBeNull();
  });

  it("reemplaza una billetera guardada inválida por la billetera inicial", () => {
    localStorage.setItem("wallet", "invalid-json");

    expect(initializeWallet()).toEqual(INITIAL_WALLET);
    expect(getWallet()).toEqual(INITIAL_WALLET);
  });
});
