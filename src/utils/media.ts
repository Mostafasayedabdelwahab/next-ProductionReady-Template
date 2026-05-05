// media.ts

import { Media } from "@/types/upload.type";

// type guard
export function isMedia(value: unknown): value is Media {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    "public_id" in value
  );
}

// safe parser
export function parseMedia(value: unknown): Media | null {
  return isMedia(value) ? value : null;
}

// get only url (most used)
export function getMediaUrl(value: unknown): string | null {
  const url = isMedia(value) ? value.url : null;
  if (!url) return null;

  if (url.includes("res.cloudinary.com/dyakgf0sk/image/upload/")) {
    return url.replace(
      "https://res.cloudinary.com/dyakgf0sk/image/upload/",
      "/assets/",
    );
  }
  return url;
}

// get resource type
export function getMediaType(value: unknown): "image" | "video" | null {
  return isMedia(value) ? value.resource_type : null;
}

export function normalizeMedia(value: unknown): Media | null {
  if (!value || value === "") return null;

  if (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    "public_id" in value
  ) {
    return value as Media;
  }

  return null;
}

// Build an optimized Cloudinary image URL with transformations
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | number;
  },
): string {
  if (!url) return url;

  const { width, height, quality = "auto" } = options ?? {};
  const transformations: string[] = ["f_auto", `q_${quality}`];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  const transformationString = transformations.join(",");

  if (url.includes("res.cloudinary.com/dyakgf0sk/image/upload/")) {
    return url
      .replace("/upload/", `/upload/${transformationString}/`)
      .replace(
        "https://res.cloudinary.com/dyakgf0sk/image/upload/",
        "/assets/",
      );
  }

  if (url.startsWith("/assets/")) {
    return url.replace("/assets/", `/assets/${transformationString}/`);
  }

  return url;
}

export function extractPublicIdFromUrl(url: string): string | null {
  // Validate URL
  if (!url || !url.includes("/upload/")) return null;

  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    // Get all path segments after "upload"
    const pathAfterUpload = parts.slice(uploadIndex + 1);

    // Remove version segment if it exists (example: v123456)
    if (
      pathAfterUpload[0].startsWith("v") &&
      /^\d+$/.test(pathAfterUpload[0].substring(1))
    ) {
      pathAfterUpload.shift();
    }

    // Remove the file extension from the last segment
    const lastPart = pathAfterUpload[pathAfterUpload.length - 1];
    const lastPartWithoutExtension = lastPart.split(".")[0];
    pathAfterUpload[pathAfterUpload.length - 1] = lastPartWithoutExtension;

    // Return the public ID path
    return pathAfterUpload.join("/");
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}
