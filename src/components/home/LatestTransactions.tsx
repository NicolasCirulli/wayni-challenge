import Image from "next/image";
import type { WalletMovement } from "@/types/wallet";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

export function LatestTransactions({
  movements,
}: {
  movements: WalletMovement[];
}) {
  return (
    <section
      className="mx-auto mt-8 w-full max-w-2xl"
      aria-labelledby="latest-transactions-title"
    >
      <h2
        id="latest-transactions-title"
        className="text-lg font-bold text-foreground sm:text-xl"
      >
        Últimas transacciones
      </h2>

      {movements?.length > 0 ? (
        <ul className="mt-4 flex flex-col divide-y divide-border">
          {movements.map((transaction) => {
            const isIncome = transaction.direction === "incoming";

            return (
              <li
                key={transaction.id}
                className="flex items-start justify-between gap-4 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Image
                      src={`/icons/transactions/${transaction.type}.svg`}
                      alt=""
                      width={22}
                      height={22}
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold leading-6 text-foreground">
                      {transaction.concept}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 text-base font-bold leading-6 sm:text-lg sm:leading-6 ${
                    isIncome ? "text-success" : "text-destructive"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amountCents)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-12 text-center">
          <p className="text-base font-semibold text-foreground">
            Aún no hay actividad
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tus transacciones aparecerán aquí
          </p>
        </div>
      )}
    </section>
  );
}

const TRANSACTION_SKELETONS = [0, 1, 2];

export function LatestTransactionsSkeleton() {
  return (
    <section
      className="mx-auto mt-8 w-full max-w-2xl"
      role="status"
      aria-label="Cargando últimas transacciones"
    >
      <h2
        id="latest-transactions-title"
        className="text-lg font-bold text-foreground sm:text-xl"
      >
        Últimas transacciones
      </h2>

      <ul className="mt-4 flex flex-col divide-y divide-border">
        {TRANSACTION_SKELETONS.map((skeleton) => (
          <li
            key={skeleton}
            className="flex items-start justify-between gap-4 py-3.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-11 shrink-0 animate-pulse rounded-full bg-gray-200" />

              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="h-4 w-32 animate-pulse rounded-md bg-gray-200 sm:w-40" />
                <div className="h-3 w-20 animate-pulse rounded-md bg-gray-200 sm:w-24" />
              </div>
            </div>

            <div className="h-5 w-24 shrink-0 animate-pulse rounded-md bg-gray-200 sm:w-28" />
          </li>
        ))}
      </ul>
    </section>
  );
}

LatestTransactions.Skeleton = LatestTransactionsSkeleton;
