import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getOrCreateProfile, updateUserProfile, } from "@/features/profile/profile.service";

import { requireVerifiedUser } from "@/lib/guards";


/**
 * ======================
 * GET /api/profile
 * ======================
 * Get current user profile
 */
export async function GET() {
    const result = await requireVerifiedUser();

    if (result instanceof Response) {
      return result;
    }

    const user = result;

    const profile = await getOrCreateProfile(user.id);

    return NextResponse.json(profile);
}

/**
 * ======================
 * PATCH /api/profile
 * ======================
 * Update current user profile
 */
export async function PATCH(req: Request) {
    const result = await requireVerifiedUser();

    if (result instanceof Response) {
      return result;
    }

    const user = result;
    try {
        const body = await req.json();

        const updatedProfile = await updateUserProfile(
            user.id,
            body
        );

        return NextResponse.json(updatedProfile);
    } catch (error: unknown) {
        //  Zod validation error
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    message: error.issues[0].message,
                },
                { status: 400 }
            );
        }

        //  Known runtime error
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        //  Unknown error
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
