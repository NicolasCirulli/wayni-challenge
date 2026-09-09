'use client'
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";
import { useUsers } from "@/hooks/useUsers";
import Image from "next/image";

export default function ProfilePage() {
    const { user, isLoading } = useUsers()

    if (isLoading) {
        return <main className="mx-auto flex min-h-dvh w-full flex-col bg-primary lg:max-w-full lg:pl-64">
            <HeaderNavigation title="Perfil" />
        </main>
    }

    const userData = user && {
        "ID": user.id,
        "Ciudad": user.location.city,
        "Provincia": user.location.state,
        "Pais": user.location.country,
        "Email": user.email,
        "Telefono": user.phone
    }
    return (
        <main className="flex flex-col mx-auto min-h-dvh w-full lg:w-full lg:max-w-full lg:pl-64 bg-primary">
            <HeaderNavigation title="Perfil" />
            <RoundedContainer className="flex-1 px-3 pt-12 pb-28">
                {user && (
                    <section className="flex flex-col items-center gap-4">
                        <header>
                            <Image className="rounded-full" src={user.avatar} width={120} height={120} alt="Foto de perfil del usuario" />
                            <h2 className="text-2xl font-bold">{user.fullname}</h2>
                        </header>
                        <ul className="w-full">
                            {userData && Object.entries(userData).map(([label, value]) => (
                                <li key={`${label}-${value}`} className="flex items-start justify-between gap-6 border-b border-border py-3">
                                    <span className="shrink-0 text-base text-muted-foreground">{label}</span>
                                    <span className="truncate min-w-0 text-right text-base font-bold text-foreground sm:text-lg">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </RoundedContainer>
        </main>
    );
}
