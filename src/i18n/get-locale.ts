import { headers } from "next/headers";

export async function getLocale(): Promise<string> {
  return (await headers()).get("x-next-intl-locale") || "en";
}
