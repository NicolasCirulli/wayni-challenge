
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";


export default function ProfilePage() {
    return (
        <main className="flex flex-col mx-auto min-h-dvh w-full lg:w-full lg:max-w-full lg:pl-64 bg-primary">
            <HeaderNavigation title="Mi Perfil" />
            <RoundedContainer className="flex-1 px-3 pt-6 pb-28">
                <h2 className="text-2xl">Perfil</h2>
            </RoundedContainer>
        </main>
    );
}
