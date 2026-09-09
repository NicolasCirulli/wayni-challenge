"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useUsers } from "@/hooks/useUsers";
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import { createMovement, applyMovement } from "@/services/wallet-service"
import { formatCurrency, stringAmountToCents } from "@/utils/format-currency";
import { UserCard } from "@/components/ui/UserCard";
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";

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
        <main className="flex min-h-dvh flex-col gap-4 bg-primary p-4 lg:grid lg:grid-cols-[minmax(20rem,0.85fr)_minmax(32rem,1.15fr)] lg:gap-0 lg:p-0">
            <header className="lg:flex lg:min-h-dvh lg:flex-col">
                <HeaderNavigation title="Confirmación" />
            </header>
            <section className="flex flex-1 flex-col gap-4 lg:min-h-dvh lg:justify-center lg:bg-background lg:px-16 lg:py-12 xl:px-24">
                {isDev && (<label className="flex items-center gap-2 bg-white w-30 p-2 rounded-lg">
                    <input
                        disabled={isSubmitting}
                        type="checkbox"
                        checked={forzarError}
                        onChange={(e) => setForzarError(e.target.checked)}
                    />
                    <span className="text-sm">Forzar error</span>
                </label>)}
                <article className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-3xl bg-primary-foreground px-6 py-7 sm:px-10 sm:py-9 lg:border lg:border-border lg:shadow-sm">
                    <div>
                        <h2 className="text-center text-xl font-semibold text-primary lg:text-2xl">Datos de la transferencia</h2>
                        <p className="mt-1 text-center text-sm text-muted-foreground lg:text-base">Revisá que todo esté correcto</p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-base text-muted-foreground">Vas a enviar a</p>
                        <UserCard imageSrc={recipient.avatar} name={recipient.fullname} variant="detail" />
                    </div>

                    <ul className="w-full border-t border-border pt-4 sm:pt-6">
                        <li className="flex items-start justify-between gap-6 py-2">
                            <span className="shrink-0 text-base text-muted-foreground sm:text-lg">Monto</span>
                            <span className="min-w-0 text-right text-lg font-bold text-foreground sm:text-xl">{formatCurrency(amountCents)}</span>
                        </li>
                        <li className="flex items-start justify-between gap-6 py-2">
                            <span className="shrink-0 text-base text-muted-foreground sm:text-lg">Concepto</span>
                            <span className="min-w-0 break-words text-right text-lg font-bold text-foreground sm:text-xl">{trimmedConcept}</span>
                        </li>
                    </ul>
                    <div className="mx-auto w-full h-20 max-w-2xl rounded-xl bg-white px-4 py-3 text-center">
                        {submitError ? (
                            <p role="alert" className=" text-sm font-semibold text-destructive">
                                {submitError}
                            </p>
                        ) : null}
                    </div>
                </article>


                <div className="mx-auto mt-auto flex w-full max-w-2xl flex-col gap-3 lg:mt-2 sm:flex-row-reverse">
                    <button
                        disabled={isSubmitting}
                        onClick={handleConfirm}
                        className="w-full rounded-full bg-white px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground disabled:cursor-not-allowed disabled:bg-muted-foreground disabled:text-white lg:bg-primary lg:py-4 lg:text-primary-foreground lg:hover:bg-primary/90 lg:focus-visible:outline-primary sm:text-lg"
                        type="button"
                    >
                        {isSubmitting ? "Procesando..." : submitError ? "Reintentar" : "Confirmar transferencia"}
                    </button>
                    <button
                        disabled={isSubmitting}
                        onClick={() => router.back()}
                        className="w-full rounded-full border border-primary-foreground px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground disabled:cursor-not-allowed disabled:bg-muted-foreground disabled:text-white lg:border-primary lg:py-4 lg:text-primary lg:hover:bg-primary/5 lg:focus-visible:outline-primary sm:text-lg"
                        type="button"
                    >
                        Volver
                    </button>
                </div>
            </section>
        </main>
    );
}
