"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TransferResult } from "@/components/transfer/TransferResult";
import { useWallet } from "@/hooks/useWallet";
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import { formatCurrency } from "@/utils/format-currency";

export default function Result() {
  const { id } = useParams();
  const router = useRouter();

  const { wallet, isLoading } = useWallet();
  const resetDraft = useTransferDraftStore((store) => store.resetDraft);

  const movement = wallet?.movements.find((movement) => movement.id === id);
  const isValidResultMovement =
    movement?.type === "transfer" &&
    movement.direction === "outgoing" &&
    movement.participant !== undefined;

  useEffect(() => {
    if (isValidResultMovement) {
      resetDraft();
    }
  }, [isValidResultMovement, resetDraft]);

  const canShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  const handleShare = async () => {
    if (!movement || !movement.participant || !canShare) return;

    try {
      await navigator.share({
        title: "Transferencia realizada",
        text: `Detalles de la transferencia,
Monto: ${formatCurrency(movement.amountCents)}
Destinatario: ${movement.participant.name}
Concepto: ${movement.concept}
Referencia: #${movement.referenceNumber}`,
      });
    } catch (error) {
      console.error(error);
      return;
    }
  };

  if (isLoading) return <TransferResult.Loading />;
  if (!movement) return <TransferResult.NotFound />;
  if (!isValidResultMovement || !movement.participant) {
    return <TransferResult.Invalid />;
  }

  return (
    <>
      <TransferResult
        movement={movement}
        participant={movement.participant}
        canShare={canShare}
        onShare={handleShare}
        onHome={() => router.replace("/")}
      />
    </>
  );
}
