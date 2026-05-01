"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageAnimatePresence({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col min-h-screen bg-muted/30"
        >
            {children}
        </motion.div>
    );
}