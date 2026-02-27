import { ZodError } from "zod";
import { getErrorMessage, ERROR_CODES } from "../constants/errors";

/**
 * Normalize server action errors into ActionResponse shape
 */
export function handleActionError(error: unknown) {
  // Handle validation errors from Zod
  if (error instanceof ZodError) {
    return {
      success: false as const,
      error: error.issues[0]?.message ?? "Validation error",
      code: ERROR_CODES.INVALID_INPUT,
    };
  }

  // Handle known application errors
  if (error instanceof Error) {
    return {
      success: false as const,
      error: getErrorMessage(error.message),
      // Return raw code so frontend can use it in logic
      code: error.message,
    };
  }

  // Fallback for unknown errors
  return {
    success: false as const,
    error: "An unexpected error occurred",
    code: ERROR_CODES.SERVER_ERROR,
  };
}
