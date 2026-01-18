import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { requireVerifiedUser } from "@/lib/guards";

export async function POST(req: Request) {
   const result = await requireVerifiedUser();
   if (result instanceof Response) return result;
   const user = result;


    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    
    if (!file) {
        return NextResponse.json(
            { message: "No file provided" },
            { status: 400 }
        );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid file type" },
        { status: 400 },
      );
    }

    const MAX_SIZE = 2 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "File too large" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {


        cloudinary.uploader
          .upload_stream(
            {
              folder: `avatars/${user.id}`,
              public_id: "avatar",
              overwrite: true,
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                return reject(error || new Error("Upload failed"));
              }

              resolve(result);
            },
          )
          .end(buffer);
    });

    return NextResponse.json({
        imageUrl: uploadResult.secure_url,
    });
}
