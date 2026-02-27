import { NextResponse } from "next/server";
import { resendVerificationEmail } from "@/features/user/user.service";
import { handleApiError } from "@/lib/utils/api-helper";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Basic validation: ensure email exists in request
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    // Call service (handles cooldown and security internally)
    await resendVerificationEmail(email);

    // Always return generic success response for security/privacy
    return NextResponse.json({
      success: true,
      message:
        "If an account exists and is not verified, a verification email has been sent.",
    });
  } catch (error) {
    // Handle dynamic errors (e.g., COOLDOWN_ACTIVE)
    return handleApiError(error);
  }
}
