import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    // 1️⃣ نقرأ التوكن من الكوكيز (JWT)
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // 2️⃣ نعرف اليوزر رايح على أنهي مسار
    const { pathname } = req.nextUrl;

    /**
     * ======================================
     * 🔒 حماية الصفحات اللي محتاجة Login
     * ======================================
     */

    // أي صفحة تحت /dashboard profile
    const protectedRoutes = ["/dashboard", "/profile"];

    if (
        protectedRoutes.some(route => pathname.startsWith(route)) &&
        !token
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // /login
    if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/verify-email-info") || pathname.startsWith("/verify-email")) {
        // لو  عامل تسجيل دخول
        if (token) {
            return NextResponse.redirect(
                new URL("/profile", req.url)
            );
        }
    }


    /**
     * ======================================
     * 👮‍♂️ حماية صفحات الأدمن فقط
     * ======================================
     */

    if (
        pathname.startsWith("/dashboard/admin") &&
        token?.role !== "ADMIN"
    ) {
        return NextResponse.redirect(
            new URL("/unauthorized", req.url)
        );
    }

    /**
     * ======================================
     * ✅ السماح بباقي الريكوستات
     * ======================================
     */

    if (req.nextUrl.pathname.startsWith("/api/cron")) {
      return NextResponse.next();
    }

    return NextResponse.next();
}

/**
 * ======================================
 * 🎯 نحدد الميدل وير يشتغل على أنهي Routes
 * ======================================
 */
export const config = {
    matcher: [
        "/login",
        "/register",
        "/verify-email-info",
        "/verify-email",
        "/profile",
        "/dashboard/:path*",
    ],
};
