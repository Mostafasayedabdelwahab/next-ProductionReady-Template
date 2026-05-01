import type { Metadata } from "next";

export function createPageMetadata(
  baseUrl: string,
  locale: string,
  path: string = "",
): Metadata {
  const canonical = `${baseUrl}/${locale}${path}`;

  return {
    alternates: {
      canonical,
      languages: {
        "ar-SA": `${baseUrl}/ar${path}`,
        "en-US": `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}/ar${path}`,
      },
    },
    openGraph: {
      url: canonical,
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}
