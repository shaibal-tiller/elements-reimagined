import React, { useRef, useState, useCallback } from "react";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Link,
  Film,
  ChevronUp,
  ChevronDown,
  Trash2,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { FirestoreProject } from "../../../../types/firebase";
import { uploadMedia, validateMedia } from "../../../../services/storageService";
import { getMediaTypeFromFile, isVideo, isEmbedVideo, MEDIA_ACCEPT_STRING } from "../../../../lib/mediaUtils";
import { formatFileSize, formatEta, cleanFileName, uniqueCaption } from "../../utils/formUtils";

type BulkProgressItem = {
  file: string;
  fileSize: number;
  bytesUploaded: number;
  progress: number;
  startedAt: number;
  status: "uploading" | "done" | "error";
};

interface CoverMediaTabProps {
  formData: FirestoreProject;
  setFormData: React.Dispatch<React.SetStateAction<FirestoreProject>>;
  updateCoverMedia: (index: number, field: string, value: string) => void;
  removeCoverMedia: (index: number) => void;
  moveCoverMedia: (index: number, direction: "up" | "down") => void;
  uploadedKeysRef: React.MutableRefObject<string[]>;
  persistPendingKeys: (keys: string[]) => void;
}

const CoverMediaTab: React.FC<CoverMediaTabProps> = ({
  formData,
  setFormData,
  updateCoverMedia,
  removeCoverMedia,
  moveCoverMedia,
  uploadedKeysRef,
  persistPendingKeys,
}) => {
  const [coverBulkUploading, setCoverBulkUploading] = useState(false);
  const [coverBulkProgress, setCoverBulkProgress] = useState<BulkProgressItem[]>([]);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [coverUrlInput, setCoverUrlInput] = useState("");

  const handleCoverBulkFiles = async (files: FileList | File[]) => {
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

    setCoverBulkUploading(true);
    setCoverBulkProgress(progressItems);

    const skippedCount = fileArray.length - validFiles.length;
    if (skippedCount > 0) {
      toast.warning(`${skippedCount} file${skippedCount > 1 ? "s" : ""} skipped (invalid type or size)`);
    }

    if (validFiles.length === 0) {
      setTimeout(() => { setCoverBulkUploading(false); setCoverBulkProgress([]); }, 2000);
      return;
    }

    let successCount = 0;
    for (const file of validFiles) {
      setCoverBulkProgress((prev) =>
        prev.map((p) =>
          p.file === file.name ? { ...p, startedAt: Date.now() } : p
        )
      );

      try {
        const result = await uploadMedia(
          file,
          `projects/${formData.id}/cover`,
          ({ progress }) => {
            setCoverBulkProgress((prev) =>
              prev.map((p) =>
                p.file === file.name ? { ...p, progress: Math.round(progress), bytesUploaded: (progress / 100) * file.size } : p
              )
            );
          }
        );

        setCoverBulkProgress((prev) =>
          prev.map((p) =>
            p.file === file.name ? { ...p, progress: 100, bytesUploaded: file.size, status: "done" as const } : p
          )
        );

        uploadedKeysRef.current.push(result.path);
        persistPendingKeys(uploadedKeysRef.current);

        const mediaType = getMediaTypeFromFile(file);
        setFormData((prev) => {
          const existingCaptions = (prev.coverMedia || []).map((img) => img.caption);
          const caption = uniqueCaption(cleanFileName(file.name), existingCaptions);
          return {
            ...prev,
            coverMedia: [...(prev.coverMedia || []), { src: result.url, caption, details: "", type: mediaType }],
          };
        });

        successCount++;
      } catch {
        setCoverBulkProgress((prev) =>
          prev.map((p) =>
            p.file === file.name ? { ...p, status: "error" as const } : p
          )
        );
      }
    }

    if (successCount > 0) toast.success(`${successCount} cover file${successCount > 1 ? "s" : ""} uploaded`);
    if (successCount < validFiles.length) toast.error(`${validFiles.length - successCount} upload${validFiles.length - successCount > 1 ? "s" : ""} failed`);

    setTimeout(() => { setCoverBulkUploading(false); setCoverBulkProgress([]); }, 1500);
  };

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
    handleCoverBulkFiles(e.dataTransfer.files);
  }, [formData.id]);

  const handleCoverDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(true);
  }, []);

  const handleCoverDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
  }, []);

  const addCoverUrl = () => {
    const url = coverUrlInput.trim();
    if (!url) return;
    const type: "image" | "video" = /youtube\.com|youtu\.be|drive\.google\.com|\.mp4|\.webm|\.ogg/i.test(url) ? "video" : "image";
    setFormData((prev) => ({
      ...prev,
      coverMedia: [...(prev.coverMedia || []), { src: url, caption: "", details: "", type }],
    }));
    setCoverUrlInput("");
    toast.success("Cover URL added");
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        Cover media appears as the hero background on the project detail page. Multiple items cycle as a 2.5s slideshow with crossfade.
      </p>

      {/* Drop zone */}
      <div
        onClick={() => coverFileInputRef.current?.click()}
        onDragOver={handleCoverDragOver}
        onDragLeave={handleCoverDragLeave}
        onDrop={handleCoverDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
          ${isDraggingCover
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
          }
          ${coverBulkUploading ? "pointer-events-none" : ""}
        `}
      >
        <div className="flex flex-col items-center text-center">
          {coverBulkUploading ? (
            (() => {
              const total = coverBulkProgress.reduce((s, p) => s + p.fileSize, 0);
              const uploaded = coverBulkProgress.reduce((s, p) => s + p.bytesUploaded, 0);
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
            <div className={`p-3 rounded-full mb-3 transition-colors ${isDraggingCover ? "bg-indigo-500/20" : "bg-slate-700"}`}>
              <Upload className={`w-6 h-6 ${isDraggingCover ? "text-indigo-400" : "text-slate-400"}`} />
            </div>
          )}
          <p className="text-sm text-slate-300 font-medium">
            {coverBulkUploading
              ? (() => {
                  const totalBytes = coverBulkProgress.reduce((s, p) => s + p.fileSize, 0);
                  const uploadedBytes = coverBulkProgress.reduce((s, p) => s + p.bytesUploaded, 0);
                  const active = coverBulkProgress.find((p) => p.status === "uploading");
                  const activeElapsed = active ? (Date.now() - active.startedAt) / 1000 : 0;
                  const speed = active && activeElapsed > 0 ? active.bytesUploaded / activeElapsed : 0;
                  return `Uploading... ${formatFileSize(uploadedBytes)} / ${formatFileSize(totalBytes)}${speed > 0 ? ` — ${formatFileSize(speed)}/s` : ""}`;
                })()
              : isDraggingCover
                ? "Drop files here"
                : "Drag & drop cover images or videos, or click to browse"
            }
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Images up to 8MB, Videos (MP4, WebM) up to 64MB
          </p>
        </div>

        {coverBulkProgress.length > 0 && (
          <div className="mt-4 space-y-2">
            {coverBulkProgress.map((item, idx) => {
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
        ref={coverFileInputRef}
        type="file"
        accept={MEDIA_ACCEPT_STRING}
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleCoverBulkFiles(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      {/* URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Paste image/video URL (YouTube, GDrive, direct link)"
            value={coverUrlInput}
            onChange={(e) => setCoverUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCoverUrl())}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={addCoverUrl}
          disabled={!coverUrlInput.trim()}
          className="px-4 py-2.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add URL
        </button>
      </div>

      {/* Cover media list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            Cover Media ({(formData.coverMedia || []).length})
          </label>
        </div>

        {(formData.coverMedia || []).map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden"
          >
            <div className="flex">
              {/* Thumbnail */}
              <div className="w-32 flex-shrink-0 relative">
                {item.src ? (
                  <div className="relative h-full min-h-[80px]">
                    {isVideo(item) ? (
                      <>
                        <video
                          src={isEmbedVideo(item.src) ? undefined : item.src}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.src}
                        alt={item.caption || `Cover ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-full min-h-[80px] flex items-center justify-center bg-slate-800 text-slate-600 text-xs">
                    No media
                  </div>
                )}
              </div>

              {/* Details + actions */}
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-medium text-slate-400">
                    {isVideo(item) ? "Video" : "Image"} {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveCoverMedia(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 hover:bg-slate-600 text-slate-400 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCoverMedia(idx, "down")}
                      disabled={idx === (formData.coverMedia || []).length - 1}
                      className="p-1 hover:bg-slate-600 text-slate-400 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCoverMedia(idx)}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={item.caption}
                  onChange={(e) => updateCoverMedia(idx, "caption", e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm mt-1"
                />
              </div>
            </div>
          </div>
        ))}

        {(formData.coverMedia || []).length === 0 && !coverBulkUploading && (
          <div className="text-center py-8 text-slate-500">
            <Film className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No cover media yet — upload images or videos above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverMediaTab;
