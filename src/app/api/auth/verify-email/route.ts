import { verifyEmail } from "@/features/user/user.service";
import { handleApiError } from "@/lib/utils/api-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { token } = body;

    // Validate token existence
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_TOKEN",
          message: "Verification token is required",
        },
        { status: 400 },
      );
    }

    // Call service (handles hashing and validation)
    await verifyEmail(token);

    // Success response
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    // Centralized error handling
    return handleApiError(error);
  }
}
