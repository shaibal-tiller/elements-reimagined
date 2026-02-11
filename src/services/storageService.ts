import { uploadFiles } from "../lib/uploadthing";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
} from "../lib/mediaUtils";

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Extract project ID from folder path (e.g., "projects/my-project" -> "my-project")
 */
const getProjectId = (folder: string): string => {
  const parts = folder.split("/");
  return parts[parts.length - 1] || "unknown";
};

/**
 * Upload a single image via UploadThing
 */
export const uploadImage = async (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  const res = await uploadFiles("projectImage", {
    files: [file],
    input: { projectId: getProjectId(folder) },
    onUploadProgress: ({ progress }: { progress: number }) => {
      onProgress?.({
        progress,
        bytesTransferred: Math.round((progress / 100) * file.size),
        totalBytes: file.size,
      });
    },
  });

  if (!res || res.length === 0) {
    throw new Error("Upload failed");
  }

  return { url: res[0].url, path: res[0].key };
};

/**
 * Upload multiple images at once via UploadThing (more efficient than individual uploads)
 */
export const uploadMultipleImages = async (
  files: File[],
  folder: string,
  onFileProgress?: (fileIndex: number, progress: number) => void
): Promise<UploadResult[]> => {
  const fileNames = files.map((f) => f.name);

  const res = await uploadFiles("projectImage", {
    files,
    input: { projectId: getProjectId(folder) },
    onUploadProgress: ({ file, progress }: { file: string; progress: number }) => {
      const idx = fileNames.indexOf(file);
      if (idx !== -1) {
        onFileProgress?.(idx, progress);
      }
    },
  });

  if (!res) {
    throw new Error("Upload failed");
  }

  return res.map((r: { url: string; key: string }) => ({ url: r.url, path: r.key }));
};

/**
 * Validate file type and size
 */
export const validateImage = (
  file: File,
  maxSizeMB: number = 8,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/gif", "image/webp"]
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File exceeds ${maxSizeMB}MB limit` };
  }

  return { valid: true };
};

/**
 * Upload a single video via UploadThing
 */
export const uploadVideo = async (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  const res = await uploadFiles("projectVideo", {
    files: [file],
    input: { projectId: getProjectId(folder) },
    onUploadProgress: ({ progress }: { progress: number }) => {
      onProgress?.({
        progress,
        bytesTransferred: Math.round((progress / 100) * file.size),
        totalBytes: file.size,
      });
    },
  });

  if (!res || res.length === 0) {
    throw new Error("Upload failed");
  }

  return { url: res[0].url, path: res[0].key };
};

/**
 * Validate any media file (image or video) with appropriate limits
 */
export const validateMedia = (
  file: File
): { valid: boolean; error?: string } => {
  const isVideoFile = file.type.startsWith("video/");

  if (isVideoFile) {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Video type not allowed. Accepted: ${ACCEPTED_VIDEO_TYPES.join(", ")}`,
      };
    }
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return { valid: false, error: `Video exceeds ${MAX_VIDEO_SIZE_MB}MB limit` };
    }
  } else {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Accepted: ${ACCEPTED_IMAGE_TYPES.join(", ")}`,
      };
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return { valid: false, error: `Image exceeds ${MAX_IMAGE_SIZE_MB}MB limit` };
    }
  }

  return { valid: true };
};

/**
 * Upload any media file — auto-picks image or video route based on file type
 */
export const uploadMedia = async (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  if (file.type.startsWith("video/")) {
    return uploadVideo(file, folder, onProgress);
  }
  return uploadImage(file, folder, onProgress);
};

/**
 * Delete uploaded files by their keys (calls server-side UTApi)
 */
export const deleteFilesByKeys = async (keys: string[]): Promise<void> => {
  if (keys.length === 0) return;
  try {
    await fetch("/api/delete-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    });
  } catch {
    // Silent fail — orphaned files can be cleaned from UploadThing dashboard
  }
};
