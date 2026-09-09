/* global beforeEach, describe, expect, it, jest, localStorage */
/* eslint-disable @typescript-eslint/no-require-imports */

const {
  createMovement,
  getWallet,
  INITIAL_WALLET,
  initializeWallet,
  saveWallet,
  applyMovement,
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

  it("genera una referencia de 8 dígitos y reintenta si ya fue usada", () => {
    const randomSpy = jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5);
    const movementData = {
      recipient: {
        id: "user-1",
        name: "Rose Fleury",
        image: "https://randomuser.me/api/portraits/women/80.jpg",
      },
      amountCents: 60_000,
      concept: "Transfer",
    };

    const firstMovement = createMovement(movementData);
    const secondMovement = createMovement(movementData);

    expect(firstMovement.referenceNumber).toBe("10000000");
    expect(secondMovement.referenceNumber).toBe("55000000");
    expect(firstMovement.referenceNumber).toMatch(/^\d{8}$/);
    expect(secondMovement.referenceNumber).toMatch(/^\d{8}$/);
    expect(randomSpy).toHaveBeenCalledTimes(3);

    randomSpy.mockRestore();
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
          referenceNumber: "12345678",
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
          referenceNumber: "23456789",
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
          referenceNumber: "34567890",
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
          referenceNumber: "45678901",
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
            referenceNumber: "56789012",
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

  it("rechaza números de referencia que no tengan exactamente 8 dígitos", () => {
    expect(() =>
      saveWallet({
        balanceCents: 2_800_000,
        movements: [
          {
            id: "movement-invalid-reference",
            referenceNumber: "12AB-678",
            type: "cash-in",
            direction: "incoming",
            concept: "Cash in",
            amountCents: 60_000,
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

  it("no permite una transferencia mayor al saldo", () => {
    saveWallet({
      balanceCents: 10_000,
      movements: []
    })
    const movement = createMovement({
      recipient: {
        id: "1",
        name: "Nicolas",
        image: "/nicolas.png"
      },
      amountCents: 20_000,
      concept: "Test"
    })
    expect(() => applyMovement(movement)).toThrow()

    const wallet = getWallet()
    expect(wallet.balanceCents).toBe(10_000)
    expect(wallet.movements).toHaveLength(0)

  })
});
