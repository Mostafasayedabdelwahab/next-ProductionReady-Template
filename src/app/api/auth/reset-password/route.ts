import { NextResponse } from "next/server";
import { resetPassword } from "@/features/user/user.service";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        await resetPassword(body);

        return NextResponse.json({
            message: "Password updated successfully",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: error.issues[0].message },
                { status: 400 }
            );
        }

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
