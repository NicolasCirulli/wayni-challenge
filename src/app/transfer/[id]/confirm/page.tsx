"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useUsers } from "@/hooks/useUsers";
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import { createMovement, applyMovement } from "@/services/wallet-service"
import { formatCurrency, stringAmountToCents } from "@/utils/format-currency";
import { TransferConfirmation } from "@/components/transfer/TransferConfirmation";
import { TransferScreenLayout } from "@/components/ui/TransferScreenLayout";

export default function TransferConfirm() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { recipient, amount, concept, resetDraft } = useTransferDraftStore((state) => state);

    const { wallet, isLoading } = useWallet();
    const { user, isLoading: isUserLoading } = useUsers();

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [forzarError, setForzarError] = useState(false);
    const submitLockRef = useRef(false);

    const amountCents = stringAmountToCents(amount);

    const isLoadingData = isLoading || isUserLoading;

    const isRecipientInvalid = !user || !recipient || recipient.id !== id || recipient.id === user.id;

    const isAmountInvalid = amountCents === null || amountCents <= 0 || !wallet || amountCents > wallet.balanceCents;

    const trimmedConcept = concept.trim();

    const isConceptInvalid = trimmedConcept.length === 0 || trimmedConcept.length > 25;

    useEffect(() => {
        if (isLoadingData) return;

        if (isRecipientInvalid) {
            resetDraft();
            router.replace("/transfer");
            return;
        }

        if (isAmountInvalid || isConceptInvalid) {
            router.replace(`/transfer/${recipient.id}/detail`);
        }
    }, [isLoadingData, isRecipientInvalid, isAmountInvalid, isConceptInvalid, recipient, resetDraft, router,]);

    if (isLoadingData || isRecipientInvalid || isAmountInvalid || isConceptInvalid) {
        return null;
    }

    const isDev = process.env.NODE_ENV === 'development'

    const handleConfirm = async () => {
        if (submitLockRef.current) return;

        submitLockRef.current = true;
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            if (forzarError) {
                throw new Error("Error simulado");
            }
            const movement = createMovement({
                recipient: {
                    id: recipient.id,
                    name: recipient.fullname,
                    image: recipient.avatar,
                },
                amountCents,
                concept: trimmedConcept,
            });

            applyMovement(movement)

            router.replace(`/transfer/result/${movement.id}`)
        } catch {
            setSubmitError("No pudimos realizar la transferencia. Intentá nuevamente.");
            submitLockRef.current = false;
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <TransferScreenLayout.Split title="Confirmación">
                <TransferConfirmation
                    recipient={recipient}
                    formattedAmount={formatCurrency(amountCents)}
                    concept={trimmedConcept}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    showErrorControl={isDev}
                    forceError={forzarError}
                    onForceErrorChange={setForzarError}
                    onConfirm={handleConfirm}
                    onBack={() => router.back()}
                />
            </TransferScreenLayout.Split>
        </>
    );
}
