import bcrypt from "bcryptjs";
import crypto from "crypto";

import { ERROR_CODES } from "@/lib/constants/errors";
import * as userRepo from "./user.repository";
import * as userSchema from "./user.schema";
import { SafeUser } from "./user.types";
import { sendEmailVerificationEmail, sendResetPasswordEmail } from "@/lib/mail";

/**
 * Hash token using sha256
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Register new user
 */
export async function registerUser(input: unknown): Promise<SafeUser> {
  // Validate input
  const data = userSchema.registerApiSchema.parse(input);
  const { email, password, name } = data;

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error(ERROR_CODES.USER_ALREADY_EXISTS);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser({
    email,
    name,
    password: hashedPassword,
  });

  // Send verification email
  await sendEmailVerification(user.id);

  // Remove password before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;

  return safeUser;
}

/**
 * Login user
 */
export async function loginUser(input: unknown): Promise<SafeUser> {
  // Validate input
  const data = userSchema.loginSchema.parse(input);
  const { email, password } = data;

  const user = await findUserByEmail(email);
  if (!user) throw new Error(ERROR_CODES.INVALID_CREDENTIALS);

  if (user.emailVerified == null) {
    throw new Error(ERROR_CODES.EMAIL_NOT_VERIFIED);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error(ERROR_CODES.INVALID_CREDENTIALS);

  // Remove password before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;

  return safeUser;
}

/**
 * Forgot password flow
 */
export async function forgotPassword(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);

  // Security: do not reveal existence
  if (!user) return;

  // Cooldown check (60s)
  const lastToken = await userRepo.findLastPasswordResetToken(user.id);

  if (lastToken) {
    const diff = Date.now() - lastToken.createdAt.getTime();
    if (diff < 60 * 1000) {
      throw new Error(ERROR_CODES.COOLDOWN_ACTIVE);
    }
  }

  // Generate raw token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  const hashedToken = hashToken(rawToken);

  await userRepo.createPasswordResetToken({
    userId: user.id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
  });

  const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}`;

  await sendResetPasswordEmail(user.email, resetLink);
}

/**
 * Reset password
 */
export async function resetPassword(input: unknown) {
  const { token, password } = userSchema.resetPasswordApiSchema.parse(input);

  const hashedToken = hashToken(token);

  const matchedToken = await userRepo.findPasswordResetTokenByHash(hashedToken);

  if (!matchedToken || matchedToken.expiresAt < new Date()) {
    throw new Error(ERROR_CODES.INVALID_TOKEN);
  }

  const user = await userRepo.getUserById(matchedToken.userId);

  if (!user || !user.password) {
    throw new Error(ERROR_CODES.USER_NOT_FOUND);
  }

  // Prevent using the same password
  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword) {
    throw new Error(ERROR_CODES.SAME_PASSWORD_ERROR);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepo.updateUserPassword(matchedToken.userId, hashedPassword);

  await userRepo.deletePasswordResetToken(matchedToken.id);
}

/**
 * Send email verification
 */
export async function sendEmailVerification(userId: string) {
  const user = await userRepo.getUserById(userId);
  if (!user) return;
  if (user.emailVerified) return;

  // Cooldown check (5 minutes)
  const lastToken = await userRepo.findLastEmailVerificationToken(user.id);

  if (lastToken) {
    const diff = Date.now() - lastToken.createdAt.getTime();
    if (diff < 1000 * 60 * 5) {
      throw new Error(ERROR_CODES.COOLDOWN_ACTIVE);
    }
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  await userRepo.deleteEmailVerificationToken(user.id);

  await userRepo.createEmailVerificationToken({
    userId: user.id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
  });

  const link = `${process.env.APP_URL}/verify-email?token=${rawToken}`;

  await sendEmailVerificationEmail(user.email, link);
}

/**
 * Verify email
 */
export async function verifyEmail(token: string) {
  const hashedToken = hashToken(token);

  const matched = await userRepo.findEmailVerificationTokenByHash(hashedToken);

  if (!matched || matched.expiresAt < new Date()) {
    throw new Error(ERROR_CODES.INVALID_TOKEN);
  }

  await userRepo.markUserEmailVerified(matched.userId);
  await userRepo.deleteEmailVerificationToken(matched.id);
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);

  // Security: do not reveal existence
  if (!user) return;
  if (user.emailVerified) return;

  await userRepo.deleteEmailVerificationToken(user.id);
  await sendEmailVerification(user.id);
}

/**
 * Find user by email (normalized)
 */
export async function findUserByEmail(email: string) {
  if (!email) return null;

  return userRepo.findUniqueByEmail(email.toLowerCase());
}
