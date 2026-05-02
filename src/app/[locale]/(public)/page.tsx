import type { Metadata } from "next";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { createPageMetadata } from "@/lib/page-metadata";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Component, LayoutDashboard, Lock, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/utils/utils";
import { Languages } from "@/config/enums";
import { getDictionary } from "@/i18n/get-dictionary";


export async function generateMetadata({ params, }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
  const { locale } = await params;
  const [settings] = await Promise.all([
    getCachedSiteSettings(),
  ]);
  const baseUrl = settings.domainUrl || "https://example.com";
  const metadata = createPageMetadata(baseUrl, locale, "/");

  return {
    ...metadata,
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Languages);
  const d_home = dict.homePage;
  const isAr = locale === "ar";

  const features = [
    {
      title: d_home.features.items[0].title,
      description: d_home.features.items[0].description,
      icon: Lock,
    },
    {
      title: d_home.features.items[1].title,
      description: d_home.features.items[1].description,
      icon: LayoutDashboard,
    },
    {
      title: d_home.features.items[2].title,
      description: d_home.features.items[2].description,
      icon: Zap,
    },
    {
      title: d_home.features.items[3].title,
      description: d_home.features.items[3].description,
      icon: Component,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-muted/50">
            <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
            <span>{d_home.hero.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {d_home.hero.title}{" "}
            <span className="text-primary block mt-2">{d_home.hero.highlight}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {d_home.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/register">
                {d_home.hero.buttons.register}
                <ArrowRight className={cn("ml-2 w-4 h-4", isAr && "rotate-180")} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link href="/login">{d_home.hero.buttons.login}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{d_home.features.sectionTitle}</h2>
            <p className="text-muted-foreground">{d_home.features.sectionDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background p-8 rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-card rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {d_home.cta.title}
              </h2>
              <p className=" mb-10 max-w-xl mx-auto">
                {d_home.cta.description}
              </p>
              <Button asChild variant="secondary" size="lg" className="font-bold text-white">
                <Link href="/register">{d_home.cta.button}</Link>
              </Button>
            </div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
}