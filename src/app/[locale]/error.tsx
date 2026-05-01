"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
    }) {
    
    const params = useParams();
    const isAr = params?.locale === "ar";

    useEffect(() => {
        console.error("Critical Application Error:", error);
    }, [error]);

   const content = {
        title: isAr ? "عذراً، حدث خطأ غير متوقع" : "Oops! Something went wrong",
        description: isAr 
            ? "يبدو أننا واجهنا مشكلة في تحميل هذه الصفحة. يرجى المحاولة مرة أخرى أو العودة للرئيسية." 
            : "It seems we encountered a problem loading this page. Please try again or return to the homepage.",
        tryAgain: isAr ? "تحديث الصفحة" : "Refresh Page",
        backHome: isAr ? "العودة للرئيسية" : "Back to Home"
    };

    return (
        <div
            role="alert"
            className={`relative flex h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-background p-6 text-center ${isAr ? 'font-cairo' : ''}`}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-destructive/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ x: 0 }}
                animate={{ x: isAr ? [3, -3, 3, -3, 0] : [-3, 3, -3, 3, 0] }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 border border-destructive/20 mb-8 shadow-2xl shadow-destructive/10"
            >
                <AlertCircle className="h-12 w-12 text-destructive" />
                <span className={`absolute -top-1 ${isAr ? '-left-1' : '-right-1'} flex h-4 w-4`}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                </span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                    {content.title}
                </h1>

                <p className="mt-4 mb-2 max-w-125 text-lg text-muted-foreground leading-relaxed">
                    {content.description}
                </p>

               
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none justify-center"
            >
                <Button
                    onClick={() => reset()}
                    size="lg"
                    className="rounded-full px-8 gap-2 bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                >
                    <RefreshCcw className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                    {content.tryAgain}
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 gap-2 border-border hover:bg-muted"
                    onClick={() => window.location.assign(isAr ? "/ar" : "/en")}
                >
                    <Home className="h-4 w-4" />
                    {content.backHome}
                </Button>
            </motion.div>
        </div>
    );
}