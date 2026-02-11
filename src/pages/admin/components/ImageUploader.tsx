import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { uploadMedia, validateMedia, UploadProgress } from "../../../services/storageService";
import { MEDIA_ACCEPT_STRING } from "../../../lib/mediaUtils";

interface ImageUploaderProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  folder: string;
  label?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUploaded,
  onImageRemoved,
  folder,
  label = "Upload Image",
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isVideoPreview, setIsVideoPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateMedia(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    // Create local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsVideoPreview(file.type.startsWith("video/"));

    // Upload via UploadThing
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadMedia(file, folder, (progress: UploadProgress) => {
        setUploadProgress(Math.round(progress.progress));
      });

      // Clean up local preview and use the uploaded URL
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(result.url);
      onImageUploaded(result.url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [folder, onImageUploaded, currentImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setIsVideoPreview(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemoved?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative mb-3 rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
          {isVideoPreview ? (
            <video
              src={previewUrl}
              muted
              playsInline
              preload="metadata"
              className="w-full h-48 object-cover"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <span className="text-white text-sm font-medium">{uploadProgress}%</span>
              <div className="w-32 h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!previewUrl && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
            ${isDragging
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/50"
            }
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`
              p-3 rounded-full mb-3 transition-colors
              ${isDragging ? "bg-indigo-500/20" : "bg-slate-700"}
            `}>
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              ) : (
                <Upload className={`w-6 h-6 ${isDragging ? "text-indigo-400" : "text-slate-400"}`} />
              )}
            </div>

            {isUploading ? (
              <>
                <p className="text-sm text-slate-300 font-medium">Uploading...</p>
                <p className="text-xs text-slate-500 mt-1">{uploadProgress}% complete</p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-300 font-medium">
                  {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Images up to 8MB, Videos up to 64MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={MEDIA_ACCEPT_STRING}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL Input Alternative */}
      {!previewUrl && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <div className="flex-1 h-px bg-slate-700" />
            <span>or enter URL</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const url = (e.target as HTMLInputElement).value.trim();
                  if (url) {
                    setPreviewUrl(url);
                    onImageUploaded(url);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                const url = input.value.trim();
                if (url) {
                  setPreviewUrl(url);
                  onImageUploaded(url);
                  input.value = "";
                }
              }}
              className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
