import { getLocale } from "@/i18n/get-locale";

export default async function Loading() {

    const locale = await getLocale();
    const isAr = locale === "ar";

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
                    <span className="spinner-ring" />
                    <span className="spinner-top" />
                    <span className="spinner-dot" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h3
                        className={`fade-in text-xl font-bold tracking-widest text-foreground uppercase ${isAr ? 'font-cairo' : ''}`}
                    >
                        {content.title}
                    </h3>

                    <div className="relative h-1 w-32 overflow-hidden rounded-full bg-muted">
                        <div className="loading-bar" />
                    </div>

                    <p className="mt-2 text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">
                        {content.subtitle}
                    </p>
                </div>
            </div>

            <div className="fade-in absolute bottom-10 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-40">
                {content.status}
            </div>
        </div>
    );
}