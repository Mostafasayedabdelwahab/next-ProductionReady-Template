import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  createUser,
  findUserByEmail,
  createPasswordResetToken,
  deletePasswordResetToken,
  updateUserPassword,
  getValidResetTokens,
  getUserById,
  createEmailVerificationToken,
  deleteEmailVerificationToken,
  markUserEmailVerified,
  findLastEmailVerificationToken,
  findLastPasswordResetToken,
  getUserWithPassword,
} from "./user.repository";
import {
  registerApiSchema,
  loginSchema,
  resetPasswordApiSchema,
} from "./user.schema";
import {
  sendEmailVerificationEmail,
  sendResetPasswordEmail,
} from "@/services/mail";
import { ERROR_CODES } from "@/config/errors";

export async function registerUser(input: unknown) {
  const data = registerApiSchema.parse(input);

  const { email, password, name } = data;

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error(ERROR_CODES.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    email: normalizedEmail,
    name,
    password: hashedPassword,
  });

  await sendEmailVerification(user.id);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function loginUser(input: unknown) {

  const data = loginSchema.parse(input);

  const { email, password } = data;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error(ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (!user.emailVerified) {
    return {
      ...user,
      emailVerified: null,
    };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error(ERROR_CODES.INVALID_CREDENTIALS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;

  return safeUser;
  
}

export async function forgotPassword(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) return;

  const lastToken = await findLastPasswordResetToken(user.id);

  if (lastToken) {
    const diff = Date.now() - lastToken.createdAt.getTime();

    if (diff < 60 * 1000) {
      throw new Error(ERROR_CODES.COOLDOWN_ACTIVE);
    }
  }

  // 3️⃣ Generate raw token
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = await bcrypt.hash(rawToken, 10);

  // 5️⃣ Save token
  await createPasswordResetToken({
    userId: user.id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  // 6️⃣  Create reset link
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;

  // 7️⃣  Send email
  await sendResetPasswordEmail(user.email, resetLink);
}

export async function resetPassword(input: unknown) {
  const { token, password } = resetPasswordApiSchema.parse(input);

  const resetTokens = await getValidResetTokens();

  let matchedToken = null;

  for (const t of resetTokens) {
    const isValid = await bcrypt.compare(token, t.token);
    if (isValid) {
      matchedToken = t;
      break;
    }
  }

  if (!matchedToken) {
    throw new Error(ERROR_CODES.INVALID_TOKEN);
  }

  const user = await getUserWithPassword(matchedToken.userId);

  if (!user || !user.password) {
    throw new Error(ERROR_CODES.USER_NOT_FOUND);
  }

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword) {
    throw new Error(ERROR_CODES.SAME_PASSWORD_ERROR);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUserPassword(matchedToken.userId, hashedPassword);

  await deletePasswordResetToken(matchedToken.id);
}

export async function sendEmailVerification(userId: string) {
  const user = await getUserById(userId);
  if (!user) return;
  if (user.emailVerified) return;

  // 🔒 Cooldown check (5 minutes)
  const lastToken = await findLastEmailVerificationToken(user.id);

  if (lastToken) {

    const diff = Date.now() - lastToken.createdAt.getTime();

    if (diff < 1000 * 60 * 5) {
      throw new Error(ERROR_CODES.COOLDOWN_ACTIVE);
    }
  }

  // 1️⃣ Raw token
  const rawCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 2️⃣ Hash token
  const hashedCode = await bcrypt.hash(rawCode, 10);

  await deleteEmailVerificationToken(user.id);

  // 3️⃣ Save token
  await createEmailVerificationToken({
    userId: user.id,
    token: hashedCode,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  // 5️⃣ Send mail
  await sendEmailVerificationEmail(user.email, rawCode);
}

export async function verifyEmail(userId: string, code: string) {
  const token = await findLastEmailVerificationToken(userId);

  if (!token || token.expiresAt < new Date()) {
    throw new Error(ERROR_CODES.INVALID_TOKEN);
  }

  const isValid = await bcrypt.compare(code, token.token);

  if (!isValid) {
    await deleteEmailVerificationToken(userId);

    throw new Error(ERROR_CODES.INVALID_TOKEN);
  }

  const user = await markUserEmailVerified(userId);
  await deleteEmailVerificationToken(userId);
  return user;
}

export async function resendVerificationEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) return;

  if (user.emailVerified) return;

  await sendEmailVerification(user.id);
}
