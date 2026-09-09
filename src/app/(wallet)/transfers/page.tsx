'use client'
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { LatestTransfers } from "@/components/transfers/LatestTransfers";
import { LatestTransfersSkeleton } from "@/components/transfers/LatestTransfersSkeleton";
import { RoundedContainer } from "@/components/ui/RoundedContainer";
import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";



export default function TransferPage() {
    const { wallet, isLoading } = useWallet();
    const transfers = wallet?.movements.filter((movement) => movement.type === "transfer") ?? [];

    return (
        <main className="flex flex-col mx-auto min-h-dvh w-full lg:w-full lg:max-w-full lg:pl-64 bg-primary">
            <HeaderNavigation title="Transferencias" />
            <RoundedContainer className="flex-1 px-3 pt-6 pb-28 flex flex-col gap-4">
                <div className="w-full py-2 px-1 flex justify-between items-center gap-2">
                    <h2 className="text-foreground text-xl font-bold">Últimas transferencias</h2>
                    <Image src="/icons/calendar.svg" alt="" width={28} height={28} />
                </div>
                {isLoading ? <LatestTransfersSkeleton /> : <LatestTransfers movements={transfers} />}
            </RoundedContainer>
        </main>
    );
}
