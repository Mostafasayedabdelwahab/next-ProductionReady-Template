// src/lib/constants/errors.ts

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INVALID_INPUT: "INVALID_INPUT",
  SERVER_ERROR: "SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",

  INVALID_CURRENT_PASSWORD: "INVALID_CURRENT_PASSWORD",
  SAME_PASSWORD_ERROR: "SAME_PASSWORD_ERROR",
  PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",

  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  UPLOAD_FAILED: "UPLOAD_FAILED",

  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  COOLDOWN_ACTIVE: "COOLDOWN_ACTIVE",
  INVALID_TOKEN: "INVALID_TOKEN",
  SAME_PASSWORD: "SAME_PASSWORD",
  USER_NOT_FOUND: "USER_NOT_FOUND",
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

  [ERROR_CODES.INVALID_CURRENT_PASSWORD]: "Current password is incorrect.",
  [ERROR_CODES.SAME_PASSWORD_ERROR]:
    "New password cannot be the same as the old one.",
  [ERROR_CODES.PROFILE_NOT_FOUND]: "Profile data not found.",

  [ERROR_CODES.FILE_TOO_LARGE]: "File size is too large (Max 2MB)",
  [ERROR_CODES.INVALID_FILE_TYPE]: "Invalid file type. Only images are allowed",
  [ERROR_CODES.UPLOAD_FAILED]: "Failed to upload image to cloud storage",

  [ERROR_CODES.USER_ALREADY_EXISTS]: "User already exists",
  [ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email or password",
  [ERROR_CODES.COOLDOWN_ACTIVE]: "Please wait before requesting another email",
  [ERROR_CODES.INVALID_TOKEN]: "Invalid or expired token",
  [ERROR_CODES.SAME_PASSWORD]: "New password must be different",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
};

/**
 * Helper to get a human-readable message from an error code
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
}
