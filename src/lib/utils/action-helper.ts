// src/lib/utils/action-helper.ts
import { ZodError } from "zod";
import { getErrorMessage } from "../constants/errors";

export function handleActionError(error: unknown) {
  if (error instanceof ZodError) {
    return { success: false, error: error.issues[0].message };
  }

  if (error instanceof Error) {
    return { success: false, error: getErrorMessage(error.message) };
  }

  return { success: false, error: "An unexpected error occurred" };
}
