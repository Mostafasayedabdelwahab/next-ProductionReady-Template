// app/(public)/layout.tsx
import type { Metadata } from "next";

import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { getSiteSettingsService, type SiteSettingsEntity } from "@/features/site-settings";

import { getLocalizedValue } from "@/i18n/localization-helper";
import Script from "next/script";
import { getPublicNavigation } from "@/components/layout/public-navigation";
import { getMediaUrl } from "@/utils/media";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/container";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const settings = await getSiteSettingsService();
  const { locale } = await params;

  const localized = {
    siteName: getLocalizedValue(settings.siteNameAr, settings.siteNameEn, locale),
    siteDescription: getLocalizedValue(
      settings.siteDescriptionAr,
      settings.siteDescriptionEn,
      locale
    ),
    siteTitle: getLocalizedValue(settings.siteTitleAr, settings.siteTitleEn, locale),
    defaultKeywords: getLocalizedValue(settings.defaultKeywordsAr, settings.defaultKeywordsEn, locale),
  };
  const siteName = localized.siteName;
  const siteDescription = localized.siteDescription;
  const siteTitle = localized.siteTitle;
  const defaultKeywords = localized.defaultKeywords;

  const brandName = siteName || "Nexus Solutions";
  const tagline = siteTitle || "Modern Business Solutions";

  const description =
    siteDescription ||
    `${tagline}. Professional digital solutions tailored to grow your business.`;

  const baseUrl = settings.domainUrl || "https://example.com";

  const ogImage = getMediaUrl(settings.ogImageUrl);

  const safeOgImage =
    ogImage && ogImage.trim() !== ""
      ? ogImage
      : `${baseUrl}/og.png`;

  return {
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(baseUrl),

    title: {
      default: brandName,
      template: `%s | ${brandName}`,
    },

    description,

    keywords: defaultKeywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean),

    icons: {
      icon: getMediaUrl(settings.faviconUrl) ?? "/glope.svg",
    },

    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}`,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      title: brandName,
      description,
      siteName: brandName,
      images: [
        {
          url: safeOgImage,
          width: 1200,
          height: 630,
          alt: brandName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: brandName,
      description,
      images: [safeOgImage],
    },
  };
}


export default async function PublicLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }>; }) {
  const { locale } = await params;

  const [navigation, settings] = await Promise.all([
    getPublicNavigation(locale),
    getCachedSiteSettings()
  ]);

  const localized = {
    siteName: getLocalizedValue(settings.siteNameAr, settings.siteNameEn, locale),
  }

  const baseUrl = settings.domainUrl || "https://example.com"
  return (

    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: localized.siteName,
                url: `${baseUrl}/${locale}`,
                logo: getMediaUrl(settings.logoUrl) || `${baseUrl}/glope.svg`,
              },
              {
                "@type": "WebSite",
                name: localized.siteName,
                url: baseUrl,
                inLanguage: locale === "ar" ? "ar" : "en",
              },
            ],
          }),
        }}
      />

      <Header locale={locale} />



      <main id="main-content" className="flex-1 animate-page-fade">
        <Container>
          {children}
        </Container>
      </main>

      <Footer settings={settings as SiteSettingsEntity} navigation={navigation} />
    </>
  );
}