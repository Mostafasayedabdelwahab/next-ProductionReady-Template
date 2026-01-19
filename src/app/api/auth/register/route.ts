import { NextResponse } from "next/server";
import { registerUser } from "@/features/user/user.service";

export async function POST(req: Request) {
    try {
        // 1   body
        const body = await req.json();

        const { email, password, name } = body;

        // 2  service
        const user = await registerUser({
            email,
            password,
            name,
        });

        // 3 response 
        return NextResponse.json(
            {
                message: "Account created. Please verify your email.",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        //  Error handling
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
