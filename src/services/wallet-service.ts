import type {
  Wallet,
  WalletMovement,
  WalletMovementReceiver,
} from "@/types/wallet";

export const WALLET_STORAGE_KEY = "wallet";
export const INITIAL_WALLET: Wallet = {
  balanceCents: 280_000,
  movements: [],
};
export const WALLET_UPDATED_EVENT = "wallet_storage_updated";
type StoredWalletMovement = Omit<WalletMovement, "date"> & {
  date: string;
};

type StoredWallet = Omit<Wallet, "movements"> & {
  movements: StoredWalletMovement[];
};

let ultimoStorage: string | null = null;
let ultimaWallet: Wallet | null = null;

export function saveWallet(wallet: Wallet): void {
  if (!isWallet(wallet)) {
    throw new Error("Invalid wallet");
  }

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  dispararEventoUpdate();
}

export function getWallet(): Wallet | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedWallet = window.localStorage.getItem(WALLET_STORAGE_KEY);

  if (storedWallet === ultimoStorage && ultimaWallet !== null) {
    return ultimaWallet
  }

  if (storedWallet === null) {
    ultimoStorage = null;
    ultimaWallet = null;
    return null;
  }

  try {
    const parsedWallet: unknown = JSON.parse(storedWallet);

    if (!isStoredWallet(parsedWallet)) {
      ultimoStorage = storedWallet
      ultimaWallet = null
      return null
    }
    const wallet = {
      ...parsedWallet,
      movements: parsedWallet.movements.map((movement) => ({
        ...movement,
        date: new Date(movement.date),
      })),
    };

    ultimoStorage = storedWallet
    ultimaWallet = wallet

    return wallet
  } catch {
    return null;
  }
}

export function initializeWallet(): Wallet {
  if (typeof window === "undefined") {
    return INITIAL_WALLET;
  }

  const wallet = getWallet();

  if (wallet) {
    return wallet;
  }

  saveWallet(INITIAL_WALLET);

  return INITIAL_WALLET;
}

//helpers
function isWalletMovementReceiver(
  value: unknown,
): value is WalletMovementReceiver {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "image" in value &&
    typeof value.image === "string"
  );
}

function hasWalletMovementData(
  value: unknown,
): value is Omit<WalletMovement, "date"> {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "receiver" in value &&
    isWalletMovementReceiver(value.receiver) &&
    "concept" in value &&
    typeof value.concept === "string" &&
    "amountCents" in value &&
    typeof value.amountCents === "number" &&
    Number.isInteger(value.amountCents)
  );
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function isWalletMovement(value: unknown): value is WalletMovement {
  return (
    hasWalletMovementData(value) &&
    "date" in value &&
    isValidDate(value.date)
  );
}

function hasWalletData(
  value: unknown,
): value is { balanceCents: number; movements: unknown[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "balanceCents" in value &&
    typeof value.balanceCents === "number" &&
    Number.isInteger(value.balanceCents) &&
    "movements" in value &&
    Array.isArray(value.movements)
  );
}

function isWallet(value: unknown): value is Wallet {
  return hasWalletData(value) && value.movements.every(isWalletMovement);
}

function isStoredWalletMovement(
  value: unknown,
): value is StoredWalletMovement {
  return (
    hasWalletMovementData(value) &&
    "date" in value &&
    typeof value.date === "string" &&
    !Number.isNaN(Date.parse(value.date))
  );
}

function isStoredWallet(value: unknown): value is StoredWallet {
  return (
    hasWalletData(value) &&
    value.movements.every(isStoredWalletMovement)
  );
}

function dispararEventoUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
  }
}
