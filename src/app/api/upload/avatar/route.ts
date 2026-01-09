import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json(
            { message: "No file provided" },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {


        cloudinary.uploader
            .upload_stream(
                {
                    folder: "avatars",
                    public_id: session.user.id,
                    overwrite: true,
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error || new Error("Upload failed"));
                    }

                    resolve(result);
                }

            )
            .end(buffer);
    });

    return NextResponse.json({
        imageUrl: uploadResult.secure_url,
    });
}
