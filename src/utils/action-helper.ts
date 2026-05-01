import { ZodError } from "zod";
import { ERROR_CODES } from "../config/errors";

// Normalize server action errors into ActionResponse shape

export function handleActionError(error: unknown) {
  // Handle validation errors from Zod
  if (error instanceof ZodError) {
    return {
      success: false as const,
      code: ERROR_CODES.INVALID_INPUT,
      validationErrors: error.format(),
    };
  }

  // Handle known application errors
  if (error instanceof Error) {
    return {
      success: false as const,
      // Return raw code so frontend can use it in logic
      code: error.message,
    };
  }

  // Fallback for unknown errors
  return {
    success: false as const,
    code: ERROR_CODES.SERVER_ERROR,
  };
}
