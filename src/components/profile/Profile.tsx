import Image from "next/image";
import type { User } from "@/types/user";

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  const userData = [
    ["ID", user.id],
    ["Ciudad", user.location.city],
    ["Provincia", user.location.state],
    ["País", user.location.country],
    ["Email", user.email],
    ["Teléfono", user.phone],
  ];

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Image
          className="size-30 rounded-full object-cover"
          src={user.avatar}
          width={120}
          height={120}
          alt="Foto de perfil del usuario"
        />
        <h2 className="text-2xl font-bold text-foreground">{user.fullname}</h2>
      </header>

      <ul className="w-full divide-y divide-border">
        {userData.map(([label, value]) => (
          <li
            key={label}
            className="flex items-start justify-between gap-6 py-3.5"
          >
            <span className="shrink-0 text-sm text-muted-foreground sm:text-base">
              {label}
            </span>
            <span className="min-w-0 truncate text-right text-base font-semibold text-foreground sm:text-lg">
              {value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const PROFILE_SKELETON_ROWS = Array.from({ length: 6 });

export function ProfileSkeleton() {
  return (
    <section
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6"
      role="status"
      aria-label="Cargando perfil de usuario"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="size-30 shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="h-7 w-44 animate-pulse rounded-md bg-gray-200" />
      </div>

      <ul className="w-full divide-y divide-border">
        {PROFILE_SKELETON_ROWS.map((_, index) => (
          <li
            key={`profile-skeleton-row-${index}`}
            className="flex items-center justify-between gap-6 py-3.5"
          >
            <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-gray-200 sm:w-44" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProfileError({ refetch }: { refetch: () => void }) {
  return (
    <section
      className="mx-auto flex min-h-80 w-full max-w-2xl flex-col items-center justify-center gap-3 text-center"
      role="alert"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-xl font-bold text-muted-foreground">
        !
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          No pudimos cargar tu perfil
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisá tu conexión e intentá nuevamente.
        </p>
      </div>
      <button
        type="button"
        onClick={refetch}
        className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
      >
        Reintentar
      </button>
    </section>
  );
}

Profile.Skeleton = ProfileSkeleton;
Profile.Error = ProfileError;
