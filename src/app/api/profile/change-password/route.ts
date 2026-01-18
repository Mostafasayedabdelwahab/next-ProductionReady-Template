import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { changeUserPassword } from "@/features/profile/profile.service";
import { ZodError } from "zod";
export async function PATCH(req: Request) {

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        await changeUserPassword(session.user.id, body);

        return NextResponse.json({ success: true });
    } catch (error) {
        // ✅ Zod validation error
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: error.issues[0].message },
                { status: 400 }
            );
        }

        // ✅ Business logic error
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