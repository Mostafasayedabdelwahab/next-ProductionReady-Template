"use client";
import "./globals.css";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="antialiased font-sans flex min-h-screen flex-col overflow-hidden">
                <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6 text-center">

                    <div className="absolute inset-0 -z-10 flex items-center justify-center">
                        <div className="w-112.5 h-112.5 bg-destructive/10 rounded-full blur-[120px]" />
                    </div>

                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: [-3, 3, -3, 3, 0] }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 border border-destructive/20 mb-8 shadow-2xl shadow-destructive/10"
                    >
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-md"
                    >
                        <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
                            System Halt
                        </h1>

                        <p className="mb-8 text-lg text-muted-foreground">
                            A critical error occurred that prevented the application from starting.
                        </p>

                        {error.digest && (
                            <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider">
                                Trace ID:
                                <span className="text-foreground">{error.digest}</span>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >

                        <button
                            onClick={() => reset()}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Attempt Recovery
                        </button>

                        <button
                            onClick={() => window.location.assign("/")}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold"
                        >
                            <Home className="h-4 w-4" />
                            Go to Homepage
                        </button>

                    </motion.div>

                    <div className="absolute bottom-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-50">
                        <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        Critical Failure Layer
                    </div>

                </div>
            </body>
        </html>
    );
}