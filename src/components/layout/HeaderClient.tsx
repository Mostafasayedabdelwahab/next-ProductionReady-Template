"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";

type Props = {
    navigation: {
        href: string;
        title: string;
    }[];
    locale: string;
};

export default function HeaderClient({ navigation, locale }: Props) {
    const pathname = usePathname();

    const normalize = (path: string) => path.replace(/\/$/, "");

    return (
        <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
                const isActive =
                    normalize(pathname) === normalize(item.href);

                const isHome = normalize(item.href) === `/${locale}`;

                return isHome ? (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                            "hover:bg-muted hover:text-foreground",
                            isActive
                                ? "text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.title}
                    </Link>
                ) : (
                    <button
                        key={item.title}
                        type="button"
                        className="px-4 py-2 text-sm font-medium rounded-full text-muted-foreground cursor-default"
                    >
                        {item.title}
                    </button>
                );
            })}
        </nav>
    );
}