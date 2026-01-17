import bcrypt from "bcryptjs";
import crypto from "crypto";

import { createUser, findUserByEmail, createPasswordResetToken, deletePasswordResetToken, updateUserPassword, getValidResetTokens, getUserById, createEmailVerificationToken, findValidEmailVerificationTokens, deleteEmailVerificationToken, markUserEmailVerified, findLastEmailVerificationToken, findLastPasswordResetToken } from "./user.repository";
import { registerApiSchema, loginSchema, resetPasswordApiSchema } from "./user.schema";
import { sendEmailVerificationEmail, sendResetPasswordEmail } from "@/lib/mail";




export async function registerUser(input: unknown) {
    // 1️⃣ Validation حقيقي
    const data = registerApiSchema.parse(input);

    const { email, password, name } = data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        email,
        name,
        password: hashedPassword,
    });

    // بعد createUser
    await sendEmailVerification(user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
}


export async function loginUser(input: unknown) {
    // 1️⃣ Validation حقيقي بـ Zod
    const data = loginSchema.parse(input);

    const { email, password } = data;

    // 2️⃣ نجيب اليوزر
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }


    if (user.emailVerified == null) {
        throw new Error("EMAIL_NOT_VERIFIED");
    }

    // 3️⃣ نقارن الباسورد
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error("Invalid email or password");
    }

   

    // 4️⃣ نرجّع Safe User
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;

    return safeUser;
}


export async function forgotPassword(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);

  // 🛡️ Security: نرجع بدون error
  if (!user) return;

  // 2️⃣ (اختياري لكن مهم) امسح أي توكن قديم
  // await deletePasswordResetToken(user.id);

  // ⏱️ cooldown = 60 ثانية
  const lastToken = await findLastPasswordResetToken(user.id);

  if (lastToken) {
    const diff = Date.now() - lastToken.createdAt.getTime();

    if (diff < 60 * 1000) {
      throw new Error(
        "Please wait before requesting another password reset email",
      );
    }
    }
    

  // 3️⃣ Generate raw token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // 4️⃣ Hash token قبل التخزين
  const hashedToken = await bcrypt.hash(rawToken, 10);

  // 5️⃣ Save token
  await createPasswordResetToken({
    userId: user.id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 min
  });

  // 6️⃣  Create reset link
  const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}`;

  // 7️⃣  Send email
  await sendResetPasswordEmail(user.email, resetLink);
}

export async function resetPassword(input: unknown) {
    const { token, password } =
        resetPasswordApiSchema.parse(input);

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
        throw new Error("Invalid or expired token");
    }

    const user = await getUserById(matchedToken.userId);

    if (!user || !user.password) {
        throw new Error("User not found");
    }

    // ⛔ امنع نفس الباسورد القديم
    const isSamePassword = await bcrypt.compare(
        password,
        user.password
    );

    if (isSamePassword) {
        throw new Error("New password must be different from old password");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateUserPassword(
        matchedToken.userId,
        hashedPassword
    );

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
      throw new Error(
        "Please wait before requesting another verification email",
      );
    }
  }

  // 1️⃣ Raw token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // 2️⃣ Hash token
  const hashedToken = await bcrypt.hash(rawToken, 10);

  await deleteEmailVerificationToken(user.id);

  // 3️⃣ Save token
  await createEmailVerificationToken({
    userId: user.id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
  });

  // 4️⃣ Link
  const link = `${process.env.APP_URL}/verify-email?token=${rawToken}`;

  // 5️⃣ Send mail
  await sendEmailVerificationEmail(user.email, link);
}

export async function verifyEmail(token: string) {
    const tokens = await findValidEmailVerificationTokens();

    let matched = null;

    for (const t of tokens) {
        const ok = await bcrypt.compare(token, t.token);
        if (ok) {
            matched = t;
            break;
        }
    }

    if (!matched) {
        throw new Error("Invalid or expired verification link");
    }

    // 1️⃣ Mark user as verified
    await markUserEmailVerified(matched.userId);

    // 2️⃣ Delete token
    await deleteEmailVerificationToken(matched.id);
}

export async function resendVerificationEmail(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await findUserByEmail(normalizedEmail);

    // 🛡️ Security: ما نكشفش إذا الإيميل موجود ولا لا
    if (!user) return;

    if (user.emailVerified) return;

    // امسح أي توكن قديم
    await deleteEmailVerificationToken(user.id);

    // ابعت Verification جديد
    await sendEmailVerification(user.id);
}
