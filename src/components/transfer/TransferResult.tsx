import { UserCard } from "@/components/ui/UserCard";
import type { WalletMovement, WalletMovementParticipant } from "@/types/wallet";
import { formatCurrency } from "@/utils/format-currency";
import { formatMovementDate, formatMovementTime } from "@/utils/format-date";

interface TransferResultProps {
  movement: WalletMovement;
  participant: WalletMovementParticipant;
  canShare: boolean;
  onShare: () => void;
  onHome: () => void;
}

export function TransferResult({
  movement,
  participant,
  canShare,
  onShare,
  onHome,
}: TransferResultProps) {
  return (
    <main className="flex min-h-dvh flex-col justify-center gap-4 bg-primary p-4 sm:p-6 lg:gap-6 lg:p-12">
      <article className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-primary-foreground lg:grid-cols-2 lg:items-stretch lg:shadow-sm">
        <section className="flex flex-col items-center justify-center gap-6 px-6 py-10 text-center sm:px-10 lg:bg-muted lg:px-12 lg:py-16">
          <div>
            <h1 className="text-xl font-semibold text-primary lg:text-2xl">
              Transferencia realizada
            </h1>
            <p className="mt-1 text-sm text-muted-foreground lg:text-base">
              Tu transferencia se realizó correctamente
            </p>
          </div>

          <p className="text-3xl font-bold text-foreground lg:text-4xl">
            {formatCurrency(movement.amountCents)}
          </p>

          <div className="flex flex-col items-center gap-1">
            <p className="text-base font-bold text-foreground lg:text-lg">
              Enviado a
            </p>
            <UserCard
              imageSrc={participant.image}
              name={participant.name}
              variant="contact"
            />
          </div>
        </section>

        <section className="border-t border-border px-6 py-8 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:border-t-0 lg:border-l lg:px-12 lg:py-16">
          <h2 className="mb-4 text-lg font-semibold text-foreground lg:mb-6 lg:text-xl">
            Detalles de la transferencia
          </h2>

          <ul className="w-full divide-y divide-border">
            <TransferResultDetail label="Monto" value={formatCurrency(movement.amountCents)} />
            <TransferResultDetail label="Concepto" value={movement.concept} />
            <TransferResultDetail label="Fecha" value={formatMovementDate(movement.date)} />
            <TransferResultDetail label="Hora" value={formatMovementTime(movement.date)} />
            <TransferResultDetail label="Número de referencia" value={`#${movement.referenceNumber}`} />
          </ul>
        </section>
      </article>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row-reverse">
        {canShare ? (
          <button
            onClick={onShare}
            className="w-full rounded-full bg-white px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:py-4 sm:text-lg"
            type="button"
          >
            Compartir
          </button>
        ) : null}

        <button
          onClick={onHome}
          className="w-full rounded-full border border-primary-foreground px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:py-4 sm:text-lg"
          type="button"
        >
          Volver al inicio
        </button>
      </div>
    </main>
  );
}

function TransferResultDetail({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-6 py-3">
      <span className="shrink-0 text-sm text-muted-foreground sm:text-base">
        {label}
      </span>
      <span className="min-w-0 break-words text-right text-base font-bold text-foreground sm:text-lg">
        {value}
      </span>
    </li>
  );
}

function TransferResultState({ message }: { message: string }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-primary p-6 text-center text-lg font-semibold text-primary-foreground">
      <p>{message}</p>
    </main>
  );
}

export function TransferResultLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-primary text-primary-foreground">
      <p role="status" className="text-base font-semibold">
        Cargando transferencia...
      </p>
    </main>
  );
}

export function TransferResultNotFound() {
  return <TransferResultState message="No encontramos la transferencia" />;
}

export function TransferResultInvalid() {
  return <TransferResultState message="Movimiento inválido." />;
}

TransferResult.Loading = TransferResultLoading;
TransferResult.NotFound = TransferResultNotFound;
TransferResult.Invalid = TransferResultInvalid;
