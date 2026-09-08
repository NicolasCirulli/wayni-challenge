/* global beforeEach, describe, expect, it, localStorage */
/* eslint-disable @typescript-eslint/no-require-imports */

const {
  getWallet,
  initializeWallet,
  saveWallet,
} = require("../../src/services/wallet-service");

describe("wallet service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when there is no wallet saved", () => {
    expect(getWallet()).toBeNull();
  });

  it("creates and saves the initial wallet when none exists", () => {
    const initialWallet = initializeWallet();

    expect(initialWallet).toEqual({
      balanceCents: 280_000,
      movements: [],
    });
    expect(getWallet()).toEqual(initialWallet);
  });

  it("returns the stored wallet instead of creating a new one", () => {
    const storedWallet = {
      balanceCents: 2_800_000,
      movements: [],
    };
    saveWallet(storedWallet);

    expect(initializeWallet()).toEqual(storedWallet);
  });

  it("saves and retrieves the wallet from localStorage", () => {
    const wallet = {
      balanceCents: 2_800_000,
      movements: [
        {
          id: "movement-1",
          receiver: {
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

  it("preserves multiple movements and negative amounts", () => {
    const wallet = {
      balanceCents: 2_800_000,
      movements: [
        {
          id: "movement-expense",
          receiver: {
            id: "user-1",
            name: "Rose Fleury",
            image: "https://randomuser.me/api/portraits/women/80.jpg",
          },
          concept: "Internet",
          amountCents: -2_400,
          date: new Date("2026-09-08T10:00:00.000Z"),
        },
        {
          id: "movement-income",
          receiver: {
            id: "user-2",
            name: "Marco Rossi",
            image: "https://randomuser.me/api/portraits/men/10.jpg",
          },
          concept: "Cash in",
          amountCents: 26_000,
          date: new Date("2026-09-08T11:00:00.000Z"),
        },
      ],
    };

    saveWallet(wallet);

    expect(getWallet()).toEqual(wallet);
  });

  it("accepts a wallet without movements yet", () => {
    const wallet = {
      balanceCents: 2_800_000,
      movements: [],
    };

    saveWallet(wallet);

    expect(getWallet()).toEqual(wallet);
  });

  it("does not overwrite the stored wallet with an invalid wallet", () => {
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

  it("returns the latest wallet when it is saved more than once", () => {
    saveWallet({ balanceCents: 2_800_000, movements: [] });

    const latestWallet = {
      balanceCents: 2_740_000,
      movements: [
        {
          id: "movement-latest",
          receiver: {
            id: "user-1",
            name: "Rose Fleury",
            image: "https://randomuser.me/api/portraits/women/80.jpg",
          },
          concept: "Transfer",
          amountCents: -60_000,
          date: new Date("2026-09-08T12:00:00.000Z"),
        },
      ],
    };

    saveWallet(latestWallet);

    expect(getWallet()).toEqual(latestWallet);
  });

  it("returns null when a movement is invalid", () => {
    localStorage.setItem(
      "wallet",
      JSON.stringify({
        balanceCents: 2_800_000,
        movements: [{ id: "movement-1", amountCents: 60_000 }],
      }),
    );

    expect(getWallet()).toBeNull();
  });

  it("returns null when the stored value is not a valid wallet", () => {
    localStorage.setItem("wallet", "invalid-json");

    expect(getWallet()).toBeNull();
  });

  it("replaces an invalid stored wallet with the initial wallet", () => {
    localStorage.setItem("wallet", "invalid-json");

    expect(initializeWallet()).toEqual({
      balanceCents: 280_000,
      movements: [],
    });
    expect(getWallet()).toEqual({
      balanceCents: 280_000,
      movements: [],
    });
  });
});
