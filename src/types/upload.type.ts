export type SignatureResponse = {
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
    folder: string;
};

export type CloudinaryUploadResult = {
  event?: string;
  info?: {
    secure_url?: string;
    public_id?: string;
    resource_type?: "image" | "video";
  };
};

export type CloudinaryWidget = {
    open: () => void;
};

 declare global {
    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadResult
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export type Media = {
  url: string;
  public_id: string;
  resource_type: "image" | "video";
};