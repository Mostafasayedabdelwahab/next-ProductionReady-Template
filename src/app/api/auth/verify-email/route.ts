import { verifyEmail } from "@/features/user/user.service";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { message: "Code is required" },
        { status: 400 },
      );
    }

    // ✅ verify
    const user = await verifyEmail(session.user.id, code);

    // 🔥 generate new token
    const token = await encode({
      token: {
        id: user.id,
        role: user.role,
        sessionVersion: user.sessionVersion,
        passwordChangedAt: user.passwordChangedAt,
        emailVerified: user.emailVerified,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    const res = NextResponse.json({
      success: true,
    });

    // 🔥 set updated cookie
    res.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      path: "/",
    });

    return res;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
