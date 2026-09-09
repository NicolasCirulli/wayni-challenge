"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    {
        label: "Inicio",
        href: "/",
        icon: "/icons/navigation/home.svg",
    },
    {
        label: "Transferencias",
        href: "/transfers",
        icon: "/icons/navigation/transfers.svg",
    },
    {
        label: "Perfil",
        href: "/profile",
        icon: "/icons/navigation/profile.svg",
    },
] as const;

export function BottomNavigation() {
    const pathname = usePathname();
    return (
        <nav
            aria-label="Navegación principal"
            className={`fixed bottom-0 left-0 z-50 w-full border-t-2 border-border bg-background px-5 py-4 shadow-navigation lg:inset-y-0 lg:left-0 lg:right-auto lg:top-0 lg:bottom-0 lg:h-screen lg:w-64 lg:border-t-0 lg:border-r-2 lg:px-4 lg:py-8 lg:shadow-none`}
        >
            <div className={`flex w-full items-center justify-between lg:flex-col lg:items-stretch lg:justify-start lg:gap-2`}>
                {navigationItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-2 text-sm leading-5 transition-all lg:flex-none lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-4 lg:py-3 lg:text-base ${isActive
                                    ? "text-accent font-semibold lg:bg-muted"
                                    : "text-muted-foreground hover:text-foreground lg:hover:bg-muted/50"
                                }`}
                        >
                            <span
                                aria-hidden="true"
                                className="size-8 shrink-0 lg:size-6 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
                                style={{
                                    maskImage: `url(${item.icon})`,
                                    WebkitMaskImage: `url(${item.icon})`,
                                }}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
