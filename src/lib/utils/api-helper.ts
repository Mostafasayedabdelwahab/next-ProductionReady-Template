import { NextResponse } from "next/server";
import { ERROR_CODES, getErrorMessage } from "../constants/errors";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  // Validation Errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: error.issues[0]?.message ?? "Validation error" },
      { status: 400 },
    );
  }

  if (error instanceof Error) {
    const message = getErrorMessage(error.message);

    // Authentication Errors (401)
    if (
      error.message === ERROR_CODES.UNAUTHORIZED ||
      error.message === ERROR_CODES.SESSION_EXPIRED
    ) {
      return NextResponse.json({ message }, { status: 401 });
    }

    // Authorization Errors (403)
    if (
      error.message === ERROR_CODES.ACCOUNT_DISABLED ||
      error.message === ERROR_CODES.EMAIL_NOT_VERIFIED
    ) {
      return NextResponse.json({ message }, { status: 403 });
    }

    // Default business / app error
    return NextResponse.json({ message }, { status: 400 });
  }

  // Unknown fatal error
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 },
  );
}
