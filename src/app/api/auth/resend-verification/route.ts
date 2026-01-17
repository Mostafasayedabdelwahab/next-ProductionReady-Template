import { NextResponse } from "next/server";
import { resendVerificationEmail } from "@/features/user/user.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await resendVerificationEmail(email);

        return NextResponse.json({
            message:
                "If an account exists, a verification email has been sent.",
        });
    } catch {
        return NextResponse.json(
          {
            message: "Please wait before requesting another verification email",
          },
          { status: 429 },
        );
    }
}
