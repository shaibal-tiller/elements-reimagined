import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { FirestoreService } from "../../../types/firebase";
import { iconRegistry } from "../../../lib/iconRegistry";

interface ServiceFormProps {
  service?: FirestoreService | null;
  onSave: (service: FirestoreService) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const iconNames = Object.keys(iconRegistry);

const emptyService: FirestoreService = {
  id: "",
  iconName: "Code2",
  title: "",
  description: "",
  order: 0,
};

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<FirestoreService>(emptyService);

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({ ...emptyService, id: `service-${Date.now()}` });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const updateField = (field: keyof FirestoreService, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div data-overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 border border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {service ? "Edit Service" : "New Service"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Icon
            </label>
            <select
              value={formData.iconName}
              onChange={(e) => updateField("iconName", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              {iconNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Order
            </label>
            <input
              type="number"
              value={formData.order || 0}
              onChange={(e) => updateField("order", parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Service
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
