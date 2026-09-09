import type { WalletMovement } from "@/types/wallet";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";

export function LatestTransactions({ movements }: { movements: WalletMovement[] }) {
  return (
    <section className="mt-8 lg:w-full lg:flex lg:flex-col lg:gap-4 lg:items-center" aria-labelledby="latest-transactions-title">
      <h2
        id="latest-transactions-title"
        className="mx-auto max-w-[390px] text-center text-xl leading-6 font-bold text-foreground"
      >
        Últimas transacciones
      </h2>
      {movements?.length > 0
        ? <ul className="mx-auto mt-6 flex w-full max-w-[390px] lg:mx-0 lg:max-w-none lg:px-[15%] flex-col gap-6">
          {movements.map((transaction) => (
            <li
              key={transaction.id}
              className="flex h-[52px] items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-muted">
                  <Image
                    src={`/icons/transactions/${transaction.type}.svg`}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="truncate text-lg leading-[22px] text-foreground">
                    {transaction.concept}
                  </h3>
                  <p className="truncate text-sm leading-[17px] text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 text-base leading-[19px] font-bold ${transaction.direction === "incoming"
                  ? "text-success"
                  : "text-destructive"
                  }`}
              >
                {transaction.direction === "incoming" ? "+" : "-"}{formatCurrency(transaction.amountCents)}
              </span>
            </li>
          ))}
        </ul>
        : <div className="py-8 text-center">
          <p className="text-sm font-medium text-foreground">
            Aún no hay actividad
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Tus transacciones aparecerán aquí
          </p>
        </div>
      }
    </section>
  );
}
