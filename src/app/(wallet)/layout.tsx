import { BottomNavigation } from "@/components/navigation/BottomNavigation";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
    return <>
        {children}
        <BottomNavigation />
    </>;
}  