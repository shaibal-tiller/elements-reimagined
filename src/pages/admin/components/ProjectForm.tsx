import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
  ChevronRight,
  Palette,
  Info,
  Layers,
  Image as ImageIcon,
  Zap,
  Award,
  Code2,
  AlertTriangle,
  Upload,
  CheckCircle,
  AlertCircle,
  Maximize2,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Film,
  ChevronUp,
  ChevronDown,
  Link,
  Play,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { FirestoreProject } from "../../../types/firebase";
import { iconRegistry } from "../../../lib/iconRegistry";
import { uploadMedia, validateMedia, deleteFilesByKeys } from "../../../services/storageService";
import { getMediaTypeFromFile, isVideo, isEmbedVideo, MEDIA_ACCEPT_STRING } from "../../../lib/mediaUtils";
import ConfirmModal from "../../../components/ui/confirm-modal";
import ImageUploader from "./ImageUploader";
import ProjectCardPreview from "./ProjectCardPreview";
import {
  TW_COLORS,
  TW_COLOR_NAMES,
  TW_SHADES,
  parseTwColor,
  buildTwClass,
  hexFromBgMain,
  bgMainFromHex,
  resolveThemeStyles,
  resolveTechPillStyles,
} from "../../../lib/twColors";

interface ProjectFormProps {
  project?: FirestoreProject | null;
  onSave: (project: FirestoreProject) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const iconNames = Object.keys(iconRegistry);

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatEta = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return "";
  if (seconds < 60) return `~${Math.ceil(seconds)}s`;
  return `~${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
};

const cleanFileName = (name: string): string => {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const uniqueCaption = (base: string, existing: string[]): string => {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base} (${i})`)) i++;
  return `${base} (${i})`;
};

// Predefined theme presets for quick selection
const themePresets = [
  {
    name: "Indigo",
    theme: {
      primary: "indigo",
      secondary: "blue",
      bgMain: "bg-[#1e1b4b]",
      bgGradient: "from-indigo-400 to-blue-400",
      accentBlur: "bg-indigo-500",
      textMain: "#4f46e5",
      pillBg: "bg-indigo-500/10",
      pillBorder: "border-indigo-500/20",
      pillText: "text-indigo-400",
      techFrontendColor: "blue",
      techBackendColor: "green",
      techDevopsColor: "purple",
    },
    color: "#4f46e5",
  },
  {
    name: "Emerald",
    theme: {
      primary: "emerald",
      secondary: "teal",
      bgMain: "bg-[#064e3b]",
      bgGradient: "from-emerald-400 to-teal-400",
      accentBlur: "bg-emerald-500",
      textMain: "#10b981",
      pillBg: "bg-emerald-500/10",
      pillBorder: "border-emerald-500/20",
      pillText: "text-emerald-400",
      techFrontendColor: "blue",
      techBackendColor: "green",
      techDevopsColor: "purple",
    },
    color: "#10b981",
  },
  {
    name: "Amber",
    theme: {
      primary: "amber",
      secondary: "orange",
      bgMain: "bg-[#78350f]",
      bgGradient: "from-amber-400 to-orange-400",
      accentBlur: "bg-amber-500",
      textMain: "#f59e0b",
      pillBg: "bg-amber-500/10",
      pillBorder: "border-amber-500/20",
      pillText: "text-amber-400",
      techFrontendColor: "blue",
      techBackendColor: "green",
      techDevopsColor: "purple",
    },
    color: "#f59e0b",
  },
  {
    name: "Rose",
    theme: {
      primary: "rose",
      secondary: "pink",
      bgMain: "bg-[#881337]",
      bgGradient: "from-rose-400 to-pink-400",
      accentBlur: "bg-rose-500",
      textMain: "#f43f5e",
      pillBg: "bg-rose-500/10",
      pillBorder: "border-rose-500/20",
      pillText: "text-rose-400",
      techFrontendColor: "blue",
      techBackendColor: "green",
      techDevopsColor: "purple",
    },
    color: "#f43f5e",
  },
  {
    name: "Cyan",
    theme: {
      primary: "cyan",
      secondary: "sky",
      bgMain: "bg-[#164e63]",
      bgGradient: "from-cyan-400 to-sky-400",
      accentBlur: "bg-cyan-500",
      textMain: "#06b6d4",
      pillBg: "bg-cyan-500/10",
      pillBorder: "border-cyan-500/20",
      pillText: "text-cyan-400",
      techFrontendColor: "blue",
      techBackendColor: "green",
      techDevopsColor: "purple",
    },
    color: "#06b6d4",
  },
  {
    name: "Purple",
    theme: {
      primary: "purple",
      secondary: "violet",
      bgMain: "bg-[#581c87]",
      bgGradient: "from-purple-400 to-violet-400",
      accentBlur: "bg-purple-500",
      textMain: "#a855f7",
      pillBg: "bg-purple-500/10",
      pillBorder: "border-purple-500/20",
      pillText: "text-purple-400",
      techFrontendColor: "blue",
      techBackendColor: "green",
      techDevopsColor: "purple",
    },
    color: "#a855f7",
  },
];

const emptyProject: FirestoreProject = {
  id: "",
  title: "",
  subtitle: "",
  category: "",
  year: "",
  company: "",
  bannerIconName: "Code2",
  theme: themePresets[0].theme,
  headerInfo: [],
  overview: "",
  features: [],
  images: [],
  contributions: [],
  techStack: { frontend: [], backend: [], devops: [] },
  marqueeIconNames: [],
  challenge: { title: "", desc: "" },
  coverMedia: [],
  order: 0,
};

type TabId = "basic" | "cover" | "theme" | "content" | "images" | "features" | "tech";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "Basic Info", icon: Info },
  { id: "cover", label: "Cover", icon: Film },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "content", label: "Content", icon: Layers },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "features", label: "Features", icon: Zap },
  { id: "tech", label: "Tech Stack", icon: Code2 },
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<FirestoreProject>(emptyProject);
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  // Resizable preview panel
  const MIN_PANEL = 260;
  const MAX_PANEL = 560;
  const DEFAULT_PANEL = 360;
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_PANEL);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = startXRef.current - ev.clientX; // dragging left = wider panel
      const newWidth = Math.min(MAX_PANEL, Math.max(MIN_PANEL, startWidthRef.current + delta));
      setPanelWidth(newWidth);
      setIsCollapsed(false);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [panelWidth]);

  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "danger" | "warning";
  } | null>(null);

  // Fullscreen preview
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "laptop" | "tv">("laptop");

  // Dirty tracking — snapshot initial form data to compare
  const initialDataRef = useRef<string>("");
  const isDirty = useMemo(
    () => initialDataRef.current !== "" && initialDataRef.current !== JSON.stringify(formData),
    [formData]
  );

  // Keys of images deleted during this edit session — cleaned up on save
  const deletedKeysRef = useRef<string[]>([]);

  // Track uploaded file keys for cleanup on cancel or tab close
  const uploadedKeysRef = useRef<string[]>([]);
  const PENDING_KEYS_STORAGE = "ut_pending_keys";

  // On mount: clean up any orphaned files from a previous crashed session
  useEffect(() => {
    const stale = localStorage.getItem(PENDING_KEYS_STORAGE);
    if (stale) {
      try {
        const keys = JSON.parse(stale) as string[];
        if (keys.length > 0) deleteFilesByKeys(keys);
      } catch { /* ignore */ }
      localStorage.removeItem(PENDING_KEYS_STORAGE);
    }
  }, []);

  // Sync pending keys to localStorage so tab close can be recovered
  const persistPendingKeys = (keys: string[]) => {
    if (keys.length > 0) {
      localStorage.setItem(PENDING_KEYS_STORAGE, JSON.stringify(keys));
    } else {
      localStorage.removeItem(PENDING_KEYS_STORAGE);
    }
  };

  useEffect(() => {
    if (project) {
      setFormData(project);
      initialDataRef.current = JSON.stringify(project);
    } else {
      const fresh = { ...emptyProject, id: `project-${Date.now()}` };
      setFormData(fresh);
      initialDataRef.current = JSON.stringify(fresh);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear tracked keys on successful save — files are no longer orphaned
    uploadedKeysRef.current = [];
    persistPendingKeys([]);
    // Delete files that were removed from the form during this session
    if (deletedKeysRef.current.length > 0) {
      deleteFilesByKeys(deletedKeysRef.current);
      deletedKeysRef.current = [];
    }
    await onSave(formData);
  };

  const doCancel = () => {
    // Delete any uploaded files that weren't saved
    if (uploadedKeysRef.current.length > 0) {
      deleteFilesByKeys(uploadedKeysRef.current);
      uploadedKeysRef.current = [];
      persistPendingKeys([]);
      toast.info("Unsaved uploads cleaned up");
    }
    // Don't delete removed-image keys — user cancelled, so changes are discarded
    deletedKeysRef.current = [];
    onCancel();
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmAction({
        title: "Discard changes?",
        description: "You have unsaved changes. Are you sure you want to close? All changes will be lost.",
        variant: "warning",
        onConfirm: doCancel,
      });
    } else {
      doCancel();
    }
  };

  const updateField = (field: keyof FirestoreProject, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTheme = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }));
  };

  const applyThemePreset = (preset: typeof themePresets[0]) => {
    setFormData((prev) => ({
      ...prev,
      theme: preset.theme,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", desc: "", iconName: "Code2" }],
    }));
  };

  const removeFeature = (index: number) => {
    const feature = formData.features[index];
    setConfirmAction({
      title: "Remove feature?",
      description: `Remove "${feature?.title || `Feature ${index + 1}`}"? This won't be saved until you click Save.`,
      variant: "danger",
      onConfirm: () =>
        setFormData((prev) => ({
          ...prev,
          features: prev.features.filter((_, i) => i !== index),
        })),
    });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      ),
    }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { src: "", caption: "", details: "" }],
    }));
  };

  const removeImage = (index: number) => {
    const image = formData.images[index];
    setConfirmAction({
      title: "Remove media?",
      description: `Remove "${image?.caption || `Item ${index + 1}`}"? The file will be deleted when you save.`,
      variant: "danger",
      onConfirm: () => {
        // Track the UploadThing key for deletion on save
        const key = uploadedKeysRef.current.find((k) => image?.src?.includes(k));
        if (key) {
          deletedKeysRef.current.push(key);
          uploadedKeysRef.current = uploadedKeysRef.current.filter((k2) => k2 !== key);
          persistPendingKeys(uploadedKeysRef.current);
        }
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      },
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  };

  const reorderImages = (from: number, to: number) => {
    if (from === to) return;
    setFormData((prev) => {
      const arr = [...prev.images];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...prev, images: arr };
    });
  };

  // Bulk image upload state
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ file: string; fileSize: number; bytesUploaded: number; progress: number; startedAt: number; status: "uploading" | "done" | "error" }[]>([]);
  const [isDraggingBulk, setIsDraggingBulk] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  const handleBulkFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (fileArray.length === 0) return;

    // Validate all files first
    const validFiles: File[] = [];
    const progressItems: typeof bulkProgress = [];

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

    // Upload files sequentially so each shows real progress
    let successCount = 0;
    for (const file of validFiles) {
      // Reset startedAt for each file when it actually begins uploading
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

        // Mark this file as done
        setBulkProgress((prev) =>
          prev.map((p) =>
            p.file === file.name ? { ...p, progress: 100, bytesUploaded: file.size, status: "done" as const } : p
          )
        );

        // Track key for cleanup if form is cancelled
        uploadedKeysRef.current.push(result.path);
        persistPendingKeys(uploadedKeysRef.current);

        // Add uploaded media to form immediately with pre-filled caption
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

  const addContribution = () => {
    setFormData((prev) => ({
      ...prev,
      contributions: [...prev.contributions, { title: "", desc: "" }],
    }));
  };

  const removeContribution = (index: number) => {
    const contrib = formData.contributions[index];
    setConfirmAction({
      title: "Remove contribution?",
      description: `Remove "${contrib?.title || `Contribution ${index + 1}`}"?`,
      variant: "danger",
      onConfirm: () =>
        setFormData((prev) => ({
          ...prev,
          contributions: prev.contributions.filter((_, i) => i !== index),
        })),
    });
  };

  const updateContribution = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contributions: prev.contributions.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addHeaderInfo = () => {
    setFormData((prev) => ({
      ...prev,
      headerInfo: [...prev.headerInfo, { label: "", text: "", iconName: "Code2" }],
    }));
  };

  const removeHeaderInfo = (index: number) => {
    const info = formData.headerInfo[index];
    setConfirmAction({
      title: "Remove header info?",
      description: `Remove "${info?.label || `Item ${index + 1}`}"?`,
      variant: "danger",
      onConfirm: () =>
        setFormData((prev) => ({
          ...prev,
          headerInfo: prev.headerInfo.filter((_, i) => i !== index),
        })),
    });
  };

  const updateHeaderInfo = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      headerInfo: prev.headerInfo.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  const updateTechStack = (category: "frontend" | "backend" | "devops", value: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: value.split(",").map((s) => s.trim()).filter(Boolean),
      },
    }));
  };

  // --- Cover media helpers ---
  const addCoverMedia = () => {
    setFormData((prev) => ({
      ...prev,
      coverMedia: [...(prev.coverMedia || []), { src: "", caption: "", details: "" }],
    }));
  };

  const removeCoverMedia = (index: number) => {
    const item = (formData.coverMedia || [])[index];
    setConfirmAction({
      title: "Remove cover media?",
      description: `Remove "${item?.caption || `Cover ${index + 1}`}"? The file will be deleted when you save.`,
      variant: "danger",
      onConfirm: () => {
        const key = uploadedKeysRef.current.find((k) => item?.src?.includes(k));
        if (key) {
          deletedKeysRef.current.push(key);
          uploadedKeysRef.current = uploadedKeysRef.current.filter((k2) => k2 !== key);
          persistPendingKeys(uploadedKeysRef.current);
        }
        setFormData((prev) => ({
          ...prev,
          coverMedia: (prev.coverMedia || []).filter((_, i) => i !== index),
        }));
      },
    });
  };

  const updateCoverMedia = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      coverMedia: (prev.coverMedia || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const moveCoverMedia = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const arr = [...(prev.coverMedia || [])];
      const swapIdx = direction === "up" ? index - 1 : index + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]];
      return { ...prev, coverMedia: arr };
    });
  };

  // Cover bulk upload state
  const [coverBulkUploading, setCoverBulkUploading] = useState(false);
  const [coverBulkProgress, setCoverBulkProgress] = useState<{ file: string; fileSize: number; bytesUploaded: number; progress: number; startedAt: number; status: "uploading" | "done" | "error" }[]>([]);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [coverUrlInput, setCoverUrlInput] = useState("");

  const handleCoverBulkFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (fileArray.length === 0) return;

    const validFiles: File[] = [];
    const progressItems: typeof coverBulkProgress = [];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Project ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => updateField("id", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                  placeholder="my-project"
                />
                <p className="text-xs text-slate-500 mt-1">URL-friendly identifier</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => updateField("order", parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <p className="text-xs text-slate-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
                placeholder="Project Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Brief description shown on card"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Web App"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Banner Icon
              </label>
              <div className="flex gap-3">
                <select
                  value={formData.bannerIconName}
                  onChange={(e) => updateField("bannerIconName", e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  {iconNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                  {React.createElement(iconRegistry[formData.bannerIconName] || Code2, {
                    className: "w-6 h-6 text-slate-300",
                  })}
                </div>
              </div>
            </div>

            {/* Header Info */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-300">
                  Header Info
                </label>
                <button
                  type="button"
                  onClick={addHeaderInfo}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.headerInfo.map((info, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      value={info.label}
                      onChange={(e) => updateHeaderInfo(idx, "label", e.target.value)}
                      className="w-24 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={info.text}
                      onChange={(e) => updateHeaderInfo(idx, "text", e.target.value)}
                      className="flex-1 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                    />
                    <select
                      value={info.iconName}
                      onChange={(e) => updateHeaderInfo(idx, "iconName", e.target.value)}
                      className="w-28 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                    >
                      {iconNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeHeaderInfo(idx)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.headerInfo.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No header info added yet</p>
                )}
              </div>
            </div>
          </div>
        );

      case "cover":
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

      case "theme": {
        const gradientParsed = {
          from: parseTwColor(formData.theme.bgGradient.split(" ")[0] || "from-indigo-400"),
          to: parseTwColor(formData.theme.bgGradient.split(" ")[1] || "to-blue-400"),
        };
        const accentParsed = parseTwColor(formData.theme.accentBlur);
        const pillBgParsed = parseTwColor(formData.theme.pillBg);
        const pillBorderParsed = parseTwColor(formData.theme.pillBorder);
        const pillTextParsed = parseTwColor(formData.theme.pillText);

        // Shared accent color (most accent fields use the same color name)
        const sharedAccentColor = accentParsed.color || "indigo";

        const updateAccentColor = (color: string) => {
          const aShade = accentParsed.shade || "500";
          const pbShade = pillBgParsed.shade || "500";
          const pbOpacity = pillBgParsed.opacity || "10";
          const pbrShade = pillBorderParsed.shade || "500";
          const pbrOpacity = pillBorderParsed.opacity || "20";
          const ptShade = pillTextParsed.shade || "400";
          updateTheme("accentBlur", buildTwClass("bg-", color, aShade));
          updateTheme("pillBg", buildTwClass("bg-", color, pbShade, pbOpacity));
          updateTheme("pillBorder", buildTwClass("border-", color, pbrShade, pbrOpacity));
          updateTheme("pillText", buildTwClass("text-", color, ptShade));
        };

        return (
          <div className="space-y-6">
            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Quick Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themePresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyThemePreset(preset)}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all
                      ${formData.theme.primary === preset.theme.primary && formData.theme.secondary === preset.theme.secondary
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-600 hover:border-slate-500 bg-slate-700/30"
                      }
                    `}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm text-slate-300">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Identity */}
            <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
              <label className="block text-sm font-medium text-slate-300 mb-3">Color Identity</label>
              {(["primary", "secondary"] as const).map((field) => (
                <div key={field} className="mb-3 last:mb-0">
                  <label className="block text-xs font-medium text-slate-400 mb-2 capitalize">{field}</label>
                  <div className="flex flex-wrap gap-2">
                    {TW_COLOR_NAMES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => updateTheme(field, name)}
                        title={name}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          formData.theme[field] === name
                            ? "border-white scale-110 ring-2 ring-white/30"
                            : "border-transparent hover:border-slate-400"
                        }`}
                        style={{ backgroundColor: TW_COLORS[name]?.[500] || "#888" }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">{formData.theme[field]}</span>
                </div>
              ))}
            </div>

            {/* Backgrounds */}
            <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
              <label className="block text-sm font-medium text-slate-300 mb-3">Backgrounds</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Banner Background</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={hexFromBgMain(formData.theme.bgMain)}
                      onChange={(e) => updateTheme("bgMain", bgMainFromHex(e.target.value))}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-600 bg-transparent"
                    />
                    <span className="text-xs text-slate-400 font-mono">{hexFromBgMain(formData.theme.bgMain)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Accent Text Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.theme.textMain}
                      onChange={(e) => updateTheme("textMain", e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-600 bg-transparent"
                    />
                    <span className="text-xs text-slate-400 font-mono">{formData.theme.textMain}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient */}
            <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
              <label className="block text-sm font-medium text-slate-300 mb-3">Gradient</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                {(["from", "to"] as const).map((dir) => {
                  const parsed = gradientParsed[dir];
                  const prefix = dir === "from" ? "from-" : "to-";
                  return (
                    <div key={dir}>
                      <label className="block text-xs font-medium text-slate-400 mb-2 capitalize">{dir}</label>
                      <div className="flex gap-2">
                        <select
                          value={parsed.color}
                          onChange={(e) => {
                            const other = dir === "from" ? formData.theme.bgGradient.split(" ")[1] : formData.theme.bgGradient.split(" ")[0];
                            const built = buildTwClass(prefix, e.target.value, parsed.shade || "400");
                            updateTheme("bgGradient", dir === "from" ? `${built} ${other}` : `${other} ${built}`);
                          }}
                          className="flex-1 px-2 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-xs"
                        >
                          {TW_COLOR_NAMES.map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                        <select
                          value={parsed.shade || "400"}
                          onChange={(e) => {
                            const other = dir === "from" ? formData.theme.bgGradient.split(" ")[1] : formData.theme.bgGradient.split(" ")[0];
                            const built = buildTwClass(prefix, parsed.color, e.target.value);
                            updateTheme("bgGradient", dir === "from" ? `${built} ${other}` : `${other} ${built}`);
                          }}
                          className="w-16 px-2 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-xs"
                        >
                          {TW_SHADES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Gradient preview bar */}
              <div
                className="h-6 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${TW_COLORS[gradientParsed.from.color]?.[Number(gradientParsed.from.shade) || 400] || "#818cf8"}, ${TW_COLORS[gradientParsed.to.color]?.[Number(gradientParsed.to.shade) || 400] || "#60a5fa"})`,
                }}
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">{formData.theme.bgGradient}</span>
            </div>

            {/* Accent & Pills */}
            <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
              <label className="block text-sm font-medium text-slate-300 mb-3">Accent &amp; Pills</label>

              {/* Shared color selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">Shared Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {TW_COLOR_NAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => updateAccentColor(name)}
                      title={name}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        sharedAccentColor === name
                          ? "border-white scale-110 ring-2 ring-white/30"
                          : "border-transparent hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: TW_COLORS[name]?.[500] || "#888" }}
                    />
                  ))}
                </div>
              </div>

              {/* Individual controls */}
              <div className="space-y-3">
                {/* Accent Blur */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Accent Blur</label>
                  <div className="flex gap-1">
                    {TW_SHADES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateTheme("accentBlur", buildTwClass("bg-", accentParsed.color || sharedAccentColor, s))}
                        className={`px-2 py-1 text-[10px] rounded transition-all ${
                          String(accentParsed.shade) === String(s)
                            ? "bg-white/20 text-white font-bold"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.accentBlur}</span>
                </div>

                {/* Pill Background */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Pill BG</label>
                  <div className="flex gap-1">
                    {TW_SHADES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateTheme("pillBg", buildTwClass("bg-", pillBgParsed.color || sharedAccentColor, s, pillBgParsed.opacity || "10"))}
                        className={`px-2 py-1 text-[10px] rounded transition-all ${
                          String(pillBgParsed.shade) === String(s)
                            ? "bg-white/20 text-white font-bold"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={Number(pillBgParsed.opacity) || 10}
                      onChange={(e) => updateTheme("pillBg", buildTwClass("bg-", pillBgParsed.color || sharedAccentColor, pillBgParsed.shade || "500", e.target.value))}
                      className="w-20 accent-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 w-6">{pillBgParsed.opacity || "10"}%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.pillBg}</span>
                </div>

                {/* Pill Border */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Pill Border</label>
                  <div className="flex gap-1">
                    {TW_SHADES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateTheme("pillBorder", buildTwClass("border-", pillBorderParsed.color || sharedAccentColor, s, pillBorderParsed.opacity || "20"))}
                        className={`px-2 py-1 text-[10px] rounded transition-all ${
                          String(pillBorderParsed.shade) === String(s)
                            ? "bg-white/20 text-white font-bold"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={Number(pillBorderParsed.opacity) || 20}
                      onChange={(e) => updateTheme("pillBorder", buildTwClass("border-", pillBorderParsed.color || sharedAccentColor, pillBorderParsed.shade || "500", e.target.value))}
                      className="w-20 accent-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 w-6">{pillBorderParsed.opacity || "20"}%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.pillBorder}</span>
                </div>

                {/* Pill Text */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Pill Text</label>
                  <div className="flex gap-1">
                    {TW_SHADES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateTheme("pillText", buildTwClass("text-", pillTextParsed.color || sharedAccentColor, s))}
                        className={`px-2 py-1 text-[10px] rounded transition-all ${
                          String(pillTextParsed.shade) === String(s)
                            ? "bg-white/20 text-white font-bold"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.pillText}</span>
                </div>
              </div>
            </div>

            {/* Tech Stack Colors */}
            <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
              <label className="block text-sm font-medium text-slate-300 mb-3">Tech Stack Colors</label>
              <p className="text-[10px] text-slate-500 mb-3">Per-category pill hue override. Leave empty to use the shared accent color.</p>
              {([
                { field: "techFrontendColor" as const, label: "Frontend" },
                { field: "techBackendColor" as const, label: "Backend" },
                { field: "techDevopsColor" as const, label: "DevOps" },
              ]).map(({ field, label }) => (
                <div key={field} className="mb-3 last:mb-0">
                  <label className="block text-xs font-medium text-slate-400 mb-2">{label}</label>
                  <div className="flex flex-wrap gap-2">
                    {/* "None" option — clears the override */}
                    <button
                      type="button"
                      onClick={() => updateTheme(field, "")}
                      title="None (use default)"
                      className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center text-[8px] font-bold ${
                        !formData.theme[field]
                          ? "border-white scale-110 ring-2 ring-white/30 text-white"
                          : "border-transparent hover:border-slate-400 text-slate-500"
                      }`}
                      style={{ backgroundColor: "#334155" }}
                    >
                      —
                    </button>
                    {TW_COLOR_NAMES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => updateTheme(field, name)}
                        title={name}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          formData.theme[field] === name
                            ? "border-white scale-110 ring-2 ring-white/30"
                            : "border-transparent hover:border-slate-400"
                        }`}
                        style={{ backgroundColor: TW_COLORS[name]?.[500] || "#888" }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">{formData.theme[field] || "(default)"}</span>
                </div>
              ))}
            </div>

            {/* Theme Preview */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Theme Preview
              </label>
              {(() => {
                const styles = resolveThemeStyles(formData.theme);
                return (
                  <div className="p-4 rounded-xl" style={styles.bgMain}>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="border px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{ ...styles.pillBg, ...styles.pillText, ...styles.pillBorder }}
                      >
                        Category
                      </span>
                    </div>
                    <h4 className="text-white text-lg font-bold mb-1">Sample Title</h4>
                    <p className="text-slate-300 text-sm">Subtitle text here</p>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      }

      case "content":
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Overview
              </label>
              <textarea
                value={formData.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                rows={6}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                placeholder="Detailed description of the project..."
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.overview.length} characters
              </p>
            </div>

            {/* Challenge */}
            <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <label className="text-sm font-medium text-slate-300">
                  Challenge Section
                </label>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Challenge title"
                  value={formData.challenge.title}
                  onChange={(e) =>
                    updateField("challenge", { ...formData.challenge, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <textarea
                  placeholder="Describe the challenge and how you solved it..."
                  value={formData.challenge.desc}
                  onChange={(e) =>
                    updateField("challenge", { ...formData.challenge, desc: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Contributions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <label className="text-sm font-medium text-slate-300">
                    Contributions
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addContribution}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {formData.contributions.map((contrib, idx) => (
                  <div key={idx} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={contrib.title}
                        onChange={(e) => updateContribution(idx, "title", e.target.value)}
                        className="flex-1 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeContribution(idx)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      placeholder="Description"
                      value={contrib.desc}
                      onChange={(e) => updateContribution(idx, "desc", e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm resize-none"
                    />
                  </div>
                ))}
                {formData.contributions.length === 0 && (
                  <p className="text-sm text-slate-500 italic text-center py-4">
                    No contributions added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "images":
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
                            onClick={() => setLightboxSrc(image.src)}
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

      case "features":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Features ({formData.features.length})
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {formData.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700/30 p-4 rounded-xl border border-slate-600"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Feature title"
                        value={feature.title}
                        onChange={(e) => updateFeature(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={feature.iconName}
                        onChange={(e) => updateFeature(idx, "iconName", e.target.value)}
                        className="w-28 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                      >
                        {iconNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                        {React.createElement(iconRegistry[feature.iconName] || Code2, {
                          className: "w-5 h-5 text-slate-300",
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    placeholder="Feature description..."
                    value={feature.desc}
                    onChange={(e) => updateFeature(idx, "desc", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm resize-none"
                  />
                </div>
              ))}

              {formData.features.length === 0 && (
                <div className="text-center py-12 bg-slate-700/20 rounded-xl border-2 border-dashed border-slate-600">
                  <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-2">No features added yet</p>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    Add your first feature
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "tech":
        return (
          <div className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Frontend Technologies
                </label>
                <input
                  type="text"
                  value={formData.techStack.frontend.join(", ")}
                  onChange={(e) => updateTechStack("frontend", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="React, TypeScript, Tailwind CSS"
                />
                <p className="text-xs text-slate-500 mt-1">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Backend Technologies
                </label>
                <input
                  type="text"
                  value={formData.techStack.backend.join(", ")}
                  onChange={(e) => updateTechStack("backend", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Node.js, Express, PostgreSQL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  DevOps / Tools
                </label>
                <input
                  type="text"
                  value={formData.techStack.devops.join(", ")}
                  onChange={(e) => updateTechStack("devops", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Docker, AWS, GitHub Actions"
                />
              </div>
            </div>

            {/* Marquee Icons */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Marquee Icons
              </label>
              <input
                type="text"
                value={formData.marqueeIconNames.join(", ")}
                onChange={(e) =>
                  updateField(
                    "marqueeIconNames",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Code2, Database, Cloud"
              />
              <p className="text-xs text-slate-500 mt-1">
                Icon names for the scrolling marquee (comma-separated)
              </p>
            </div>

            {/* Tech Preview */}
            {(formData.techStack.frontend.length > 0 ||
              formData.techStack.backend.length > 0 ||
              formData.techStack.devops.length > 0) && (
              <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600">
                <label className="block text-sm font-medium text-slate-400 mb-3">
                  Preview
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.frontend.map((tech) => {
                    const s = resolveTechPillStyles(formData.theme, formData.theme.techFrontendColor);
                    return (
                      <span
                        key={`fe-${tech}`}
                        className="px-2.5 py-1 text-xs rounded-md font-medium border"
                        style={s}
                      >
                        {tech}
                      </span>
                    );
                  })}
                  {formData.techStack.backend.map((tech) => {
                    const s = resolveTechPillStyles(formData.theme, formData.theme.techBackendColor);
                    return (
                      <span
                        key={`be-${tech}`}
                        className="px-2.5 py-1 text-xs rounded-md font-medium border"
                        style={s}
                      >
                        {tech}
                      </span>
                    );
                  })}
                  {formData.techStack.devops.map((tech) => {
                    const s = resolveTechPillStyles(formData.theme, formData.theme.techDevopsColor);
                    return (
                      <span
                        key={`do-${tech}`}
                        className="px-2.5 py-1 text-xs rounded-md font-medium border"
                        style={s}
                      >
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
    {/* Confirmation Modal */}
    <ConfirmModal
      open={confirmAction !== null}
      onOpenChange={(open) => !open && setConfirmAction(null)}
      title={confirmAction?.title || ""}
      description={confirmAction?.description || ""}
      confirmLabel={confirmAction?.variant === "warning" ? "Discard" : "Delete"}
      variant={confirmAction?.variant || "danger"}
      onConfirm={() => {
        confirmAction?.onConfirm();
        setConfirmAction(null);
      }}
    />

    {/* Image Lightbox */}
    {lightboxSrc && (
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
        onClick={() => setLightboxSrc(null)}
      >
        <button
          type="button"
          onClick={() => setLightboxSrc(null)}
          className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {lightboxSrc.match(/\.(mp4|webm|ogg)/i) ? (
          <video
            src={lightboxSrc}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={lightboxSrc}
            alt="Full size preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    )}

    {/* Fullscreen Preview Modal */}
    {showFullPreview && (() => {
      const deviceConfig = {
        mobile: { width: 375, panelWidth: 320, label: "Mobile" },
        tablet: { width: 768, panelWidth: 500, label: "Tablet" },
        laptop: { width: "80%", panelWidth: 560, label: "Laptop" },
        tv: { width: "95%", panelWidth: 560, label: "TV" },
      } as const;
      const device = deviceConfig[previewDevice];
      const deviceButtons = [
        { id: "mobile" as const, icon: Smartphone },
        { id: "tablet" as const, icon: Tablet },
        { id: "laptop" as const, icon: Laptop },
        { id: "tv" as const, icon: Tv },
      ];
      return (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center overflow-y-auto"
          onClick={() => setShowFullPreview(false)}
        >
          {/* Device toolbar */}
          <div
            className="sticky top-4 z-10 flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-full px-2 py-1.5 mt-4 mb-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {deviceButtons.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPreviewDevice(id)}
                className={`p-2 rounded-full transition-colors ${
                  previewDevice === id
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
                title={deviceConfig[id].label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => setShowFullPreview(false)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview container */}
          <div
            className="mx-auto pb-8 transition-all duration-300 ease-out"
            style={{ width: typeof device.width === "number" ? device.width : device.width, maxWidth: "95%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectCardPreview project={formData} panelWidth={device.panelWidth} />
          </div>
        </div>
      );
    })()}

    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl border border-slate-700 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {project ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {formData.title || "Untitled Project"}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Main Form Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-slate-700 px-5 flex-shrink-0">
              <div className="flex gap-1 -mb-px overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                        ${activeTab === tab.id
                          ? "border-indigo-500 text-indigo-400"
                          : "border-transparent text-slate-400 hover:text-slate-300"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="p-5 flex-1 overflow-y-auto">
                {renderTabContent()}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-5 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                  <span>
                    {activeTab !== "tech" ? (
                      <>
                        Next:{" "}
                        {tabs[tabs.findIndex((t) => t.id === activeTab) + 1]?.label}
                      </>
                    ) : (
                      "Ready to save"
                    )}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.id || !formData.title}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Project
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Drag Handle */}
          <div
            onMouseDown={handleDragStart}
            onDoubleClick={() => setIsCollapsed((c) => !c)}
            className="w-1.5 flex-shrink-0 cursor-col-resize group relative hover:bg-indigo-500/20 transition-colors"
            title="Drag to resize — double-click to toggle"
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors" />
          </div>

          {/* Preview Panel */}
          <div
            className="flex-shrink-0 bg-slate-800/30 flex flex-col overflow-hidden transition-[width] duration-150 ease-out"
            style={{ width: isCollapsed ? 48 : panelWidth }}
          >
            {isCollapsed ? (
              /* Collapsed rail */
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="h-full flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
                title="Show preview"
              >
                <span className="[writing-mode:vertical-lr] text-[11px] font-medium tracking-wider rotate-180">
                  PREVIEW
                </span>
              </button>
            ) : (
              /* Full preview */
              <>
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-700/50 flex-shrink-0">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Live Preview
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowFullPreview(true)}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-700/50 transition-colors"
                      title="Fullscreen preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCollapsed(true)}
                      className="text-[10px] text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded hover:bg-slate-700/50 transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <ProjectCardPreview project={formData} panelWidth={panelWidth} />
                </div>
                <div className="border-t border-slate-700/30 px-3 py-1.5 flex-shrink-0 text-center">
                  <p className="text-[10px] text-slate-600">Drag edge to resize</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectForm;
