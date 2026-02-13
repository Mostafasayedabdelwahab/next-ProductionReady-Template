import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { requireVerifiedUser } from "@/lib/guards";
import { handleApiError } from "@/lib/utils/api-helper";
import { ERROR_CODES } from "@/lib/constants/errors";

export async function POST(req: Request) {
  try {
    // 1. الحماية: التأكد من اليوزر
    const user = await requireVerifiedUser();

    // 2. استلام الملف والتحقق الأولي
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) throw new Error(ERROR_CODES.INVALID_INPUT); // أو كود خاص مثل NO_FILE_PROVIDED

    // 3. التحقق من النوع والحجم (Business Logic)
    if (!file.type.startsWith("image/")) {
      throw new Error("INVALID_FILE_TYPE"); // ضيف الكود ده في الـ constants
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      throw new Error("FILE_TOO_LARGE"); // ضيف الكود ده في الـ constants
    }

    // 4. تحويل الملف لـ Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. الرفع لـ Cloudinary باستخدام Promise
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `avatars/${user.id}`,
              public_id: "avatar",
              overwrite: true,
              resource_type: "image",
              // تحسين: تصغير الصورة وعمل Crop تلقائي في السيرفر لتوفير الباندويث
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
              ],
            },
            (error, result) => {
              if (error || !result) reject(error || new Error("UPLOAD_FAILED"));
              else resolve(result);
            },
          )
          .end(buffer);
      },
    );

    // 6. الرد بنجاح
    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    // هنا handleApiError هتقوم بالواجب كله
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const user = await requireVerifiedUser();

    // 1. حذف الصورة من Cloudinary
    // بما إننا بنستخدم public_id ثابت "avatar" جوه فولدر اليوزر
    await cloudinary.uploader.destroy(`avatars/${user.id}/avatar`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}