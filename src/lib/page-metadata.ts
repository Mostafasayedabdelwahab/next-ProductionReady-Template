import type { Metadata } from "next";

export function createPageMetadata(
  baseUrl: string,
  locale: string,
  path: string = "",
): Metadata {
  const Url = (baseUrl || "https://example.com").replace(/\/+$/, "");
  const canonical = `${Url}/${locale}${path}`;

  return {
    alternates: {
      canonical,
      languages: {
        "ar-SA": `${Url}/ar${path}`,
        "en-US": `${Url}/en${path}`,
        "x-default": `${Url}/ar${path}`,
      },
    },
  };
}
