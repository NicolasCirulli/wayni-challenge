"use client";

import { LatestTransactions } from "@/components/home/LatestTransactions";
import { LatestTransactionsSkeleton } from "@/components/home/LatestTransactionsSkeleton";
import { SendAgain } from "@/components/home/SendAgain";
import { SendAgainError } from "@/components/home/SendAgainError";
import { SendAgainSkeleton } from "@/components/home/SendAgainSkeleton";
import { UserHeaderError } from "@/components/home/UserHeaderError";
import { UserHeaderSkeleton } from "@/components/home/UserHeaderSkeleton";
import { RoundedContainer } from "@/components/ui/RoundedContainer";
import { UserBalance } from "@/components/ui/UserBalance";
import { UserBalanceSkeleton } from "@/components/ui/UserBalanceSkeleton";
import { UserCard } from "@/components/ui/UserCard";
import { useUsers } from "@/hooks/useUsers";
import { useWallet } from "@/hooks/useWallet";
import { formatCurrency } from "@/utils/format-currency";

export default function Home() {
  const { user, contacts, isLoading: isLoadingUser, isError, refetch } = useUsers();
  const { wallet, isLoading: isLoadingWallet } = useWallet();
  const isLoading = isLoadingUser || isLoadingWallet;

  return (
    <>
      <main className="flex flex-col mx-auto min-h-dvh w-full lg:w-full lg:max-w-full lg:pl-64 bg-primary">
        <header className="p-8">
          {isLoading ? (
            <UserHeaderSkeleton />
          ) : isError ?
            <UserHeaderError />
            :
            user ? (
              <UserCard
                imageSrc={user.avatar}
                name={user.fullname}
                variant="header"
              />
            ) : null}
          <div className="mt-8">
            {isLoading ? (
              <UserBalanceSkeleton />
            ) : wallet ? (
              <UserBalance amount={formatCurrency(wallet.balanceCents)} />
            ) : null}
          </div>
        </header>
        <RoundedContainer className="flex-1 px-3 pt-6 pb-28">
          {isLoading ? (
            <SendAgainSkeleton />
          ) : isError ? <SendAgainError refetch={refetch} /> : (
            <SendAgain contacts={contacts} />
          )}
          {isLoading ? (
            <LatestTransactionsSkeleton />
          ) : (
            <LatestTransactions movements={wallet?.movements ?? []} />
          )}
        </RoundedContainer>
      </main>

    </>
  );
}
