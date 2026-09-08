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
      <span className="text-base leading-[19px]">{label}</span>
      <strong className="text-[32px] leading-[39px] font-bold">{amount}</strong>
    </div>
  );
}
