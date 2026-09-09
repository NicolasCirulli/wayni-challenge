import type { ReactNode } from "react";
import { HeaderNavigation } from "@/components/navigation/HeaderNavigation";
import { RoundedContainer } from "@/components/ui/RoundedContainer";

interface TransferScreenLayoutProps {
  title: string;
  children: ReactNode;
  contentClassName?: string;
}

export function TransferScreenLayout({
  title,
  children,
  contentClassName = "flex-1 px-4 py-6 sm:px-6 lg:px-8",
}: TransferScreenLayoutProps) {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-primary">
      <HeaderNavigation title={title} />
      <RoundedContainer className={contentClassName}>
        {children}
      </RoundedContainer>
    </main>
  );
}

interface TransferSplitScreenLayoutProps extends TransferScreenLayoutProps {
  headerContent?: ReactNode;
}

export function TransferSplitScreenLayout({
  title,
  headerContent,
  children,
  contentClassName = "flex flex-1 flex-col px-6 py-6 sm:px-10 lg:min-h-dvh lg:justify-center lg:px-16 lg:py-12",
}: TransferSplitScreenLayoutProps) {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-primary lg:grid lg:grid-cols-2">
      <header className="shrink-0 pb-4 lg:flex lg:min-h-dvh lg:flex-col lg:pb-0">
        <HeaderNavigation title={title} />
        {headerContent ? (
          <div className="lg:flex lg:flex-1 lg:items-center lg:justify-center lg:pb-24">
            {headerContent}
          </div>
        ) : null}
      </header>
      <RoundedContainer className={contentClassName}>
        {children}
      </RoundedContainer>
    </main>
  );
}

TransferScreenLayout.Split = TransferSplitScreenLayout;
