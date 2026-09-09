import { WalletMovement } from "@/types/wallet";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";


interface LatestTransfersProps {
    movements: WalletMovement[];
}

export function LatestTransfers({ movements }: LatestTransfersProps) {
    if (movements.length === 0) {
        return <div className="flex flex-col justify-center items-center gap-2 h-[400px] w-full p-8">
            <p className="font-bold text-lg text-foreground">Todavía no hay movimientos</p>
            <p className="text-lg text-muted-foreground text-center">
                Acá te vamos a mostrar los movimientos cuando empieces a utilizar tu billetera.
            </p>
        </div>
    }
    return <ul className="flex flex-col gap-4 min-w-0">
        {
            movements.map(m => <li key={m.id} className="w-full min-w-0 grid grid-cols-[2fr_1fr] justify-between items-center gap-4 px-2">
                <div className="flex gap-2 items-center min-w-0">
                    <Image
                        className="rounded-full shrink-0"
                        src={m.receiver.image}
                        width={60} height={60}
                        alt={`Avatar usuario ${m.receiver.name}`}
                    />
                    <div className="min-w-0">
                        <p className="text-foreground text-lg truncate">{m.receiver.name}</p>
                        <p className="text-muted-foreground text-sm">{formatDate(m.date)}</p>
                    </div>
                </div>
                <p className="font-bold text-xl text-end text-destructive">{formatCurrency(m.amountCents)}</p>
            </li>)
        }
    </ul>
}