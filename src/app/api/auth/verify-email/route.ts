import { verifyEmail } from "@/features/user/user.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { message: "Token is required" },
                { status: 400 }
            );
        }

        await verifyEmail(token);

        return NextResponse.json({
            message: "Email verified successfully. Redirecting to login...",
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
