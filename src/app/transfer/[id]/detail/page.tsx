"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useUsers } from "@/hooks/useUsers"
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import { formatCurrency, stringAmountToCents } from "@/utils/format-currency";
import { TransferDetail } from "@/components/transfer/TransferDetail";
import { TransferScreenLayout } from "@/components/ui/TransferScreenLayout";
import { UserBalance } from "@/components/ui/UserBalance";

export default function Transfer() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { recipient, from, amount, setAmount, concept, setConcept, resetDraft } = useTransferDraftStore((state) => state);
    const { wallet, isLoading } = useWallet();
    const { user, isLoading: isUserLoading } = useUsers()

    useEffect(() => {
        if (isLoading || isUserLoading) return;

        if (!user || !recipient || recipient.id !== id || user.id === recipient.id) {
            resetDraft()
            router.replace("/transfer");
        }
    }, [id, recipient, user, isLoading, isUserLoading, router, resetDraft]);

    if (isLoading || isUserLoading || !wallet || !user || !recipient || recipient.id !== id || user.id === recipient.id) {
        return null;
    }

    const amountCents = stringAmountToCents(amount);
    const isAmountValid = amountCents !== null && amountCents <= wallet.balanceCents && amountCents > 0;
    const isConceptValid = concept.trim().length > 0 && concept.trim().length <= 25;

    const isFormValid = isAmountValid && isConceptValid;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid || amountCents === null) return;
        router.push(`/transfer/${recipient.id}/confirm`);
    };

    const title = from === "transfer" ? "Completar Transferencia" : from === "send-again" ? "Enviar de nuevo" : "";

    return (
        <>
            <TransferScreenLayout.Split
                title={title}
                headerContent={<UserBalance amount={formatCurrency(wallet.balanceCents)} />}
            >
                <TransferDetail
                    recipient={recipient}
                    amount={amount}
                    concept={concept}
                    isFormValid={isFormValid}
                    onAmountChange={setAmount}
                    onConceptChange={setConcept}
                    onSubmit={handleSubmit}
                />
            </TransferScreenLayout.Split>
        </>
    );
}
