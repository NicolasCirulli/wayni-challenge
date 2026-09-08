const TRANSACTION_SKELETONS = [0, 1];

export function LatestTransactionsSkeleton() {
  return (
    <section
      className="mt-8 lg:w-full lg:flex lg:flex-col lg:gap-4 lg:items-center"
      role="status"
      aria-label="Cargando últimas transacciones"
    >
      <h2
        id="latest-transactions-title"
        className="mx-auto max-w-[390px] text-center text-xl leading-6 font-bold text-foreground"
      >
        Últimas transacciones
      </h2>

      <ul className="mx-auto mt-6 flex w-full max-w-[390px] flex-col gap-6 lg:mx-0 lg:max-w-none lg:px-[15%]">
        {TRANSACTION_SKELETONS.map((skeleton) => (
          <li
            key={skeleton}
            className="flex h-[52px] items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-[52px] shrink-0 animate-pulse rounded-full bg-gray-300" />

              <div className="flex min-w-0 flex-col gap-1">
                <div className="h-[22px] w-32 animate-pulse rounded bg-gray-300" />
                <div className="h-[17px] w-24 animate-pulse rounded bg-gray-300" />
              </div>
            </div>

            <div className="h-[19px] w-20 shrink-0 animate-pulse rounded bg-gray-300" />
          </li>
        ))}
      </ul>
    </section>
  );
}
