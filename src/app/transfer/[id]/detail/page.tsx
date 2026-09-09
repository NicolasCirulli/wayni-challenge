"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useUsers } from "@/hooks/useUsers"
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import { formatCurrency, stringAmountToCents } from "@/utils/format-currency";
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";
import { UserBalance } from "@/components/ui/UserBalance";
import { UserCard } from "@/components/ui/UserCard";

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
        <main className="flex min-h-dvh w-full flex-col bg-primary lg:grid lg:grid-cols-[minmax(20rem,0.85fr)_minmax(32rem,1.15fr)]">
            <header className="pb-4 lg:flex lg:min-h-dvh lg:flex-col lg:pb-0">
                <HeaderNavigation title={title} />
                <div className="lg:flex lg:flex-1 lg:items-center lg:justify-center lg:pb-24">
                    <UserBalance amount={formatCurrency(wallet.balanceCents)} />
                </div>
            </header>

            <RoundedContainer className="flex flex-1 flex-col px-7 pt-1 pb-6 md:px-12 lg:min-h-dvh lg:justify-center lg:px-16 lg:py-12 xl:px-24">
                <div className="mx-auto flex w-full max-w-xl flex-1 flex-col lg:max-w-2xl lg:flex-none">
                    <UserCard
                        imageSrc={recipient.avatar}
                        name={recipient.fullname}
                        variant="detail"
                    />

                    <form onSubmit={handleSubmit} className="flex flex-1 flex-col lg:flex-none">
                        <label htmlFor="amount" className="flex flex-col items-center">
                            <span className="text-lg leading-7 text-foreground lg:text-xl">Monto a enviar</span>
                            <span className="flex items-center justify-center text-[28px] leading-10 font-bold text-foreground lg:mt-1 lg:text-4xl lg:leading-12">
                                <span aria-hidden="true">$</span>
                                <input
                                    id="amount"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    autoComplete="off"
                                    className="min-w-[1ch] max-w-[14ch] appearance-none bg-transparent text-left outline-none placeholder:text-foreground [field-sizing:content]"
                                />
                            </span>
                        </label>

                        <label htmlFor="concept" className="mt-7 mb-3 text-base leading-6 text-foreground lg:mt-10 lg:text-lg">
                            Concepto
                        </label>
                        <textarea
                            name="concept"
                            id="concept"
                            value={concept}
                            onChange={(event) => setConcept(event.target.value)}
                            placeholder="Ej. Cena"
                            maxLength={25}
                            className="h-28 w-full resize-none rounded-xl border border-border bg-[#f7f7f7] p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary lg:h-36 lg:p-5 lg:text-base"
                        />

                        <button
                            disabled={!isFormValid}
                            className="disabled:bg-muted-foreground mt-auto w-full rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:hover:bg-muted-foreground lg:mt-10 lg:py-4 lg:text-lg"
                            type="submit"
                        >
                            Continuar transferencia
                        </button>
                    </form>
                </div>
            </RoundedContainer>
        </main>
    );
}
