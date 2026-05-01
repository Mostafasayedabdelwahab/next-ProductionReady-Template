// src/lib/constants/errors.ts

export const ERROR_CODES = {
  // --- 1. General & Server Errors ---
  SERVER_ERROR: "SERVER_ERROR",
  INVALID_TYPE: "INVALID_TYPE",
  NOT_FOUND: "NOT_FOUND",
  ERROR_LOADING: "ERROR_LOADING",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // --- 2. Authentication & Authorization ---
  UNAUTHORIZED: "UNAUTHORIZED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  COOLDOWN_ACTIVE: "COOLDOWN_ACTIVE",
  INVALID_TOKEN: "INVALID_TOKEN",

  // --- 3. User & Profile ---
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",
  INVALID_CURRENT_PASSWORD: "INVALID_CURRENT_PASSWORD",
  SAME_PASSWORD: "SAME_PASSWORD",
  SAME_PASSWORD_ERROR: "SAME_PASSWORD_ERROR",
  Passwords_Not_Match: "Passwords_Not_Match",
  PASSWORD_LOWERCASE: "PASSWORD_LOWERCASE",
  PASSWORD_UPPERCASE: "PASSWORD_UPPERCASE",
  PASSWORD_NUMBER: "PASSWORD_NUMBER",
  PASSWORD_SPECIAL: "PASSWORD_SPECIAL",
  NOT_ALLOWED_IN_DEMO: "NOT_ALLOWED_IN_DEMO",

  // --- 4. Validation & Form Inputs ---
  INVALID_INPUT: "INVALID_INPUT",
  INPUT_Required: "INPUT_Required",
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",
  INVALID_PASSWORD_FORMAT: "INVALID_PASSWORD_FORMAT",
  INVALID_URL: "INVALID_URL",
  INVALID_DOMAIN: "INVALID_DOMAIN",
  INVALID_COLOR: "INVALID_COLOR",
  INVALID_PHONE: "INVALID_PHONE",
  FIELD_TOO_SHORT: "FIELD_TOO_SHORT",
  FIELD_TOO_LONG: "FIELD_TOO_LONG",
  PRIMARY_BUTTON_LINK_REQUIRED: "PRIMARY_BUTTON_LINK_REQUIRED",
  SECONDARY_BUTTON_LINK_REQUIRED: "SECONDARY_BUTTON_LINK_REQUIRED",
  STATS_BOTH_REQUIRED: "STATS_BOTH_REQUIRED",

  // --- 5. File & Image Uploads ---
  WIDGET_LOAD_ERROR: "WIDGET_LOAD_ERROR",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  SIGNATURE_ERROR: "SIGNATURE_ERROR",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
} as const;

/**
 * Helper to get a human-readable message from an error code
 */

// export function getErrorMessage(
//   code: keyof typeof ERROR_CODES,
//   dict: Awaited<ReturnType<typeof getDictionary>>,
// ): string {
//   const errors = dict.errors as Record<keyof typeof ERROR_CODES, string>;

//   return (
//     errors[code] || errors[ERROR_CODES.SERVER_ERROR] || "An error occurred"
//   );
// }

export function getErrorMessage(
  code: string,
  dict: { errors: Record<string, string> },
) {
  const [errorCode, extra] = code.split(":");

  const message = dict.errors[errorCode];

  if (!message) return dict.errors.SERVER_ERROR;

  return extra ? `${message} (${extra})` : message;
}