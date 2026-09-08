"use client";

import { LatestTransactions } from "@/components/home/LatestTransactions";
import { SendAgain } from "@/components/home/SendAgain";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";
import { UserBalance } from "@/components/ui/UserBalance";
import { UserCard } from "@/components/ui/UserCard";
import { useUsers } from "@/hooks/useUsers";

export default function Home() {
  const { user, contacts } = useUsers();

  return (
    <>
      <main className="flex flex-col mx-auto min-h-dvh w-full lg:w-full lg:max-w-full lg:pl-64 bg-primary">
        <header className="p-8">
          {user && (
            <UserCard
              imageSrc={user.avatar}
              name={user.fullname}
              variant="header"
            />
          )}
          <div className="mt-8">
            <UserBalance amount="$ 2.800" />
          </div>
        </header>
        <RoundedContainer className="flex-1 px-3 pt-6 pb-28">
          <SendAgain contacts={contacts} />
          <LatestTransactions />
        </RoundedContainer>
      </main>
      <BottomNavigation />
    </>
  );
}
