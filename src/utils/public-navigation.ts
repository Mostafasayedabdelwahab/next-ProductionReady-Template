import { PUBLIC_ROUTES } from "@/config/constants";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export async function getPublicNavigation(locale: string) {
  const isAr = locale === "ar";

  return PUBLIC_ROUTES.filter(
    (page) => page.isVisible && page.showInNavbar,
  ).map((page) => {
    return {
      title: isAr ? page.titleAr : page.titleEn,
      href: page.slug ? `/${locale}/${page.slug}` : `/${locale}`,
      icon: page.icon || "file-text",
    };
  });
}
