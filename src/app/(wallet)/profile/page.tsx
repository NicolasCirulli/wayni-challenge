"use client";

import { Profile } from "@/components/profile/Profile";
import { WalletScreenLayout } from "@/components/ui/WalletScreenLayout";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/user";

export default function ProfilePage() {
  const { user, isLoading, isError, refetch } = useUsers();

  return (
    <WalletScreenLayout title="Perfil">
      <ProfileContent
        isLoading={isLoading}
        isError={isError}
        user={user}
        refetch={refetch}
      />
    </WalletScreenLayout>
  );
}

function ProfileContent({
  isLoading,
  isError,
  user,
  refetch,
}: {
  isLoading: boolean;
  isError: boolean;
  user?: User;
  refetch: () => void;
}) {
  if (isLoading) return <Profile.Skeleton />;
  if (isError || !user) return <Profile.Error refetch={refetch} />;
  return <Profile user={user} />;
}
