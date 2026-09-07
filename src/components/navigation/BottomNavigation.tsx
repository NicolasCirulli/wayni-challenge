"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    {
        label: "Home",
        href: "/",
        icon: "/icons/navigation/home.svg",
    },
    {
        label: "Transfers",
        href: "/transfers",
        icon: "/icons/navigation/transfers.svg",
    },
    {
        label: "Profile",
        href: "/profile",
        icon: "/icons/navigation/profile.svg",
    },
] as const;

export function BottomNavigation() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Navegación principal"
            className="fixed bottom-0 left-1/2 z-50
                        w-full -translate-x-1/2
                        border-t-2 border-border
                        bg-background px-5 py-4
                        shadow-navigation"
        >
            <div className="flex w-full items-center justify-between">
                {navigationItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-2 text-sm leading-[17px] transition-colors ${isActive ? "text-accent" : "text-muted-foreground"
                                }`}
                        >
                            <span
                                aria-hidden="true"
                                className="size-8 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
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
