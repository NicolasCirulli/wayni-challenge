import { UserCard } from "@/components/ui/UserCard";
import type { User } from "@/types/user";

interface UserHeaderProps {
  user?: User;
}

export function UserHeader({ user }: UserHeaderProps) {
  if (!user) return null;

  return (
    <UserCard
      imageSrc={user.avatar}
      name={user.fullname}
      variant="header"
    />
  );
}

export function UserHeaderSkeleton() {
  return (
    <div
      className="flex items-center gap-3.5 lg:flex-col lg:gap-4"
      role="status"
      aria-label="Cargando usuario"
    >
      <div className="size-9 shrink-0 animate-pulse rounded-full bg-primary-foreground/50 lg:size-16" />
      <div className="h-5 w-28 animate-pulse rounded bg-primary-foreground/50 lg:h-6 lg:w-36" />
    </div>
  );
}

export function UserHeaderError() {
  return (
    <div
      className="flex items-center gap-3.5 lg:flex-col lg:gap-4 text-white"
      role="status"
      aria-label="Error al cargar el usuario"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white lg:size-16 lg:text-base">
        ?
      </div>
      <span className="text-base font-bold text-white lg:text-xl">
        Usuario
      </span>
    </div>
  );
}

UserHeader.Skeleton = UserHeaderSkeleton;
UserHeader.Error = UserHeaderError;
