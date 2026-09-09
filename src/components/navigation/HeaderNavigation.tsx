import { BackButton } from "./BackButton";

interface HeaderNavigationProps {
    title: string;
}

export function HeaderNavigation({ title }: HeaderNavigationProps) {
    return <header className="relative flex items-center justify-center px-4 py-8 text-primary-foreground">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <BackButton />
        </div>
        <h1 className="text-center text-xl font-bold sm:text-2xl">{title}</h1>
    </header>
}
