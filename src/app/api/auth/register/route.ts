import { NextResponse } from "next/server";
import { registerUser } from "@/features/user/user.service";
import { handleApiError } from "@/lib/utils/api-helper"; // ensure correct import path

export async function POST(req: Request) {
  try {
    // 1️⃣ Get request body
    const body = await req.json();

    // 2️⃣ Call service (service handles Zod validation and password hashing)
    const user = await registerUser(body);

    // 3️⃣ Success response
    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please check your email for verification.",
        data: user, // SafeUser returned from service
      },
      { status: 201 },
    );
  } catch (error) {
    // 4️⃣ Centralized error handling with error codes
    // Helper automatically maps USER_ALREADY_EXISTS to 409, etc.
    return handleApiError(error);
  }
}
