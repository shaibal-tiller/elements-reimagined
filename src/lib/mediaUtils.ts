import { FirestoreProjectImage, ProjectImage } from "../types/firebase";

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)(\?|$)/i;
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/;
const GDRIVE_VIDEO_REGEX = /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
export const ACCEPTED_MEDIA_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

export const MAX_IMAGE_SIZE_MB = 8;
export const MAX_VIDEO_SIZE_MB = 64;

export const MEDIA_ACCEPT_STRING = "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg,video/quicktime";

/** Check if a media item is a video (explicit type field, URL pattern, or embed URL). */
export function isVideo(item: FirestoreProjectImage | ProjectImage): boolean {
  if (item.type === "video") return true;
  if (item.type === "image") return false;
  // Fallback: sniff URL
  const url = item.src;
  if (VIDEO_EXTENSIONS.test(url)) return true;
  if (YOUTUBE_REGEX.test(url)) return true;
  if (GDRIVE_VIDEO_REGEX.test(url)) return true;
  return false;
}

/** Determine media type from a File object. */
export function getMediaTypeFromFile(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

/** Check if a URL is a YouTube video and return an embed URL. */
export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

/** Check if a URL is a Google Drive video and return a preview/embed URL. */
export function getGDriveEmbedUrl(url: string): string | null {
  const match = url.match(GDRIVE_VIDEO_REGEX);
  if (!match) return null;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

/** Returns true if the URL is an external embed (YouTube/GDrive) rather than a direct file. */
export function isEmbedVideo(url: string): boolean {
  return YOUTUBE_REGEX.test(url) || GDRIVE_VIDEO_REGEX.test(url);
}

/** Get the appropriate embed URL for external videos, or null if it's a direct file. */
export function getEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url) || getGDriveEmbedUrl(url);
}
