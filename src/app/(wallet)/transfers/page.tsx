"use client";

import { LatestTransfers } from "@/components/transfers/LatestTransfers";
import { WalletScreenLayout } from "@/components/ui/WalletScreenLayout";
import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";

export default function TransferPage() {
    const { wallet, isLoading } = useWallet();
    const transfers = wallet?.movements.filter((movement) => movement.type === "transfer") ?? [];

    return (
        <WalletScreenLayout title="Transferencias">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 py-2">
                <h2 className="text-lg font-bold text-foreground sm:text-xl">Últimas transferencias</h2>
                <Image src="/icons/calendar.svg" alt="" width={28} height={28} />
            </div>
            {isLoading ? <LatestTransfers.Skeleton /> : <LatestTransfers movements={transfers} />}
        </WalletScreenLayout>
    );
}
