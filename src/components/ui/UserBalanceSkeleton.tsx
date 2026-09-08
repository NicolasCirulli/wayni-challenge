export function UserBalanceSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-2 text-primary-foreground"
      role="status"
      aria-label="Cargando saldo"
    >
      <div className="h-[19px] w-24 animate-pulse rounded bg-primary-foreground/50" />
      <div className="h-[39px] w-36 animate-pulse rounded bg-primary-foreground/50" />
    </div>
  );
}
