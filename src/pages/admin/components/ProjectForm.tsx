import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import {
  X,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Palette,
  Info,
  Layers,
  Image as ImageIcon,
  Zap,
  Code2,
  Maximize2,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Film,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { FirestoreProject } from "../../../types/firebase";
import { deleteFilesByKeys } from "../../../services/storageService";
import { isVideo } from "../../../lib/mediaUtils";
import ConfirmModal from "../../../components/ui/confirm-modal";
import ProjectCardPreview from "./ProjectCardPreview";
import { emptyProject, themePresets } from "../data/themePresets";
import {
  BasicInfoTab,
  CoverMediaTab,
  ThemeTab,
  ContentTab,
  ImagesTab,
  FeaturesTab,
  TechStackTab,
} from "./project-form";

const ImageEditor = lazy(() => import("./ImageEditor"));

interface ProjectFormProps {
  project?: FirestoreProject | null;
  onSave: (project: FirestoreProject) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

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
      const delta = startXRef.current - ev.clientX;
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

  // Dirty tracking
  const initialDataRef = useRef<string>("");
  const isDirty = useMemo(
    () => initialDataRef.current !== "" && initialDataRef.current !== JSON.stringify(formData),
    [formData]
  );

  // Keys of images deleted during this edit session
  const deletedKeysRef = useRef<string[]>([]);

  // Track uploaded file keys for cleanup on cancel or tab close
  const uploadedKeysRef = useRef<string[]>([]);
  const PENDING_KEYS_STORAGE = "ut_pending_keys";

  // Lock body scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

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

  // --- Form actions ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    uploadedKeysRef.current = [];
    persistPendingKeys([]);
    if (deletedKeysRef.current.length > 0) {
      deleteFilesByKeys(deletedKeysRef.current);
      deletedKeysRef.current = [];
    }
    await onSave(formData);
  };

  const doCancel = () => {
    if (uploadedKeysRef.current.length > 0) {
      deleteFilesByKeys(uploadedKeysRef.current);
      uploadedKeysRef.current = [];
      persistPendingKeys([]);
      toast.info("Unsaved uploads cleaned up");
    }
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

  // --- Field updaters ---

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

  // --- Feature handlers ---

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

  // --- Image handlers ---

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

  // Lightbox + editor state
  const [lightboxImage, setLightboxImage] = useState<{ src: string; index: number } | null>(null);
  const [editingImage, setEditingImage] = useState(false);

  // --- Contribution handlers ---

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

  // --- WebLink handlers ---

  const addWebLink = () => {
    setFormData((prev) => ({
      ...prev,
      webLinks: [...(prev.webLinks || []), { label: "", url: "", iconName: "ExternalLink" }],
    }));
  };

  const removeWebLink = (index: number) => {
    const link = (formData.webLinks || [])[index];
    setConfirmAction({
      title: "Remove Link",
      description: `Remove "${link?.label || `Link ${index + 1}`}"?`,
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          webLinks: (prev.webLinks || []).filter((_, i) => i !== index),
        }));
      },
    });
  };

  const updateWebLink = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      webLinks: (prev.webLinks || []).map((l, i) =>
        i === index ? { ...l, [field]: value } : l
      ),
    }));
  };

  // --- Header info handlers ---

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

  // --- Tech stack handlers ---

  const addTechItem = (category: "frontend" | "backend" | "devops") => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: [...prev.techStack[category], { name: "" }],
      },
    }));
  };

  const removeTechItem = (category: "frontend" | "backend" | "devops", index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: prev.techStack[category].filter((_, i) => i !== index),
      },
    }));
  };

  const updateTechItem = (category: "frontend" | "backend" | "devops", index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: prev.techStack[category].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  // --- Cover media handlers ---

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

  // --- Tab content ---

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoTab
            formData={formData}
            updateField={updateField}
            addHeaderInfo={addHeaderInfo}
            removeHeaderInfo={removeHeaderInfo}
            updateHeaderInfo={updateHeaderInfo}
          />
        );
      case "cover":
        return (
          <CoverMediaTab
            formData={formData}
            setFormData={setFormData}
            updateCoverMedia={updateCoverMedia}
            removeCoverMedia={removeCoverMedia}
            moveCoverMedia={moveCoverMedia}
            uploadedKeysRef={uploadedKeysRef}
            persistPendingKeys={persistPendingKeys}
          />
        );
      case "theme":
        return (
          <ThemeTab
            formData={formData}
            updateTheme={updateTheme}
            applyThemePreset={applyThemePreset}
          />
        );
      case "content":
        return (
          <ContentTab
            formData={formData}
            updateField={updateField}
            addContribution={addContribution}
            removeContribution={removeContribution}
            updateContribution={updateContribution}
            addWebLink={addWebLink}
            removeWebLink={removeWebLink}
            updateWebLink={updateWebLink}
          />
        );
      case "images":
        return (
          <ImagesTab
            formData={formData}
            setFormData={setFormData}
            addImage={addImage}
            removeImage={removeImage}
            updateImage={updateImage}
            reorderImages={reorderImages}
            setLightboxImage={setLightboxImage}
            uploadedKeysRef={uploadedKeysRef}
            persistPendingKeys={persistPendingKeys}
          />
        );
      case "features":
        return (
          <FeaturesTab
            formData={formData}
            addFeature={addFeature}
            removeFeature={removeFeature}
            updateFeature={updateFeature}
          />
        );
      case "tech":
        return (
          <TechStackTab
            formData={formData}
            updateField={updateField}
            addTechItem={addTechItem}
            removeTechItem={removeTechItem}
            updateTechItem={updateTechItem}
          />
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

    {/* Image / Video Lightbox (full preview) */}
    {lightboxImage && !editingImage && (
      <div
        data-overlay
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
        onClick={() => setLightboxImage(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" && lightboxImage.index > 0) {
            const prev = formData.images[lightboxImage.index - 1];
            if (prev?.src) setLightboxImage({ src: prev.src, index: lightboxImage.index - 1 });
          } else if (e.key === "ArrowRight" && lightboxImage.index < formData.images.length - 1) {
            const next = formData.images[lightboxImage.index + 1];
            if (next?.src) setLightboxImage({ src: next.src, index: lightboxImage.index + 1 });
          } else if (e.key === "Escape") {
            setLightboxImage(null);
          }
        }}
        tabIndex={0}
        ref={(el) => el?.focus()}
      >
        <button
          type="button"
          onClick={() => setLightboxImage(null)}
          className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous button */}
        {lightboxImage.index > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const prev = formData.images[lightboxImage.index - 1];
              if (prev?.src) setLightboxImage({ src: prev.src, index: lightboxImage.index - 1 });
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next button */}
        {lightboxImage.index < formData.images.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const next = formData.images[lightboxImage.index + 1];
              if (next?.src) setLightboxImage({ src: next.src, index: lightboxImage.index + 1 });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800/80 rounded-full text-xs text-slate-300 z-10">
          {lightboxImage.index + 1} / {formData.images.length}
        </div>

        {isVideo(formData.images[lightboxImage.index] || { src: lightboxImage.src, caption: "", details: "" }) ? (
          <video
            src={lightboxImage.src}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <img
              src={lightboxImage.src}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditingImage(true);
              }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg transition-colors z-10"
            >
              <Pencil className="w-4 h-4" />
              Edit Image
            </button>
          </>
        )}
      </div>
    )}

    {/* Image Editor (opens from lightbox "Edit" button) */}
    {lightboxImage && editingImage && !isVideo(formData.images[lightboxImage.index] || { src: lightboxImage.src, caption: "", details: "" }) && (
      <Suspense fallback={null}>
        <ImageEditor
          src={lightboxImage.src}
          uploadFolder={`projects/${formData.id}`}
          onSave={(newUrl, newPath) => {
            updateImage(lightboxImage.index, "src", newUrl);
            uploadedKeysRef.current.push(newPath);
            persistPendingKeys(uploadedKeysRef.current);
            setEditingImage(false);
            setLightboxImage({ src: newUrl, index: lightboxImage.index });
          }}
          onClose={() => {
            setEditingImage(false);
          }}
        />
      </Suspense>
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
          data-overlay
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

    <div data-overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
