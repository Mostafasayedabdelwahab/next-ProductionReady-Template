import { NextResponse } from "next/server";
import { registerUser } from "@/features/user/user.service";

export async function POST(req: Request) {
    try {
        // 1️⃣ نقرأ الـ body
        const body = await req.json();

        const { email, password, name } = body;

        // 2️⃣ ننادي الـ service
        const user = await registerUser({
            email,
            password,
            name,
        });

        // 3️⃣ نرجّع response ناجح
        return NextResponse.json(
            {
                message: "Account created. Please verify your email.",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        // 4️⃣ Error handling
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
