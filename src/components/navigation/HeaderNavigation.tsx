import { BackButton } from "./BackButton";

interface HeaderNavigationProps {
    title: string;
}

export function HeaderNavigation({ title }: HeaderNavigationProps) {
    return <header className="grid grid-cols-[1fr_auto_1fr] justify-center items-center px-2 py-8 text-primary-foreground">
        <div className="justify-self-start flex items-center">
            <BackButton />
        </div>
        <h1 className="text-2xl">{title}</h1>
        <div />
    </header>
}