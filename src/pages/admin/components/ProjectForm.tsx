import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { FirestoreProject } from "../../../types/firebase";
import { iconRegistry } from "../../../lib/iconRegistry";
import ImageUploader from "./ImageUploader";
import ProjectCardPreview from "./ProjectCardPreview";

interface ProjectFormProps {
  project?: FirestoreProject | null;
  onSave: (project: FirestoreProject) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const iconNames = Object.keys(iconRegistry);

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
  order: 0,
};

type TabId = "basic" | "theme" | "content" | "images" | "features" | "tech";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "Basic Info", icon: Info },
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
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({ ...emptyProject, id: `project-${Date.now()}` });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
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
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImage = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  };

  const addContribution = () => {
    setFormData((prev) => ({
      ...prev,
      contributions: [...prev.contributions, { title: "", desc: "" }],
    }));
  };

  const removeContribution = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contributions: prev.contributions.filter((_, i) => i !== index),
    }));
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
    setFormData((prev) => ({
      ...prev,
      headerInfo: prev.headerInfo.filter((_, i) => i !== index),
    }));
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

      case "theme":
        return (
          <div className="space-y-6">
            {/* Theme Presets */}
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
                      ${formData.theme.primary === preset.theme.primary
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

            {/* Advanced Theme Options */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Advanced Customization
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.theme).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateTheme(key, e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Preview */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Theme Preview
              </label>
              <div className={`${formData.theme.bgMain} p-4 rounded-xl`}>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`${formData.theme.pillBg} ${formData.theme.pillText} border ${formData.theme.pillBorder} px-3 py-1 rounded-full text-xs font-bold uppercase`}
                  >
                    Category
                  </span>
                </div>
                <h4 className="text-white text-lg font-bold mb-1">Sample Title</h4>
                <p className="text-slate-300 text-sm">Subtitle text here</p>
              </div>
            </div>
          </div>
        );

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
                <Plus className="w-4 h-4" /> Add Image
              </button>
            </div>

            <div className="space-y-4">
              {formData.images.map((image, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden"
                >
                  <div className="flex">
                    {/* Image Preview / Upload */}
                    <div className="w-48 flex-shrink-0">
                      {image.src ? (
                        <div className="relative h-full min-h-[120px]">
                          <img
                            src={image.src}
                            alt={image.caption || `Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => updateImage(idx, "src", "")}
                            className="absolute top-2 right-2 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded transition-colors"
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
                          Image {idx + 1}
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
                        placeholder="Caption"
                        value={image.caption}
                        onChange={(e) => updateImage(idx, "caption", e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
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

              {formData.images.length === 0 && (
                <div className="text-center py-12 bg-slate-700/20 rounded-xl border-2 border-dashed border-slate-600">
                  <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-2">No images added yet</p>
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    Add your first image
                  </button>
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
                  {formData.techStack.frontend.map((tech) => (
                    <span
                      key={`fe-${tech}`}
                      className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium border border-blue-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {formData.techStack.backend.map((tech) => (
                    <span
                      key={`be-${tech}`}
                      className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs rounded-md font-medium border border-green-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {formData.techStack.devops.map((tech) => (
                    <span
                      key={`do-${tech}`}
                      className="px-2.5 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md font-medium border border-purple-500/20"
                    >
                      {tech}
                    </span>
                  ))}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-4 px-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl border border-slate-700 my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              {project ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {formData.title || "Untitled Project"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex">
          {/* Main Form Area */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="border-b border-slate-700 px-5">
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
            <form onSubmit={handleSubmit}>
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {renderTabContent()}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-5 border-t border-slate-700 bg-slate-800/50">
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
                    onClick={onCancel}
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

          {/* Preview Sidebar */}
          <div className="w-80 border-l border-slate-700 flex-shrink-0 bg-slate-800/30">
            <div className="p-4 sticky top-0">
              <ProjectCardPreview
                project={formData}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
