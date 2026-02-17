import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { FirestoreProject } from "../../../../types/firebase";
import IconPicker from "../IconPicker";

interface BasicInfoTabProps {
  formData: FirestoreProject;
  updateField: (field: keyof FirestoreProject, value: unknown) => void;
  addHeaderInfo: () => void;
  removeHeaderInfo: (index: number) => void;
  updateHeaderInfo: (index: number, field: string, value: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  updateField,
  addHeaderInfo,
  removeHeaderInfo,
  updateHeaderInfo,
}) => {
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
          <select
            value={formData.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="">Select category</option>
            <option value="Client Project">Client Project</option>
            <option value="In-House Tool">In-House Tool</option>
            <option value="Company Product">Company Product</option>
            <option value="Personal Project">Personal Project</option>
          </select>
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
        <IconPicker
          value={formData.bannerIconName}
          onChange={(name) => updateField("bannerIconName", name)}
        />
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
              <IconPicker
                compact
                value={info.iconName}
                onChange={(name) => updateHeaderInfo(idx, "iconName", name)}
              />
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
};

export default BasicInfoTab;
