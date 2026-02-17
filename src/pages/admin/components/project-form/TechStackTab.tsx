import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { FirestoreProject } from "../../../../types/firebase";
import IconPicker, { MultiIconPicker } from "../IconPicker";
import { resolveTechPillStyles } from "../../../../lib/twColors";

interface TechStackTabProps {
  formData: FirestoreProject;
  updateField: (field: keyof FirestoreProject, value: unknown) => void;
  addTechItem: (category: "frontend" | "backend" | "devops") => void;
  removeTechItem: (category: "frontend" | "backend" | "devops", index: number) => void;
  updateTechItem: (category: "frontend" | "backend" | "devops", index: number, field: string, value: string) => void;
}

const TechStackTab: React.FC<TechStackTabProps> = ({
  formData,
  updateField,
  addTechItem,
  removeTechItem,
  updateTechItem,
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {([
          { key: "frontend" as const, label: "Frontend Technologies", placeholder: "React" },
          { key: "backend" as const, label: "Backend Technologies", placeholder: "Node.js" },
          { key: "devops" as const, label: "DevOps / Tools", placeholder: "Docker" },
        ]).map(({ key, label, placeholder }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-300">
                {label}
              </label>
              <button
                type="button"
                onClick={() => addTechItem(key)}
                className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.techStack[key].map((tech, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <IconPicker
                    compact
                    value={tech.iconName || "Code2"}
                    onChange={(name) => updateTechItem(key, idx, "iconName", name)}
                  />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={tech.name}
                    onChange={(e) => updateTechItem(key, idx, "name", e.target.value)}
                    className="flex-1 px-2.5 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechItem(key, idx)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {formData.techStack[key].length === 0 && (
                <p className="text-xs text-slate-500 italic text-center py-2">No items yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Marquee Icons */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Marquee Icons
        </label>
        <MultiIconPicker
          value={formData.marqueeIconNames}
          onChange={(names) => updateField("marqueeIconNames", names)}
        />
        <p className="text-xs text-slate-500 mt-1">
          Icons for the scrolling marquee
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
                  key={`fe-${tech.name}`}
                  className="px-2.5 py-1 text-xs rounded-md font-medium border"
                  style={s}
                >
                  {tech.name}
                </span>
              );
            })}
            {formData.techStack.backend.map((tech) => {
              const s = resolveTechPillStyles(formData.theme, formData.theme.techBackendColor);
              return (
                <span
                  key={`be-${tech.name}`}
                  className="px-2.5 py-1 text-xs rounded-md font-medium border"
                  style={s}
                >
                  {tech.name}
                </span>
              );
            })}
            {formData.techStack.devops.map((tech) => {
              const s = resolveTechPillStyles(formData.theme, formData.theme.techDevopsColor);
              return (
                <span
                  key={`do-${tech.name}`}
                  className="px-2.5 py-1 text-xs rounded-md font-medium border"
                  style={s}
                >
                  {tech.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackTab;
