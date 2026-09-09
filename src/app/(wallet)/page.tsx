"use client";

import { LatestTransactions } from "@/components/home/LatestTransactions";
import { SendAgain } from "@/components/home/SendAgain";
import { UserHeader } from "@/components/home/UserHeader";
import { UserBalance } from "@/components/ui/UserBalance";
import { WalletScreenLayout } from "@/components/ui/WalletScreenLayout";
import { useUsers } from "@/hooks/useUsers";
import { useWallet } from "@/hooks/useWallet";
import type { User } from "@/types/user";
import type { Wallet } from "@/types/wallet";
import { formatCurrency } from "@/utils/format-currency";

export default function Home() {
  const { user, contacts, isLoading: isLoadingUser, isError, refetch } = useUsers();
  const { wallet, isLoading: isLoadingWallet } = useWallet();
  const isLoading = isLoadingUser || isLoadingWallet;

  return (
    <WalletScreenLayout
      headerContent={
        <HomeHeader
          isLoading={isLoading}
          isError={isError}
          user={user}
          wallet={wallet}
        />
      }
    >
      <HomeSendAgain
        isLoading={isLoading}
        isError={isError}
        contacts={contacts}
        refetch={refetch}
      />
      <HomeTransactions
        isLoading={isLoading}
        wallet={wallet}
      />
    </WalletScreenLayout>
  );
}

function HomeHeader({
  isLoading,
  isError,
  user,
  wallet,
}: {
  isLoading: boolean;
  isError: boolean;
  user?: User;
  wallet: Wallet | null;
}) {
  return (
    <>
      {isLoading ? (
        <UserHeader.Skeleton />
      ) : isError ? (
        <UserHeader.Error />
      ) : (
        <UserHeader user={user} />
      )}
      <div className="mt-8">
        {isLoading ? (
          <UserBalance.Skeleton />
        ) : wallet ? (
          <UserBalance amount={formatCurrency(wallet.balanceCents)} />
        ) : null}
      </div>
    </>
  );
}

function HomeSendAgain({
  isLoading,
  isError,
  contacts,
  refetch,
}: {
  isLoading: boolean;
  isError: boolean;
  contacts: User[];
  refetch: () => void;
}) {
  if (isLoading) return <SendAgain.Skeleton />;
  if (isError) return <SendAgain.Error refetch={refetch} />;
  return <SendAgain contacts={contacts} />;
}

function HomeTransactions({
  isLoading,
  wallet,
}: {
  isLoading: boolean;
  wallet: Wallet | null;
}) {
  if (isLoading) return <LatestTransactions.Skeleton />;
  return <LatestTransactions movements={wallet?.movements ?? []} />;
}
