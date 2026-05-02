// src/lib/constants/radius.ts
import { RadiusOption } from "@/generated/prisma/enums"; // Importing RadiusOptions enum from generated Prisma enums

export const RADIUS_SELECT_OPTIONS = [
  { label: "Sharp", value: RadiusOption.sharp },
  { label: "Medium", value: RadiusOption.medium },
  { label: "Rounded", value: RadiusOption.rounded },
  { label: "Pill", value: RadiusOption.pill },
] as const;

export const DEFAULT_THEME = {
  primaryColor: "#000dbd", // blue
  secondaryColor: "#0f172a", // slate-900
  accentColor: "#f59e0b", // amber-500
  mutedColor: "#f1f5f9", // slate-100
  backgroundColor: "#ffffff", // white
  foregroundColor: "#020617", // slate-950
  cardColor: "#ffffff", // white
  borderColor: "#e2e8f0", // slate-200
} as const;

export const PUBLIC_ROUTES = [
  {
    slug: "",
    titleAr: "الرئيسية",
    titleEn: "Home",
    isVisible: true,
    showInNavbar: true,
    icon: "home",
  },
  {
    slug: "about",
    titleAr: "من نحن",
    titleEn: "About",
    isVisible: true,
    showInNavbar: true,
    icon: "info",
  },
  {
    slug: "services",
    titleAr: "الخدمات",
    titleEn: "Services",
    isVisible: true,
    showInNavbar: true,
    icon: "briefcase",
  },
  {
    slug: "faq",
    titleAr: "الأسئلة الشائعة",
    titleEn: "FAQ",
    isVisible: true,
    showInNavbar: false,
    icon: "help-circle",
  },
  {
    slug: "contact",
    titleAr: "اتصل بنا",
    titleEn: "Contact",
    isVisible: true,
    showInNavbar: true,
    icon: "phone",
  },
  {
    slug: "privacy-policy",
    titleAr: "سياسة الخصوصية",
    titleEn: "Privacy Policy",
    isVisible: true,
    showInNavbar: false,
    icon: "shield",
  },
  {
    slug: "terms",
    titleAr: "الشروط والأحكام",
    titleEn: "Terms & Conditions",
    isVisible: true,
    showInNavbar: false,
    icon: "file",
  },
];