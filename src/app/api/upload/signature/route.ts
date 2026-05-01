import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireUser } from "@/guards";
import { handleApiError } from "@/utils/api-helper";
import { ERROR_CODES } from "@/config/errors";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * API Route to generate a signed Cloudinary upload request.
 * This ensures that image uploads are authorized and secure.
 */
export async function POST() {
  try {
    // 1. Authorization: Only Users are allowed to generate signatures
    const user = await requireUser();

    if (user.email === process.env.ADMIN_DEMO_EMAIL) {
      return new Response("Demo not allowed", { status: 403 });
    }

    // 2. Validate environment configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folderName = "next-production-ready-template"; // Centralized folder name

    if (!apiSecret || !cloudName || !apiKey) {
      throw new Error(ERROR_CODES.SERVER_ERROR);
    }

    // 3. Generate a unix timestamp for the signature
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Prepare parameters for signing (Must match Cloudinary requirements)
    const paramsToSign = {
      timestamp,
      folder: folderName,
      source: "uw", // Upload Widget identifier
    };

    // 5. Generate secure signature using the Cloudinary SDK
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    // 6. Return secure credentials to the client
    return NextResponse.json({
      timestamp,
      signature,
      cloudName,
      apiKey,
      folder: folderName,
    });
  } catch (error) {
    // 7. Handle and sanitize error response
    return handleApiError(error);
  }
}
