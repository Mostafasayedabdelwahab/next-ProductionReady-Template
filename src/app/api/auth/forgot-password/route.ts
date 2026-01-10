import { forgotPassword } from "@/features/user/user.service";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        await forgotPassword(email);

        return NextResponse.json({
            message: "If the email exists, a reset link was sent",
        });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return NextResponse.json(
            { message: "Something went wrong form route" },
            { status: 500 }
        );
    }
}
