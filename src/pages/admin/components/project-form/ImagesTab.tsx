import React, { useRef, useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  Maximize2,
  X,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { FirestoreProject } from "../../../../types/firebase";
import { uploadMedia, validateMedia } from "../../../../services/storageService";
import { getMediaTypeFromFile, isVideo, MEDIA_ACCEPT_STRING } from "../../../../lib/mediaUtils";
import { formatFileSize, formatEta, cleanFileName, uniqueCaption } from "../../utils/formUtils";
import ImageUploader from "../ImageUploader";

type BulkProgressItem = {
  file: string;
  fileSize: number;
  bytesUploaded: number;
  progress: number;
  startedAt: number;
  status: "uploading" | "done" | "error";
};

interface ImagesTabProps {
  formData: FirestoreProject;
  setFormData: React.Dispatch<React.SetStateAction<FirestoreProject>>;
  addImage: () => void;
  removeImage: (index: number) => void;
  updateImage: (index: number, field: string, value: string) => void;
  reorderImages: (from: number, to: number) => void;
  setLightboxImage: (img: { src: string; index: number } | null) => void;
  uploadedKeysRef: React.MutableRefObject<string[]>;
  persistPendingKeys: (keys: string[]) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({
  formData,
  setFormData,
  addImage,
  removeImage,
  updateImage,
  reorderImages,
  setLightboxImage,
  uploadedKeysRef,
  persistPendingKeys,
}) => {
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<BulkProgressItem[]>([]);
  const [isDraggingBulk, setIsDraggingBulk] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  const handleBulkFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (fileArray.length === 0) return;

    const validFiles: File[] = [];
    const progressItems: BulkProgressItem[] = [];

    const now = Date.now();
    fileArray.forEach((file) => {
      const validation = validateMedia(file);
      progressItems.push({
        file: file.name,
        fileSize: file.size,
        bytesUploaded: 0,
        progress: 0,
        startedAt: now,
        status: validation.valid ? "uploading" : "error",
      });
      if (validation.valid) validFiles.push(file);
    });

    setBulkUploading(true);
    setBulkProgress(progressItems);

    const skippedCount = fileArray.length - validFiles.length;
    if (skippedCount > 0) {
      toast.warning(`${skippedCount} file${skippedCount > 1 ? "s" : ""} skipped (invalid type or size)`);
    }

    if (validFiles.length === 0) {
      setTimeout(() => { setBulkUploading(false); setBulkProgress([]); }, 2000);
      return;
    }

    let successCount = 0;
    for (const file of validFiles) {
      setBulkProgress((prev) =>
        prev.map((p) =>
          p.file === file.name ? { ...p, startedAt: Date.now() } : p
        )
      );

      try {
        const result = await uploadMedia(
          file,
          `projects/${formData.id}`,
          ({ progress }) => {
            setBulkProgress((prev) =>
              prev.map((p) =>
                p.file === file.name ? { ...p, progress: Math.round(progress), bytesUploaded: (progress / 100) * file.size } : p
              )
            );
          }
        );

        setBulkProgress((prev) =>
          prev.map((p) =>
            p.file === file.name ? { ...p, progress: 100, bytesUploaded: file.size, status: "done" as const } : p
          )
        );

        uploadedKeysRef.current.push(result.path);
        persistPendingKeys(uploadedKeysRef.current);

        const mediaType = getMediaTypeFromFile(file);
        setFormData((prev) => {
          const existingCaptions = prev.images.map((img) => img.caption);
          const caption = uniqueCaption(cleanFileName(file.name), existingCaptions);
          return {
            ...prev,
            images: [...prev.images, { src: result.url, caption, details: "", type: mediaType }],
          };
        });

        successCount++;
      } catch {
        setBulkProgress((prev) =>
          prev.map((p) =>
            p.file === file.name ? { ...p, status: "error" as const } : p
          )
        );
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file${successCount > 1 ? "s" : ""} uploaded`);
    }
    if (successCount < validFiles.length) {
      toast.error(`${validFiles.length - successCount} upload${validFiles.length - successCount > 1 ? "s" : ""} failed`);
    }

    setTimeout(() => {
      setBulkUploading(false);
      setBulkProgress([]);
    }, 1500);
  };

  const handleBulkDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBulk(false);
    handleBulkFiles(e.dataTransfer.files);
  }, [formData.id]);

  const handleBulkDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBulk(true);
  }, []);

  const handleBulkDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBulk(false);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">
          Project Images ({formData.images.length})
        </label>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Single
        </button>
      </div>

      {/* Bulk Upload Drop Zone */}
      <div
        onClick={() => bulkFileInputRef.current?.click()}
        onDragOver={handleBulkDragOver}
        onDragLeave={handleBulkDragLeave}
        onDrop={handleBulkDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
          ${isDraggingBulk
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
          }
          ${bulkUploading ? "pointer-events-none" : ""}
        `}
      >
        <div className="flex flex-col items-center text-center">
          {bulkUploading ? (
            (() => {
              const total = bulkProgress.reduce((s, p) => s + p.fileSize, 0);
              const uploaded = bulkProgress.reduce((s, p) => s + p.bytesUploaded, 0);
              const pct = total > 0 ? Math.round((uploaded / total) * 100) : 0;
              return (
                <div
                  className="p-[3px] rounded-full mb-3"
                  style={{ background: `conic-gradient(#818cf8 ${pct * 3.6}deg, rgba(51,65,85,0.4) ${pct * 3.6}deg)` }}
                >
                  <div className="p-3 rounded-full bg-slate-800">
                    <Upload className="w-6 h-6 text-indigo-400 animate-bounce" />
                  </div>
                </div>
              );
            })()
          ) : (
            <div className={`p-3 rounded-full mb-3 transition-colors ${isDraggingBulk ? "bg-indigo-500/20" : "bg-slate-700"}`}>
              <Upload className={`w-6 h-6 ${isDraggingBulk ? "text-indigo-400" : "text-slate-400"}`} />
            </div>
          )}
          <p className="text-sm text-slate-300 font-medium">
            {bulkUploading
              ? (() => {
                  const totalBytes = bulkProgress.reduce((s, p) => s + p.fileSize, 0);
                  const uploadedBytes = bulkProgress.reduce((s, p) => s + p.bytesUploaded, 0);
                  const active = bulkProgress.find((p) => p.status === "uploading");
                  const activeElapsed = active ? (Date.now() - active.startedAt) / 1000 : 0;
                  const speed = active && activeElapsed > 0 ? active.bytesUploaded / activeElapsed : 0;
                  return `Uploading... ${formatFileSize(uploadedBytes)} / ${formatFileSize(totalBytes)}${speed > 0 ? ` — ${formatFileSize(speed)}/s` : ""}`;
                })()
              : isDraggingBulk
                ? "Drop files here"
                : "Drag & drop images or videos, or click to browse"
            }
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Images up to 8MB, Videos (MP4, WebM) up to 64MB
          </p>
        </div>

        {/* Bulk Upload Progress */}
        {bulkProgress.length > 0 && (
          <div className="mt-4 space-y-2">
            {bulkProgress.map((item, idx) => {
              const elapsed = (Date.now() - item.startedAt) / 1000;
              const speed = elapsed > 0 && item.status === "uploading" ? item.bytesUploaded / elapsed : 0;
              const eta = speed > 0 ? (item.fileSize - item.bytesUploaded) / speed : 0;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 truncate">{item.file}</span>
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2 flex items-center gap-2">
                        {item.status === "done" ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        ) : item.status === "error" ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <>
                            <span>{formatFileSize(item.bytesUploaded)} / {formatFileSize(item.fileSize)}</span>
                            {speed > 0 && <span>{formatFileSize(speed)}/s</span>}
                            {eta > 0 && <span>{formatEta(eta)}</span>}
                            <span>{item.progress}%</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          item.status === "error" ? "bg-red-500" : item.status === "done" ? "bg-green-500" : "bg-indigo-500"
                        }`}
                        style={{ width: `${item.status === "error" ? 100 : item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <input
        ref={bulkFileInputRef}
        type="file"
        accept={MEDIA_ACCEPT_STRING}
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleBulkFiles(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      {/* Image List */}
      <div className="space-y-1">
        {formData.images.map((image, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={(e) => { e.preventDefault(); if (dragIdx !== null) reorderImages(dragIdx, idx); setDragIdx(null); setDragOverIdx(null); }}
            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
            className={`bg-slate-700/30 rounded-xl border overflow-hidden transition-all ${
              dragOverIdx === idx && dragIdx !== idx
                ? "border-indigo-400 bg-indigo-500/5"
                : dragIdx === idx
                  ? "border-slate-500 opacity-50"
                  : "border-slate-600"
            }`}
          >
            <div className="flex">
              {/* Drag Handle */}
              <div className="flex items-center px-1.5 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Media Preview / Upload */}
              <div className="w-44 flex-shrink-0">
                {image.src ? (
                  <div className="relative h-full min-h-[120px] group/thumb">
                    {isVideo(image) ? (
                      <video
                        src={image.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={image.src}
                        alt={image.caption || `Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setLightboxImage({ src: image.src, index: idx })}
                      className="absolute top-2 left-2 p-1 bg-slate-900/80 hover:bg-slate-800 text-white rounded transition-all opacity-0 group-hover/thumb:opacity-100"
                      title="View full size"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateImage(idx, "src", "")}
                      className="absolute top-2 right-2 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded transition-colors opacity-0 group-hover/thumb:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <ImageUploader
                    folder={`projects/${formData.id}`}
                    onImageUploaded={(url) => updateImage(idx, "src", url)}
                    label=""
                    className="h-full min-h-[120px] p-2"
                  />
                )}
              </div>

              {/* Image Details */}
              <div className="flex-1 p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-400">
                    {isVideo(image) ? "Video" : "Image"} {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="File name / caption"
                  value={image.caption}
                  onChange={(e) => updateImage(idx, "caption", e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <textarea
                  placeholder="Details about this image..."
                  value={image.details}
                  onChange={(e) => updateImage(idx, "details", e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        {formData.images.length === 0 && !bulkUploading && (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No images yet — use the drop zone above to add multiple images at once</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesTab;
