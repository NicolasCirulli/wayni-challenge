import { UserCard } from "@/components/ui/UserCard";
import type { User } from "@/types/user";

interface TransferConfirmationProps {
  recipient: User;
  formattedAmount: string;
  concept: string;
  isSubmitting: boolean;
  submitError: string | null;
  showErrorControl: boolean;
  forceError: boolean;
  onForceErrorChange: (forceError: boolean) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function TransferConfirmation({
  recipient,
  formattedAmount,
  concept,
  isSubmitting,
  submitError,
  showErrorControl,
  forceError,
  onForceErrorChange,
  onConfirm,
  onBack,
}: TransferConfirmationProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 lg:flex-none">
      {showErrorControl ? (
        <label className="flex w-fit items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <input
            disabled={isSubmitting}
            type="checkbox"
            checked={forceError}
            onChange={(event) => onForceErrorChange(event.target.checked)}
          />
          <span className="text-sm text-foreground">Forzar error</span>
        </label>
      ) : null}

      <article className="flex w-full flex-col items-center gap-6 rounded-3xl border border-border bg-background px-6 py-7 shadow-sm sm:px-10 sm:py-9">
        <div>
          <h2 className="text-center text-xl font-semibold text-primary lg:text-2xl">
            Datos de la transferencia
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground lg:text-base">
            Revisá que todo esté correcto
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-base text-muted-foreground">Vas a enviar a</p>
          <UserCard
            imageSrc={recipient.avatar}
            name={recipient.fullname}
            variant="detail"
          />
        </div>

        <ul className="w-full divide-y divide-border border-t border-border pt-3">
          <li className="flex items-start justify-between gap-6 py-3">
            <span className="shrink-0 text-base text-muted-foreground sm:text-lg">
              Monto
            </span>
            <span className="min-w-0 text-right text-lg font-bold text-foreground sm:text-xl">
              {formattedAmount}
            </span>
          </li>
          <li className="flex items-start justify-between gap-6 py-3">
            <span className="shrink-0 text-base text-muted-foreground sm:text-lg">
              Concepto
            </span>
            <span className="min-w-0 break-words text-right text-lg font-bold text-foreground sm:text-xl">
              {concept}
            </span>
          </li>
        </ul>

        <div className="min-h-10 w-full text-center">
          {submitError ? <TransferConfirmation.Error message={submitError} /> : null}
        </div>
      </article>

      <div className="mt-auto flex w-full flex-col gap-3 sm:flex-row-reverse lg:mt-2">
        <button
          disabled={isSubmitting}
          onClick={onConfirm}
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted-foreground disabled:text-white sm:text-lg lg:py-4"
          type="button"
        >
          {isSubmitting
            ? "Procesando..."
            : submitError
              ? "Reintentar"
              : "Confirmar transferencia"}
        </button>
        <button
          disabled={isSubmitting}
          onClick={onBack}
          className="w-full rounded-full border border-primary px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted-foreground disabled:text-white sm:text-lg lg:py-4"
          type="button"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export function TransferConfirmationError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-sm font-semibold text-destructive">
      {message}
    </p>
  );
}

TransferConfirmation.Error = TransferConfirmationError;
