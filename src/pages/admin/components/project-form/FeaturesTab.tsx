import React from "react";
import { Plus, Trash2, Zap } from "lucide-react";
import { FirestoreProject } from "../../../../types/firebase";
import IconPicker from "../IconPicker";

interface FeaturesTabProps {
  formData: FirestoreProject;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  updateFeature: (index: number, field: string, value: string) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  formData,
  addFeature,
  removeFeature,
  updateFeature,
}) => {
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
                <IconPicker
                  compact
                  value={feature.iconName}
                  onChange={(name) => updateFeature(idx, "iconName", name)}
                />
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
};

export default FeaturesTab;
