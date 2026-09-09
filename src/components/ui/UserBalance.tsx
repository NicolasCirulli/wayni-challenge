type UserBalanceProps = {
  amount: string;
  label?: string;
};

export function UserBalance({
  amount,
  label = "Tu saldo",
}: UserBalanceProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-primary-foreground">
      <span className="text-sm leading-5">{label}</span>
      <strong className="text-xl font-bold leading-10">{amount}</strong>
    </div>
  );
}

export function UserBalanceSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-2 text-primary-foreground"
      role="status"
      aria-label="Cargando saldo"
    >
      <div className="h-5 w-24 animate-pulse rounded bg-primary-foreground/50" />
      <div className="h-10 w-36 animate-pulse rounded bg-primary-foreground/50" />
    </div>
  );
}

UserBalance.Skeleton = UserBalanceSkeleton;
