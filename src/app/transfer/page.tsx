"use client";

import { useRouter } from "next/navigation";
import { TransferRecipients } from "@/components/transfer/TransferRecipients";
import { TransferScreenLayout } from "@/components/ui/TransferScreenLayout";
import { useUsers } from "@/hooks/useUsers";
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import type { User } from "@/types/user";

export default function Transfer() {
  const { contacts, isLoading, isError, refetch } = useUsers();
  const setRecipient = useTransferDraftStore((state) => state.setRecipient);
  const setFrom = useTransferDraftStore((state) => state.setFrom);
  const resetDraft = useTransferDraftStore((state) => state.resetDraft);
  const router = useRouter();

  const handleSelectRecipient = (contact: User) => {
    resetDraft();
    setRecipient(contact);
    setFrom("transfer");
    router.push(`/transfer/${contact.id}/detail`);
  };

  return (
    <TransferScreenLayout title="Realizar Transferencia">
      <TransferRecipientsContent
        contacts={contacts}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        onSelect={handleSelectRecipient}
      />
    </TransferScreenLayout>
  );
}

function TransferRecipientsContent({
  contacts,
  isLoading,
  isError,
  refetch,
  onSelect,
}: {
  contacts: User[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onSelect: (contact: User) => void;
}) {
  if (isLoading) return <TransferRecipients.Skeleton />;
  if (isError) return <TransferRecipients.Error refetch={refetch} />;
  return <TransferRecipients contacts={contacts} onSelect={onSelect} />;
}
