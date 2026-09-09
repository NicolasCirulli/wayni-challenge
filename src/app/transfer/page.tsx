'use client'
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";
import { UserCard } from "@/components/ui/UserCard";
import { useUsers } from "@/hooks/useUsers";
import { useTransferDraftStore } from "@/store/transfer-draft-store";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
export default function Transfer() {
    const { contacts, isLoading } = useUsers()
    const setRecipient = useTransferDraftStore((state) => state.setRecipient)
    const setFrom = useTransferDraftStore((state) => state.setFrom)
    const resetDraft = useTransferDraftStore((state) => state.resetDraft)
    const router = useRouter()
    const handleSelectRecipient = (contact: User) => {
        resetDraft()
        setRecipient(contact)
        setFrom("transfer")
        router.push(`/transfer/${contact.id}/detail`)
    }
    if (isLoading) return <main className="flex min-h-dvh items-center justify-center bg-primary text-primary-foreground">
        <p role="status" className="text-base font-semibold">Cargando contactos...</p>
    </main>
    return <div className="flex min-h-dvh w-full flex-col bg-primary">
        <header className="shrink-0">
            <HeaderNavigation title="Realizar Transferencia" />
        </header>
        <main className="flex flex-1">
            <RoundedContainer className="flex-1 px-3 py-4 md:px-8 md:py-8 lg:px-12 xl:px-20">
                <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:gap-4">
                    {contacts.map((contact) => (
                        <li key={contact.id} className="group flex min-w-0 items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-muted focus-within:bg-muted sm:border sm:border-border sm:bg-background sm:p-3 sm:shadow-sm">
                            <div className="min-w-0 flex-1">
                                <UserCard imageSrc={contact.avatar} name={contact.fullname} />
                            </div>
                            <button
                                onClick={() => handleSelectRecipient(contact)}
                                type="button"
                                aria-label={`Transferir a ${contact.fullname}`}
                                className="size-10 shrink-0 rounded-full bg-foreground transition-colors group-hover:bg-primary focus-visible:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [mask-image:url('/icons/navigation/arrow_left_alt.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:1.75rem] rotate-180">
                            </button>
                        </li>
                    ))}
                </ul>
            </RoundedContainer>
        </main>
    </div>
}
