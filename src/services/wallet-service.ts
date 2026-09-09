import type {
  Wallet,
  WalletMovement,
  WalletMovementParticipant,
} from "@/types/wallet";

const REFERENCE_NUMBER_PATTERN = /^\d{8}$/;
const generatedReferenceNumbers = new Set<string>();

export const WALLET_STORAGE_KEY = "wallet";
export const INITIAL_WALLET: Wallet = {
  balanceCents: 105_000_000,
  movements: [
    {
      id: "movement-transfer-outgoing",
      referenceNumber: createReferenceNumber(),
      type: "transfer",
      direction: "outgoing",
      participant: {
        id: "user-josefina",
        name: "Josefina Ruiz",
        image: "/images/users/josefina.png",
      },
      concept: "Transferencia",
      amountCents: 60_000_000,
      date: new Date("2026-09-08T12:00:00.000Z"),
    },
    {
      id: "movement-cash-in",
      referenceNumber: createReferenceNumber(),
      type: "cash-in",
      direction: "incoming",
      concept: "Ingreso de dinero",
      amountCents: 120_000_000,
      date: new Date("2026-09-07T15:30:00.000Z"),
    },
    {
      id: "movement-transfer-incoming",
      referenceNumber: createReferenceNumber(),
      type: "transfer",
      direction: "incoming",
      participant: {
        id: "user-marco",
        name: "Marco Rossi",
        image: "/images/users/marco.png",
      },
      concept: "Transferencia recibida",
      amountCents: 45_000_000,
      date: new Date("2026-09-06T10:15:00.000Z"),
    },
  ],
};
export const WALLET_UPDATED_EVENT = "wallet_storage_updated";
type StoredWalletMovement = Omit<WalletMovement, "date"> & {
  date: string;
};

type StoredWallet = Omit<Wallet, "movements"> & {
  movements: StoredWalletMovement[];
};

type CreateTransferMovementParams = {
  recipient: WalletMovementParticipant;
  amountCents: number;
  concept: string;
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
function createReferenceNumber(
  existingReferenceNumbers: Iterable<string> = [],
): string {
  const usedReferenceNumbers = new Set([
    ...existingReferenceNumbers,
    ...generatedReferenceNumbers,
  ]);
  let referenceNumber: string;

  do {
    referenceNumber = Math.floor(
      10_000_000 + Math.random() * 90_000_000,
    ).toString();
  } while (usedReferenceNumbers.has(referenceNumber));

  generatedReferenceNumbers.add(referenceNumber);

  return referenceNumber;
}

export function createMovement(
  { recipient, amountCents, concept }: CreateTransferMovementParams
): WalletMovement {
  const existingReferenceNumbers =
    getWallet()?.movements.map((movement) => movement.referenceNumber) ?? [];

  return {
    id: crypto.randomUUID(),
    referenceNumber: createReferenceNumber(existingReferenceNumbers),
    type: "transfer",
    direction: "outgoing",
    participant: recipient,
    concept,
    amountCents,
    date: new Date(),
  };
}

export function applyMovement(
  movement: WalletMovement,
): Wallet {
  const wallet = getWallet();

  if (!wallet) {
    throw new Error("Wallet no inicializada");
  }

  if (movement.direction !== "outgoing") {
    throw new Error("El movimiento debe ser saliente");
  }

  if (
    !Number.isSafeInteger(movement.amountCents) ||
    movement.amountCents <= 0
  ) {
    throw new Error("Monto inválido");
  }

  if (movement.amountCents > wallet.balanceCents) {
    throw new Error("Saldo insuficiente");
  }

  const updatedWallet: Wallet = {
    balanceCents: wallet.balanceCents - movement.amountCents,
    movements: [
      movement,
      ...wallet.movements,
    ],
  };

  saveWallet(updatedWallet);

  return updatedWallet;
}

//helpers
function isWalletMovementParticipant(
  value: unknown,
): value is WalletMovementParticipant {
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
    "type" in value &&
    (value.type === "transfer" || value.type === "cash-in") &&
    "direction" in value &&
    (value.direction === "incoming" || value.direction === "outgoing") &&
    (!("participant" in value) ||
      value.participant === undefined ||
      isWalletMovementParticipant(value.participant)) &&
    "concept" in value &&
    typeof value.concept === "string" &&
    "amountCents" in value &&
    typeof value.amountCents === "number" &&
    Number.isSafeInteger(value.amountCents) &&
    value.amountCents > 0 &&
    "referenceNumber" in value &&
    typeof value.referenceNumber === "string" &&
    REFERENCE_NUMBER_PATTERN.test(value.referenceNumber)
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
    Number.isSafeInteger(value.balanceCents) &&
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
