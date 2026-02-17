import React from "react";
import {
  Plus,
  Trash2,
  AlertTriangle,
  Award,
  ExternalLink,
} from "lucide-react";
import { FirestoreProject } from "../../../../types/firebase";
import IconPicker from "../IconPicker";

interface ContentTabProps {
  formData: FirestoreProject;
  updateField: (field: keyof FirestoreProject, value: unknown) => void;
  addContribution: () => void;
  removeContribution: (index: number) => void;
  updateContribution: (index: number, field: string, value: string) => void;
  addWebLink: () => void;
  removeWebLink: (index: number) => void;
  updateWebLink: (index: number, field: string, value: string) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
  formData,
  updateField,
  addContribution,
  removeContribution,
  updateContribution,
  addWebLink,
  removeWebLink,
  updateWebLink,
}) => {
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

      {/* Web Links */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            <label className="text-sm font-medium text-slate-300">
              Related Links
            </label>
          </div>
          <button
            type="button"
            onClick={addWebLink}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {(formData.webLinks || []).map((link, idx) => (
            <div key={idx} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
              <div className="flex gap-2 mb-2">
                <IconPicker
                  compact
                  value={link.iconName || "ExternalLink"}
                  onChange={(name) => updateWebLink(idx, "iconName", name)}
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Live Demo, Documentation)"
                  value={link.label}
                  onChange={(e) => updateWebLink(idx, "label", e.target.value)}
                  className="flex-1 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeWebLink(idx)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateWebLink(idx, "url", e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
          ))}
          {(formData.webLinks || []).length === 0 && (
            <p className="text-sm text-slate-500 italic text-center py-4">
              No links added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
