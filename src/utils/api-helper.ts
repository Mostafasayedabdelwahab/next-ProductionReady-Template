import { NextResponse } from "next/server";
import { ERROR_CODES } from "../config/errors";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  console.error("[API_ERROR]:", error);
  // 1) Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        code: ERROR_CODES.INVALID_INPUT,
        errors: error.format(),
      },
      { status: 400 },
    );
  }

  // 2) Handle known application errors
  if (error instanceof Error) {
    const code = error.message;
    // Default status
    let status = 400;

    switch (code) {
      case ERROR_CODES.UNAUTHORIZED:
      case ERROR_CODES.SESSION_EXPIRED:
      case ERROR_CODES.INVALID_CREDENTIALS:
        status = 401;
        break;

      case ERROR_CODES.ACCOUNT_DISABLED:
      case ERROR_CODES.EMAIL_NOT_VERIFIED:
        status = 403;
        break;

      case ERROR_CODES.NOT_FOUND:
        status = 404;
        break;

      case ERROR_CODES.USER_ALREADY_EXISTS:
        status = 409; // Conflict
        break;

      case ERROR_CODES.COOLDOWN_ACTIVE:
        status = 429; // Too Many Requests
        break;
    }

    return NextResponse.json({ success: false, code }, { status });
  }

  // 3) Fallback for unknown errors
  return NextResponse.json(
    {
      success: false,
      code: ERROR_CODES.SERVER_ERROR,
    },
    { status: 500 },
  );
}
