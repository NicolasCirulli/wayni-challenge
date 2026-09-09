'use client'
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@/hooks/useWallet"
import { useTransferDraftStore } from "@/store/transfer-draft-store"
import { formatCurrency } from "@/utils/format-currency"
import { formatMovementDate, formatMovementTime } from "@/utils/format-date"
import { UserCard } from "@/components/ui/UserCard"

export default function Result() {
    const { id } = useParams()
    const router = useRouter()

    const { wallet, isLoading } = useWallet()
    const resetDraft = useTransferDraftStore((store) => store.resetDraft)

    const movement = wallet?.movements.find(movement => movement.id === id)
    const isValidResultMovement = movement?.type === "transfer" && movement?.direction === "outgoing" && movement?.participant !== undefined
    useEffect(() => {
        if (isValidResultMovement) {
            resetDraft()
        }
    }, [isValidResultMovement, resetDraft])


    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function"
    const handleShare = async () => {
        if (!movement || !movement.participant || !canShare) return
        try {
            await navigator.share({
                title: "Transferencia realizada",
                text: `Detalles de la transferencia,
Monto: ${formatCurrency(movement.amountCents)}
Destinatario: ${movement.participant.name}
Concepto: ${movement.concept}
Referencia: #${movement.referenceNumber}`
            });
        } catch (error) {
            console.error(error)
            return
        }

    }

    if (isLoading) return <main className="flex min-h-dvh items-center justify-center bg-primary text-primary-foreground">
        <p role="status" className="text-base font-semibold">Cargando transferencia...</p>
    </main>
    if (!movement) return <main className="flex min-h-dvh items-center justify-center bg-primary p-6 text-center text-lg font-semibold text-primary-foreground">
        No encontramos la transferencia
    </main>
    if (!isValidResultMovement) return <main className="flex min-h-dvh items-center justify-center bg-primary p-6 text-center text-lg font-semibold text-primary-foreground">
        Movimiento inválido.
    </main>
    return (
        <main className="flex min-h-dvh flex-col justify-center gap-4 bg-primary p-4 sm:p-6 lg:gap-6 lg:p-12">
            <article className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-primary-foreground lg:min-h-[32rem] lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:shadow-sm">
                <section className="flex flex-col items-center justify-center gap-6 px-6 py-8 text-center sm:px-10 lg:bg-muted lg:px-12">
                    <div>
                        <h2 className="text-xl font-semibold text-primary lg:text-2xl">
                            Transferencia realizada
                        </h2>
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
                        {movement.participant && (<UserCard
                            imageSrc={movement?.participant.image}
                            name={movement?.participant.name}
                            variant="contact"
                        />)}
                    </div>
                </section>

                <section className="border-t border-border px-6 py-7 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:border-t-0 lg:border-l lg:px-12">
                    <h3 className="mb-4 text-lg font-semibold text-foreground lg:mb-6 lg:text-xl">Detalles de la transferencia</h3>

                    <ul className="w-full">
                        <li className="flex items-start justify-between gap-6 border-b border-border py-3">
                            <span className="shrink-0 text-base text-muted-foreground">Monto</span>
                            <span className="min-w-0 text-right text-base font-bold text-foreground sm:text-lg">{formatCurrency(movement.amountCents)}</span>
                        </li>
                        <li className="flex items-start justify-between gap-6 border-b border-border py-3">
                            <span className="shrink-0 text-base text-muted-foreground">Concepto</span>
                            <span className="min-w-0 break-words text-right text-base font-bold text-foreground sm:text-lg">{movement.concept}</span>
                        </li>
                        <li className="flex items-start justify-between gap-6 border-b border-border py-3">
                            <span className="shrink-0 text-base text-muted-foreground">Fecha</span>
                            <span className="min-w-0 text-right text-base font-bold text-foreground sm:text-lg">{formatMovementDate(movement.date)}</span>
                        </li>
                        <li className="flex items-start justify-between gap-6 border-b border-border py-3">
                            <span className="shrink-0 text-base text-muted-foreground">Hora</span>
                            <span className="min-w-0 text-right text-base font-bold text-foreground sm:text-lg">{formatMovementTime(movement.date)}</span>
                        </li>
                        <li className="flex items-start justify-between gap-6 py-3">
                            <span className="shrink-0 text-base text-muted-foreground">Número de referencia</span>
                            <span className="min-w-0 break-all text-right text-base font-bold text-foreground sm:text-lg">#{movement.referenceNumber}</span>
                        </li>
                    </ul>
                </section>
            </article>

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row-reverse">
                <button
                    onClick={handleShare}
                    className={canShare ? "w-full rounded-full bg-white px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:py-4 sm:text-lg" : "hidden"}
                    type="button"
                >
                    Compartir
                </button>

                <button
                    onClick={() => router.replace("/")}
                    className="w-full rounded-full border border-primary-foreground px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:py-4 sm:text-lg"
                    type="button"
                >
                    Volver al inicio
                </button>
            </div>
        </main>
    )

}
