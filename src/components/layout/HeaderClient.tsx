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
};

export default function HeaderClient({ navigation }: Props) {
    const pathname = usePathname();
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);

    return (
        <nav
            className="hidden md:flex items-center gap-2 text-sm font-medium relative"
            onMouseLeave={() => setHoveredPath(null)}
        >
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredPath === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onMouseEnter={() => setHoveredPath(item.href)}
                        className={cn(
                            "relative px-4 py-2 transition-colors duration-300 rounded-md",
                            isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {isHovered && (
                            <motion.span
                                layoutId="hover-bg"
                                className="absolute inset-0 bg-muted rounded-lg -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}

                        <span className="relative z-10">{item.title}</span>

                        {(isActive || isHovered) && (
                            <motion.div
                                layoutId="active-nav-line"
                                className={cn(
                                    "absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-4",
                                    !isActive && "bg-primary/40"
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                }}
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}