import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "../lib/firebase/config";

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
 * Upload an image to Firebase Storage
 * @param file The file to upload
 * @param folder The folder path in storage (e.g., "projects/project-id")
 * @param onProgress Callback for upload progress
 * @returns Promise with the download URL and storage path
 */
export const uploadImage = async (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  if (!storage) {
    throw new Error("Firebase Storage is not configured");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${folder}/${timestamp}-${sanitizedName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({
          progress,
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
        });
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Delete an image from Firebase Storage
 * @param path The storage path of the image to delete
 */
export const deleteImage = async (path: string): Promise<void> => {
  if (!storage) {
    throw new Error("Firebase Storage is not configured");
  }

  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

/**
 * Delete an image by its URL
 * Extracts the path from the download URL and deletes the file
 */
export const deleteImageByUrl = async (url: string): Promise<void> => {
  if (!storage) {
    throw new Error("Firebase Storage is not configured");
  }

  try {
    // Extract the path from the URL
    // Firebase Storage URLs contain the path after /o/ and before ?
    const match = url.match(/\/o\/(.+?)\?/);
    if (match) {
      const path = decodeURIComponent(match[1]);
      await deleteImage(path);
    }
  } catch (error) {
    console.error("Error deleting image by URL:", error);
    throw error;
  }
};

/**
 * Validate file type and size
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @param allowedTypes Array of allowed MIME types
 */
export const validateImage = (
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/gif", "image/webp"]
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted types: ${allowedTypes.join(", ")}`,
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
};
