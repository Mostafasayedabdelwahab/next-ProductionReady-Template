import { NextResponse } from "next/server";
import { resetPassword } from "@/features/user/user.service";
import { handleApiError } from "@/lib/utils/api-helper";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Service will validate token and password using Zod
    await resetPassword(body);

    return NextResponse.json(
      {
        success: true,
        message:
          "Password updated successfully. You can now login with your new password.",
      },
      { status: 200 },
    );
  } catch (error) {
    // Helper handles:
    // 1. Zod validation errors
    // 2. INVALID_TOKEN (expired or invalid link)
    // 3. SAME_PASSWORD_ERROR (new password equals old password)
    return handleApiError(error);
  }
}
