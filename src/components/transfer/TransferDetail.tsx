import type { FormEventHandler } from "react";
import { UserCard } from "@/components/ui/UserCard";
import type { User } from "@/types/user";

interface TransferDetailProps {
  recipient: User;
  amount: string;
  concept: string;
  isFormValid: boolean;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function TransferDetail({
  recipient,
  amount,
  concept,
  isFormValid,
  onAmountChange,
  onConceptChange,
  onSubmit,
}: TransferDetailProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col lg:flex-none">
      <UserCard
        imageSrc={recipient.avatar}
        name={recipient.fullname}
        variant="detail"
      />

      <form onSubmit={onSubmit} className="flex flex-1 flex-col lg:flex-none">
        <label htmlFor="amount" className="flex flex-col items-center">
          <span className="text-lg leading-7 text-foreground lg:text-xl">
            Monto a enviar
          </span>
          <span className="mt-1 flex max-w-full items-center justify-center text-3xl font-bold leading-10 text-foreground lg:text-4xl">
            <span aria-hidden="true">$</span>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              autoComplete="off"
              className="min-w-0 max-w-full appearance-none bg-transparent text-left outline-none placeholder:text-foreground [field-sizing:content]"
            />
          </span>
        </label>

        <label
          htmlFor="concept"
          className="mt-7 mb-3 text-base leading-6 text-foreground lg:mt-10 lg:text-lg"
        >
          Concepto
        </label>
        <textarea
          name="concept"
          id="concept"
          value={concept}
          onChange={(event) => onConceptChange(event.target.value)}
          placeholder="Ej. Cena"
          maxLength={25}
          className="h-28 w-full resize-none rounded-xl border border-border bg-muted/50 p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary lg:h-36 lg:p-5 lg:text-base"
        />

        <button
          disabled={!isFormValid}
          className="mt-auto w-full rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted-foreground disabled:hover:bg-muted-foreground lg:mt-10 lg:py-4 lg:text-lg"
          type="submit"
        >
          Continuar transferencia
        </button>
      </form>
    </div>
  );
}
