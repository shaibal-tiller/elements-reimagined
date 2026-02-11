import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import {
  FirestoreResume,
  ResumeSkillCategory,
  ResumeWorkExperience,
  ResumeEducation,
  ResumeLanguage,
  ResumeReference,
} from "../../../types/firebase";

interface ResumeFormProps {
  resume: FirestoreResume | null;
  onSave: (data: Partial<FirestoreResume>) => Promise<void>;
  isLoading: boolean;
}

const inputClass =
  "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white";
const labelClass = "block text-sm font-medium text-slate-300 mb-2";
const sectionClass = "bg-slate-800 rounded-xl p-6 border border-slate-700";
const addBtnClass =
  "flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors";
const removeBtnClass =
  "p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors";

const ResumeForm: React.FC<ResumeFormProps> = ({ resume, onSave, isLoading }) => {
  const [data, setData] = useState<Partial<FirestoreResume>>({
    profile: "",
    videoResumeUrl: "",
    skillCategories: [],
    workExperience: [],
    competencies: [],
    education: [],
    languages: [],
    references: [],
  });

  useEffect(() => {
    if (resume) {
      setData(resume);
    }
  }, [resume]);

  const handleSave = async () => {
    await onSave(data);
  };

  // --- Skill Categories ---
  const addSkillCategory = () => {
    setData((prev) => ({
      ...prev,
      skillCategories: [...(prev.skillCategories || []), { title: "", skills: [] }],
    }));
  };

  const updateSkillCategory = (index: number, field: keyof ResumeSkillCategory, value: any) => {
    setData((prev) => {
      const cats = [...(prev.skillCategories || [])];
      cats[index] = { ...cats[index], [field]: value };
      return { ...prev, skillCategories: cats };
    });
  };

  const removeSkillCategory = (index: number) => {
    setData((prev) => ({
      ...prev,
      skillCategories: (prev.skillCategories || []).filter((_, i) => i !== index),
    }));
  };

  // --- Work Experience ---
  const addWorkExperience = () => {
    setData((prev) => ({
      ...prev,
      workExperience: [
        ...(prev.workExperience || []),
        { project: "", client: "", period: "", link: "", points: [] },
      ],
    }));
  };

  const updateWorkExperience = (index: number, field: keyof ResumeWorkExperience, value: any) => {
    setData((prev) => {
      const exps = [...(prev.workExperience || [])];
      exps[index] = { ...exps[index], [field]: value };
      return { ...prev, workExperience: exps };
    });
  };

  const removeWorkExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter((_, i) => i !== index),
    }));
  };

  // --- Education ---
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { institution: "", degree: "", grade: "", period: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: keyof ResumeEducation, value: string) => {
    setData((prev) => {
      const eds = [...(prev.education || [])];
      eds[index] = { ...eds[index], [field]: value };
      return { ...prev, education: eds };
    });
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }));
  };

  // --- Languages ---
  const addLanguage = () => {
    setData((prev) => ({
      ...prev,
      languages: [...(prev.languages || []), { name: "", level: "" }],
    }));
  };

  const updateLanguage = (index: number, field: keyof ResumeLanguage, value: string) => {
    setData((prev) => {
      const langs = [...(prev.languages || [])];
      langs[index] = { ...langs[index], [field]: value };
      return { ...prev, languages: langs };
    });
  };

  const removeLanguage = (index: number) => {
    setData((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index),
    }));
  };

  // --- References ---
  const addReference = () => {
    setData((prev) => ({
      ...prev,
      references: [
        ...(prev.references || []),
        { name: "", title: "", phone: "", email: "" },
      ],
    }));
  };

  const updateReference = (index: number, field: keyof ResumeReference, value: string) => {
    setData((prev) => {
      const refs = [...(prev.references || [])];
      refs[index] = { ...refs[index], [field]: value };
      return { ...prev, references: refs };
    });
  };

  const removeReference = (index: number) => {
    setData((prev) => ({
      ...prev,
      references: (prev.references || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Profile & Video URL */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-white mb-6">Profile & Video</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Professional Summary</label>
            <textarea
              value={data.profile || ""}
              onChange={(e) => setData((prev) => ({ ...prev, profile: e.target.value }))}
              rows={4}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Video Resume URL (Google Drive embed/preview URL)</label>
            <input
              type="url"
              value={data.videoResumeUrl || ""}
              onChange={(e) => setData((prev) => ({ ...prev, videoResumeUrl: e.target.value }))}
              placeholder="https://drive.google.com/file/d/.../preview"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Skill Categories */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Skill Categories</h3>
          <button onClick={addSkillCategory} className={addBtnClass}>
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        <div className="space-y-6">
          {(data.skillCategories || []).map((cat, idx) => (
            <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) => updateSkillCategory(idx, "title", e.target.value)}
                  placeholder="Category title"
                  className={inputClass}
                />
                <button onClick={() => removeSkillCategory(idx)} className={removeBtnClass}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className={labelClass}>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={(cat.skills || []).join(", ")}
                  onChange={(e) =>
                    updateSkillCategory(
                      idx,
                      "skills",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="React.js, TypeScript, Tailwind CSS"
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Work Experience</h3>
          <button onClick={addWorkExperience} className={addBtnClass}>
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {(data.workExperience || []).map((exp, idx) => (
            <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 mr-2">
                  <div>
                    <label className={labelClass}>Project</label>
                    <input
                      type="text"
                      value={exp.project}
                      onChange={(e) => updateWorkExperience(idx, "project", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Client</label>
                    <input
                      type="text"
                      value={exp.client}
                      onChange={(e) => updateWorkExperience(idx, "client", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateWorkExperience(idx, "period", e.target.value)}
                      placeholder="2023 - Present"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link (optional)</label>
                    <input
                      type="url"
                      value={exp.link || ""}
                      onChange={(e) => updateWorkExperience(idx, "link", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <button onClick={() => removeWorkExperience(idx)} className={removeBtnClass + " mt-6"}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className={labelClass}>Bullet Points (one per line)</label>
                <textarea
                  value={(exp.points || []).join("\n")}
                  onChange={(e) =>
                    updateWorkExperience(
                      idx,
                      "points",
                      e.target.value.split("\n").filter((l) => l.trim() !== "")
                    )
                  }
                  rows={5}
                  className={inputClass}
                  placeholder="Each line becomes a bullet point"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competencies */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-white mb-6">Professional Competencies</h3>
        <div>
          <label className={labelClass}>Competencies (comma-separated)</label>
          <input
            type="text"
            value={(data.competencies || []).join(", ")}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                competencies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              }))
            }
            placeholder="Problem-solving, Team collaboration, ..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Education */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Education</h3>
          <button onClick={addEducation} className={addBtnClass}>
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
        <div className="space-y-4">
          {(data.education || []).map((edu, idx) => (
            <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 mr-2">
                  <div>
                    <label className={labelClass}>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Grade (optional)</label>
                    <input
                      type="text"
                      value={edu.grade || ""}
                      onChange={(e) => updateEducation(idx, "grade", e.target.value)}
                      placeholder="CGPA: 3.82 / 4.0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Period</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => updateEducation(idx, "period", e.target.value)}
                      placeholder="2016 - 2020"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button onClick={() => removeEducation(idx)} className={removeBtnClass + " mt-6"}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Languages</h3>
          <button onClick={addLanguage} className={addBtnClass}>
            <Plus className="w-4 h-4" /> Add Language
          </button>
        </div>
        <div className="space-y-3">
          {(data.languages || []).map((lang, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(idx, "name", e.target.value)}
                placeholder="Language"
                className={inputClass}
              />
              <input
                type="text"
                value={lang.level}
                onChange={(e) => updateLanguage(idx, "level", e.target.value)}
                placeholder="Level (e.g., Native, Fluent)"
                className={inputClass}
              />
              <button onClick={() => removeLanguage(idx)} className={removeBtnClass}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* References */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">References</h3>
          <button onClick={addReference} className={addBtnClass}>
            <Plus className="w-4 h-4" /> Add Reference
          </button>
        </div>
        <div className="space-y-4">
          {(data.references || []).map((ref, idx) => (
            <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 mr-2">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => updateReference(idx, "name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title / Company</label>
                    <input
                      type="text"
                      value={ref.title}
                      onChange={(e) => updateReference(idx, "title", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="text"
                      value={ref.phone}
                      onChange={(e) => updateReference(idx, "phone", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={ref.email}
                      onChange={(e) => updateReference(idx, "email", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <button onClick={() => removeReference(idx)} className={removeBtnClass + " mt-6"}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;
