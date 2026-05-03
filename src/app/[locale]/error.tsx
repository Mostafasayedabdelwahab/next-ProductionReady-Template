"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { useParams } from "next/navigation";

export default function Error({ reset, }: { error: Error & { digest?: string }; reset: () => void; }) {

    const params = useParams();
    const isAr = params?.locale === "ar";


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

            <div
                className="shake relative flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 border border-destructive/20 mb-8 shadow-2xl shadow-destructive/10"
            >
                <AlertCircle className="h-12 w-12 text-destructive" />
                <span className={`absolute -top-1 ${isAr ? '-left-1' : '-right-1'} flex h-4 w-4`}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                </span>
            </div>

            <div className="fade-in">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                    {content.title}
                </h1>

                <p className="mt-4 mb-2 max-w-125 text-lg text-muted-foreground leading-relaxed">
                    {content.description}
                </p>


            </div>

            <div className="fade-in flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none justify-center" >
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
            </div>
        </div>
    );
}