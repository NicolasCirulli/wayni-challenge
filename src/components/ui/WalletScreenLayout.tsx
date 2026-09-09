'use client'
import type { ReactNode } from "react";
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";

interface WalletScreenLayoutProps {
    title?: string;
    headerContent?: ReactNode;
    children: ReactNode;
    contentClassName?: string;
}
export function WalletScreenLayout({
    title,
    headerContent,
    children,
    contentClassName = "flex-1 px-4 pt-6 pb-28 sm:px-6 lg:px-8",
}: WalletScreenLayoutProps) {
    return (
        <>
            <main className="mx-auto flex min-h-dvh w-full flex-col bg-primary lg:pl-64">
                {title ? (
                    <HeaderNavigation title={title} />
                ) : headerContent ? (
                    <header className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
                        {headerContent}
                    </header>
                ) : null}
                <RoundedContainer className={contentClassName}>
                    {children}
                </RoundedContainer>
            </main>
        </>
    );
}
