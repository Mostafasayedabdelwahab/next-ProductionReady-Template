// src/lib/constants/errors.ts

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INVALID_INPUT: "INVALID_INPUT",
  SERVER_ERROR: "SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.UNAUTHORIZED]: "You are not authorized. Please log in again.",
  [ERROR_CODES.ACCOUNT_DISABLED]:
    "Your account has been disabled. Please contact support.",
  [ERROR_CODES.EMAIL_NOT_VERIFIED]:
    "Please verify your email address to access this feature.",
  [ERROR_CODES.SESSION_EXPIRED]:
    "Your session has expired. Please log in again to continue.",
  [ERROR_CODES.INVALID_INPUT]:
    "The information provided is invalid. Please check and try again.",
  [ERROR_CODES.SERVER_ERROR]:
    "An unexpected error occurred. Please try again later.",
  [ERROR_CODES.NOT_FOUND]: "The requested resource could not be found.",
};

/**
 * Helper to get a human-readable message from an error code
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
}
