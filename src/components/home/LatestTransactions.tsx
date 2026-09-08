import type { WalletMovement } from "@/types/wallet";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";

function formatMovementDate(date: Date): string {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${formattedDate} · ${formattedTime}`;
}

export function LatestTransactions({ movements }: { movements: WalletMovement[] }) {
  return (
    <section className="mt-8 lg:w-full lg:flex lg:flex-col lg:gap-4 lg:items-center" aria-labelledby="latest-transactions-title">
      <h2
        id="latest-transactions-title"
        className="mx-auto max-w-[390px] text-center text-xl leading-6 font-bold text-foreground"
      >
        Latest Transaction
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
                    src="/icons/transactions/transfer.svg"
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
                    {formatMovementDate(transaction.date)}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 text-base leading-[19px] font-bold ${transaction.amountCents > 0
                  ? "text-success"
                  : "text-destructive"
                  }`}
              >
                {formatCurrency(transaction.amountCents)}
              </span>
            </li>
          ))}
        </ul>
        : <p className="py-8 text-center text-muted-foreground"> No hay movimientos </p>
      }
    </section>
  );
}
