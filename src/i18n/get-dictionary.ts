import "server-only";

const dictionaries = {
  en: () => import("@/i18n/messages/en.json").then((m) => m.default),
  ar: () => import("@/i18n/messages/ar.json").then((m) => m.default),
};

export const getDictionary = async (locale: "en" | "ar") => {
  const fetcher = dictionaries[locale as keyof typeof dictionaries];

  if (!fetcher) {
    return dictionaries.ar(); // Default fallback
  }

  return fetcher();
};
