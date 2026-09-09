import { UserCard } from "@/components/ui/UserCard";
import type { User } from "@/types/user";

interface TransferRecipientsProps {
  contacts: User[];
  onSelect: (contact: User) => void;
}

export function TransferRecipients({
  contacts,
  onSelect,
}: TransferRecipientsProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center text-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            No hay contactos disponibles
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cuando tengas contactos, aparecerán acá.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
      {contacts.map((contact) => (
        <li
          key={contact.id}
          className="group flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1 transition-colors hover:bg-muted focus-within:bg-muted sm:border sm:border-border sm:bg-background sm:p-3 sm:shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <UserCard imageSrc={contact.avatar} name={contact.fullname} />
          </div>
          <button
            onClick={() => onSelect(contact)}
            type="button"
            aria-label={`Transferir a ${contact.fullname}`}
            className="group/selector flex size-10 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span
              aria-hidden="true"
              className="size-7 rotate-180 bg-foreground transition-colors [mask-image:url('/icons/navigation/arrow_left_alt.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:bg-primary group-focus-visible/selector:bg-primary"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

const RECIPIENT_SKELETONS = Array.from({ length: 9 });

export function TransferRecipientsSkeleton() {
  return (
    <ul
      className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4"
      role="status"
      aria-label="Cargando contactos"
    >
      {RECIPIENT_SKELETONS.map((_, index) => (
        <li
          key={`recipient-skeleton-${index}`}
          className="flex items-center gap-3 rounded-2xl p-3 sm:border sm:border-border"
        >
          <div className="size-12 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 flex-1 animate-pulse rounded-md bg-gray-200" />
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}

export function TransferRecipientsError({ refetch }: { refetch: () => void }) {
  return (
    <div
      className="flex min-h-80 flex-col items-center justify-center gap-3 text-center"
      role="alert"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          No pudimos cargar tus contactos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisá tu conexión e intentá nuevamente.
        </p>
      </div>
      <button
        type="button"
        onClick={refetch}
        className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
      >
        Reintentar
      </button>
    </div>
  );
}

TransferRecipients.Skeleton = TransferRecipientsSkeleton;
TransferRecipients.Error = TransferRecipientsError;
