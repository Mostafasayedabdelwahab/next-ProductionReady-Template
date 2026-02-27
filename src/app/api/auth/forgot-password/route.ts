import { forgotPassword } from "@/features/user/user.service";
import { handleApiError } from "@/lib/utils/api-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Basic guard to ensure email is provided
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    // Call service (handles cooldown and security internally)
    await forgotPassword(email);

    // Always return generic success message for security
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    // Centralized error handling (e.g., COOLDOWN_ACTIVE)
    return handleApiError(error);
  }
}
