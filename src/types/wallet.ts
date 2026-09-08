export interface WalletMovementReceiver {
  id: string;
  name: string;
  image: string;
}

export interface WalletMovement {
  id: string;
  receiver: WalletMovementReceiver;
  concept: string;
  amountCents: number;
  date: Date;
}

export interface Wallet {
  balanceCents: number;
  movements: WalletMovement[];
}
