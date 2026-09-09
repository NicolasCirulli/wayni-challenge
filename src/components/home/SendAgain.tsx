"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCard } from "@/components/ui/UserCard";
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import type { User } from "@/types/user";

type SendAgainProps = {
  contacts: User[];
};

export function SendAgain({ contacts }: SendAgainProps) {
  const { setRecipient, setFrom, resetDraft } = useTransferDraftStore(
    (state) => state,
  );
  const router = useRouter();

  const handleSelectRecipient = (contact: User) => {
    resetDraft();
    setRecipient(contact);
    setFrom("send-again");
    router.push(`/transfer/${contact.id}/detail`);
  };

  return (
    <section aria-labelledby="send-again-title" className="mx-auto w-full max-w-2xl">
      <h2
        id="send-again-title"
        className="text-lg font-bold text-foreground sm:text-xl"
      >
        Enviar de nuevo
      </h2>

      <div className="mt-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible sm:pb-0">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-4">
            <span className="text-sm text-muted-foreground">
              Sin destinatarios recientes
            </span>
            <Link
              className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              href="/transfer"
            >
              Transferir
            </Link>
          </div>
        ) : (
          <div className="flex w-max gap-3 sm:grid sm:w-full sm:grid-cols-2 md:grid-cols-5 sm:gap-3">
            {contacts.map((contact) => (
              <button
                type="button"
                onClick={() => handleSelectRecipient(contact)}
                key={contact.id}
                className="shrink-0 rounded-2xl p-1 text-left transition-all hover:scale-105 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-primary sm:w-full"
              >
                <UserCard imageSrc={contact.avatar} name={contact.fullname} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const CONTACT_SKELETONS = Array.from({ length: 10 });

export function SendAgainSkeleton() {
  return (
    <section aria-labelledby="send-again-title" className="mx-auto w-full max-w-2xl">
      <h2
        id="send-again-title"
        className="text-lg font-bold text-foreground sm:text-xl"
      >
        Enviar de nuevo
      </h2>

      <div className="mt-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible sm:pb-0">
        <div className="flex w-max gap-3 sm:grid sm:w-full sm:grid-cols-2 md:grid-cols-5 sm:gap-3">
          {CONTACT_SKELETONS.map((_, index) => (
            <div
              key={`contact-skeleton-${index}`}
              className="flex items-center gap-2 rounded-2xl p-2 sm:w-full"
            >
              <div className="size-12 shrink-0 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200 sm:w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SendAgainError({ refetch }: { refetch: () => void }) {
  return (
    <section aria-labelledby="send-again-title" className="mx-auto w-full max-w-2xl">
      <h2
        id="send-again-title"
        className="text-lg font-bold text-foreground sm:text-xl"
      >
        Enviar de nuevo
      </h2>

      <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl bg-muted/60 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No pudimos cargar tus contactos frecuentes
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-1 rounded-xl bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
        >
          Reintentar
        </button>
      </div>
    </section>
  );
}

SendAgain.Skeleton = SendAgainSkeleton;
SendAgain.Error = SendAgainError;
