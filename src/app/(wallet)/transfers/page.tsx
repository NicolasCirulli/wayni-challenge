"use client";

import { LatestTransfers } from "@/components/transfers/LatestTransfers";
import { WalletScreenLayout } from "@/components/ui/WalletScreenLayout";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";

export default function TransferPage() {
    const { wallet, isLoading } = useWallet();
    const transfers = wallet?.movements.filter((movement) => movement.type === "transfer") ?? [];

    return (
        <WalletScreenLayout title="Transferencias">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 py-2">
                <h2 className="text-lg font-bold text-foreground sm:text-xl">Transferencias</h2>
                <Link
                    href="/transfer"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                >
                    Nueva {"->"}
                </Link>
            </div>
            {isLoading ? <LatestTransfers.Skeleton /> : <LatestTransfers movements={transfers} />}
        </WalletScreenLayout>
    );
}
