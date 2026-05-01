// src/lib/constants/success.ts

export const SUCCESS_CODES = {
  SETTINGS_UPDATED: "SETTINGS_UPDATED",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  UPLOAD_COMPLETE: "UPLOAD_COMPLETE",

  // Testing messages
  PROFILE_UPDATED: "PROFILE_UPDATED",
  EMAIL_SENT: "EMAIL_SENT",
  ACCOUNT_CREATED: "ACCOUNT_CREATED",
  IMAGE_REMOVED: "IMAGE_REMOVED",
  DATA_SAVED: "DATA_SAVED",
} as const;

export function getSuccessMessage(
  code: keyof typeof SUCCESS_CODES,
  dict: { success: Record<string, string> },
) {
  return dict.success[code] ?? "Operation completed successfully.";
}
