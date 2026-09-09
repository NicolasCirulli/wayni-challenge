import Image from "next/image";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import type { WalletMovement } from "@/types/wallet";
import Link from "next/link";

interface LatestTransfersProps {
    movements: WalletMovement[];
}

export function LatestTransfers({ movements }: LatestTransfersProps) {
    if (movements.length === 0) {
        return (
            <div className="flex min-h-96 w-full flex-col items-center justify-center gap-2 p-8 text-center">
                <p className="text-lg font-bold text-foreground">Todavía no hay movimientos</p>
                <p className="text-base text-muted-foreground sm:text-lg">
                    Acá te vamos a mostrar los movimientos cuando empieces a utilizar tu billetera.
                </p>
                <Link
                    href="/transfer"
                    className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                    Hacer una transferencia
                </Link>
            </div>
        );
    }

    return (
        <ul className="mx-auto flex w-full max-w-2xl min-w-0 flex-col divide-y divide-border">
            {movements.map((movement) => (
                <li
                    key={movement.id}
                    className="flex w-full min-w-0 items-center justify-between gap-4 py-3.5"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <Image
                            className="size-12 shrink-0 rounded-full object-cover"
                            src={movement.participant?.image ?? "/icons/transactions/transfer.svg"}
                            width={48}
                            height={48}
                            alt={movement.participant ? `Avatar usuario ${movement.participant.name}` : ""}
                        />
                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-foreground sm:text-lg">
                                {movement.participant?.name ?? movement.concept}
                            </p>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                {formatDate(movement.date)}
                            </p>
                        </div>
                    </div>
                    <p className={`shrink-0 text-right text-base font-bold sm:text-lg ${movement.direction === "incoming" ? "text-success" : "text-destructive"}`}>
                        {movement.direction === "incoming" ? "+" : "-"}
                        {formatCurrency(movement.amountCents)}
                    </p>
                </li>
            ))}
        </ul>
    );
}

const TRANSFER_SKELETONS = Array.from({ length: 7 });

export function LatestTransfersSkeleton() {
    return (
        <ul
            role="status"
            aria-label="Cargando últimas transferencias"
            className="mx-auto flex w-full max-w-2xl flex-col divide-y divide-border"
        >
            {TRANSFER_SKELETONS.map((_, index) => (
                <li
                    key={`transfer-skeleton-${index}`}
                    className="flex items-center justify-between gap-4 py-3.5"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 animate-pulse rounded-full bg-gray-200" />
                        <div className="flex flex-col gap-1.5">
                            <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
                            <div className="h-3 w-20 animate-pulse rounded-md bg-gray-200" />
                        </div>
                    </div>
                    <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />
                </li>
            ))}
        </ul>
    );
}

LatestTransfers.Skeleton = LatestTransfersSkeleton;
