"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function Loading() {

    const params = useParams();
    const isAr = params?.locale === "ar";

    const content = {
        title: isAr ? "جاري التحميل" : "Loading",
        subtitle: isAr ? "يرجى الانتظار لحظة" : "Please wait a moment",
        status: isAr ? "تم إنشاء اتصال آمن" : "Secure Connection Established"
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background Glow */}
            <div className="absolute h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

            <div className="relative flex flex-col items-center">
                <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
                    <motion.span
                        className="absolute h-full w-full rounded-full border-4 border-primary/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.span
                        className="absolute h-full w-full rounded-full border-t-4 border-primary"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "circInOut" }}
                    />
                    <motion.div
                        className="h-4 w-4 rounded-full bg-primary shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-xl font-bold tracking-widest text-foreground uppercase ${isAr ? 'font-cairo' : ''}`}
                    >
                        {content.title}
                    </motion.h3>

                    <div className="relative h-1 w-32 overflow-hidden rounded-full bg-muted">
                        <motion.div
                            className="absolute h-full bg-primary"
                            initial={{ x: isAr ? "100%" : "-100%" }}
                            animate={{ x: isAr ? "-100%" : "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    <p className="mt-2 text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">
                        {content.subtitle}
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="absolute bottom-10 text-[10px] font-semibold uppercase tracking-[0.3em]"
            >
                {content.status}
            </motion.div>
        </div>
    );
}