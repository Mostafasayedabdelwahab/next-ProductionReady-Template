import prisma from "@/lib/prisma";
import { CreateUserInput } from "./user.types";

export async function createUser(data: Pick<CreateUserInput, "email" | "password" | "name">) {
    return prisma.user.create({
        data,
    });
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}
export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}


export async function createPasswordResetToken(data: {
    userId: string;
    token: string;
    expiresAt: Date;
}) {
    return prisma.passwordResetToken.create({ data });
}



export async function findValidPasswordResetTokenByUser(
    userId: string
) {
    return prisma.passwordResetToken.findFirst({
        where: {
            userId,
            expiresAt: { gt: new Date() },
        },
    });
}

export async function getValidResetTokens() {
    return prisma.passwordResetToken.findMany({
        where: {
            expiresAt: { gt: new Date() },
        },
        include: { user: true },
    });
}


export async function deletePasswordResetToken(id: string) {
    return prisma.passwordResetToken.delete({
        where: { id },
    });
}

export async function updateUserPassword(
    userId: string,
    password: string
) {
    return prisma.user.update({
        where: { id: userId },
        data: { password },
    });
}


/**
 * Get user name by user id
 */
export async function getUserNameById(
    userId: string
): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
    });

    return user?.name ?? null;
}