export type WalletMovementDirection = "incoming" | "outgoing";

export type WalletMovementType = "transfer" | "cash-in";

export interface WalletMovementParticipant {
  id: string;
  name: string;
  image: string;
}

export interface WalletMovement {
  id: string;
  type: WalletMovementType;
  direction: WalletMovementDirection;
  participant?: WalletMovementParticipant;
  concept: string;
  amountCents: number;
  date: Date;
  referenceNumber: string;
}

export interface Wallet {
  balanceCents: number;
  movements: WalletMovement[];
}