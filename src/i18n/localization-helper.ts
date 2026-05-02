
export function getLocalizedValue(
  ar?: string | null,
  en?: string | null,
  locale?: string,
) {
  if (locale === "ar") return ar ?? en ?? "";
  return en ?? ar ?? "";
}
