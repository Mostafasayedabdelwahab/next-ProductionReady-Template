import bcrypt from "bcryptjs";
import crypto from "crypto";

import { createUser, findUserByEmail, createPasswordResetToken, deletePasswordResetToken, updateUserPassword, getValidResetTokens, getUserById } from "./user.repository";
import { registerApiSchema, loginSchema, resetPasswordApiSchema } from "./user.schema";
import { sendResetPasswordEmail } from "@/lib/mail";



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
