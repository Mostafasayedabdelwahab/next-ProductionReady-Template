import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export const metadata = {
    title: "404 - Page Not Found",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {

    return (
        
        <html lang="ar" dir="rtl">
            <body className="antialiased font-sans">
                <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 text-center">

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary rounded-full blur-[120px]" />
                    </div>

                    <div
                        className="relative rounded-2xl bg-muted/50 p-8 mb-8 backdrop-blur-sm border border-border/50"
                    >
                        <FileQuestion className="h-20 w-20 text-primary" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive animate-pulse" />
                    </div>

                    <div
                    >
                        <h1 className="text-8xl font-black tracking-tighter sm:text-9xl bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                            404
                        </h1>

                        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                            الصفحة غير موجودة ؟
                        </h2>

                        <p className="mt-4 mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed">
                            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
                            تأكد من الرابط أو عد للصفحة الرئيسية.
                        </p>
                    </div>

                    <div
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8 text-lg font-medium shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            <Link href="/ar" className="flex items-center gap-2">
                                <Home className="h-5 w-5" />
                                الرئيسية
                            </Link>
                        </Button>

                    </div>
                </div>
            </body>
        </html>
    );
}