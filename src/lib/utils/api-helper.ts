import { NextResponse } from "next/server";
import { ERROR_CODES, getErrorMessage } from "../constants/errors";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  // Validation Errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: error.issues[0]?.message ?? "Validation error",
        code: ERROR_CODES.INVALID_INPUT,
      },
      { status: 400 },
    );
  }
  // Mapping Status Codes
  if (error instanceof Error) {
    const code = error.message;
    const message = getErrorMessage(error.message);

    let status = 400;
    if (
      code === ERROR_CODES.UNAUTHORIZED ||
      code === ERROR_CODES.SESSION_EXPIRED
    )
      status = 401;
    if (
      code === ERROR_CODES.ACCOUNT_DISABLED ||
      code === ERROR_CODES.EMAIL_NOT_VERIFIED
    )
      status = 403;
    if (code === ERROR_CODES.NOT_FOUND) status = 404;

    return NextResponse.json({ message, code }, { status });
  }

  // Unknown fatal error
  return NextResponse.json(
    { message: "Internal Server Error", code: ERROR_CODES.SERVER_ERROR },
    { status: 500 },
  );
}
