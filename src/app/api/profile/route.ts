import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getOrCreateProfile, updateUserProfile, } from "@/features/profile/profile.service";

/**
 * ======================
 * GET /api/profile
 * ======================
 * Get current user profile
 */
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const profile = await getOrCreateProfile(
        session.user.id
    );

    return NextResponse.json(profile);
}

/**
 * ======================
 * PATCH /api/profile
 * ======================
 * Update current user profile
 */
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const body = await req.json();

    const updatedProfile = await updateUserProfile(
        session.user.id,
        body
    );

    return NextResponse.json(updatedProfile);
}
