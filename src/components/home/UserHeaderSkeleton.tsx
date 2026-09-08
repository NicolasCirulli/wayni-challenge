export function UserHeaderSkeleton() {
  return (
    <div
      className="flex items-center gap-[14px] lg:flex-col lg:gap-[32px]"
      role="status"
      aria-label="Cargando usuario"
    >
      <div className="size-[34px] shrink-0 animate-pulse rounded-full bg-primary-foreground/50 lg:size-[64px]" />
      <div className="h-[18px] w-28 animate-pulse rounded bg-primary-foreground/50 lg:h-6 lg:w-36" />
    </div>
  );
}
