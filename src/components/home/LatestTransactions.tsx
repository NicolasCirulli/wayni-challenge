import Image from "next/image";

const transactions = [
  {
    title: "Internet",
    date: "May 16, 2023 · 17:34",
    amount: "-$ 24.000",
    icon: "/icons/transactions/internet.svg",
    iconWidth: 22,
    iconHeight: 22,
    type: "expense",
  },
  {
    title: "Transfer",
    date: "Yesterday · 19:12",
    amount: "-$ 600.000",
    icon: "/icons/transactions/transfer.svg",
    iconWidth: 23,
    iconHeight: 23,
    type: "expense",
  },
  {
    title: "CashIn",
    date: "May 29, 2023 · 19:12",
    amount: "+ $260.000",
    icon: "/icons/transactions/cash-in.svg",
    iconWidth: 22,
    iconHeight: 23,
    type: "income",
  },
  {
    title: "Insurance",
    date: "April 23, 2023 · 11:28",
    amount: "-$100.000",
    icon: "/icons/transactions/insurance.svg",
    iconWidth: 22,
    iconHeight: 22,
    type: "expense",
  },
  {
    title: "Transfer",
    date: "Yesterday · 19:12",
    amount: "-$ 600.000",
    icon: "/icons/transactions/transfer-repeat.svg",
    iconWidth: 23,
    iconHeight: 23,
    type: "expense",
  },
  {
    title: "Transfer",
    date: "Yesterday · 19:12",
    amount: "-$ 600.000",
    icon: "/icons/transactions/transfer-repeat.svg",
    iconWidth: 23,
    iconHeight: 23,
    type: "expense",
  },
] as const;

export function LatestTransactions() {
  return (
    <section className="mt-8 lg:w-full lg:flex lg:flex-col lg:gap-4 lg:items-center" aria-labelledby="latest-transactions-title">
      <h2
        id="latest-transactions-title"
        className="mx-auto max-w-[390px] text-center text-xl leading-6 font-bold text-foreground"
      >
        Latest Transaction
      </h2>

      <ul className="mx-auto mt-6 flex w-full max-w-[390px] lg:mx-0 lg:max-w-none lg:px-[15%] flex-col gap-6">
        {transactions.map((transaction, index) => (
          <li
            key={`${transaction.title}-${transaction.date}-${index}`}
            className="flex h-[52px] items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-muted">
                <Image
                  src={transaction.icon}
                  alt=""
                  width={transaction.iconWidth}
                  height={transaction.iconHeight}
                  unoptimized
                />
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="truncate text-lg leading-[22px] text-foreground">
                  {transaction.title}
                </h3>
                <p className="truncate text-sm leading-[17px] text-muted-foreground">
                  {transaction.date}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 text-base leading-[19px] font-bold ${transaction.type === "income"
                ? "text-success"
                : "text-destructive"
                }`}
            >
              {transaction.amount}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
