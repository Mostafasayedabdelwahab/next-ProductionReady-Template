import { NextResponse } from "next/server";
import { changeUserPassword } from "@/features/profile/profile.service";
import { ZodError } from "zod";
import { requireVerifiedUser } from "@/lib/guards";
export async function PATCH(req: Request) {

    const result = await requireVerifiedUser();
    if (result instanceof Response) return result;
    const user = result;

    try {
        const body = await req.json();
        await changeUserPassword(user.id, body);

        return NextResponse.json({ success: true });
    } catch (error) {
        //  Zod validation error
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: error.issues[0].message },
                { status: 400 }
            );
        }

        //  Business logic error
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