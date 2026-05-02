"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
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
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);

    const normalize = (path: string) => path.replace(/\/$/, "");

    return (
        <nav
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoveredPath(null)}
        >
            {navigation.map((item) => {
                const isActive =
                    normalize(pathname) === normalize(item.href);

                const isHome = normalize(item.href) === `/${locale}`;

                const baseClass = cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-full text-nowrap",
                    isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                );

                const content = (
                    <>
                        {hoveredPath === item.href && (
                            <motion.span
                                layoutId="nav-hover"
                                className="absolute inset-0 bg-muted rounded-full -z-10"
                                transition={{
                                    type: "spring",
                                    bounce: 0.25,
                                    duration: 0.5,
                                }}
                            />
                        )}

                        {item.title}

                        {isActive && (
                            <motion.span
                                layoutId="nav-underline"
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                            />
                        )}
                    </>
                );

                return isHome ? (
                    <Link
                        key={item.title}
                        href={item.href}
                        onMouseEnter={() => setHoveredPath(item.href)}
                        className={baseClass}
                    >
                        {content}
                    </Link>
                ) : (
                    <button
                        key={item.title}
                        type="button"
                        onMouseEnter={() => setHoveredPath(item.href)}
                        className={cn(baseClass, "cursor-default")}
                    >
                        {content}
                    </button>
                );
            })}
        </nav>
    );
}