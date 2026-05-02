import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Languages } from "./config/enums";

// Supported locales
const locales = Object.values(Languages) as string[];
const defaultLocale = "en";

// Remove locale from path (e.g. /en/dashboard -> /dashboard)
function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (locales.includes(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}

// Build URL helper (keeps query)
function buildUrl(req: NextRequest, path: string) {
  return new URL(path, req.url);
}

// Role priority (higher = more permissions)
const ROLE_PRIORITY = {
  ADMIN: 3,
  EDITOR: 2,
  USER: 1,
};

// Routes with required minimum role
const ROUTE_PERMISSIONS = [
  { path: "/dashboard/admin", minRole: "ADMIN" },
  { path: "/dashboard", minRole: "EDITOR" },
  { path: "/profile", minRole: "USER" },
];

export async function proxy(req: NextRequest) {
  // Get user token from cookies
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = req.nextUrl;

  // Preferred locale from cookie
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const preferredLocale = locales.includes(cookieLocale as string)
    ? cookieLocale
    : defaultLocale;

  // Clean path (without locale)
  const cleanPath = stripLocale(pathname);

  // Detect locale from URL or fallback
  const locale = locales.includes(pathname.split("/")[1])
    ? pathname.split("/")[1]
    : preferredLocale;

  // Redirect "/" → "/{locale}"
  if (pathname === "/") {
    return NextResponse.redirect(buildUrl(req, `/${preferredLocale}`));
  }

  // Check if URL has locale
  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );

  // Ignore static & API
  const isIgnored =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    /\.(.*)$/.test(pathname);

  // Add locale if missing
  if (!hasLocale && !isIgnored) {
    return NextResponse.redirect(
      buildUrl(req, `/${preferredLocale}${pathname}${search}`),
    );
  }

  // Public routes (no auth required)
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
  ];

  const isPublic = publicRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );
  if (token && token.isActive === false) {
    return NextResponse.redirect(buildUrl(req, `/${locale}/login`));
  }

  // Force email verification
  if (token && !token.emailVerified) {
    const allowed =
      cleanPath.startsWith("/verify-email") || pathname.startsWith("/api/auth");

    if (!allowed) {
      return NextResponse.redirect(buildUrl(req, `/${locale}/verify-email`));
    }
  }

  // Prevent logged-in users from accessing auth pages
  if (isPublic && token?.emailVerified) {
    return NextResponse.redirect(buildUrl(req, `/${locale}/profile`));
  }

  // Role-based access control
  const matchedRoute = ROUTE_PERMISSIONS.find((route) =>
    cleanPath.startsWith(route.path),
  );

  if (matchedRoute) {
    // Not logged in → login
    if (!token) {
      const loginUrl = buildUrl(req, `/${locale}/login`);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role as keyof typeof ROLE_PRIORITY;

    // Missing role → unauthorized
    if (!userRole) {
      return NextResponse.redirect(buildUrl(req, `/${locale}/unauthorized`));
    }

    const requiredRole = matchedRoute.minRole as keyof typeof ROLE_PRIORITY;

    const userPriority = ROLE_PRIORITY[userRole] ?? 0;
    const requiredPriority = ROLE_PRIORITY[requiredRole];

    // Not enough permission
    if (userPriority < requiredPriority) {
      return NextResponse.redirect(buildUrl(req, `/${locale}/unauthorized`));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static and API
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|robots.txt|sitemap.xml|manifest.webmanifest|favicon.ico|images|assets|.*\\..*).*)",
  ],
};
