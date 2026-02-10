import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, Maximize2, Minimize2, X } from "lucide-react";
import { FirestoreProject } from "../../../types/firebase";
import { getIcon } from "../../../lib/iconRegistry";

interface ProjectCardPreviewProps {
  project: FirestoreProject;
  showPreview: boolean;
  onTogglePreview: () => void;
}

const ProjectCardPreview: React.FC<ProjectCardPreviewProps> = ({
  project,
  showPreview,
  onTogglePreview,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const BannerIcon = getIcon(project.bannerIconName);

  const PreviewContent = ({ fullSize = false }: { fullSize?: boolean }) => (
    <div className={fullSize ? "p-6" : ""}>
      {/* Portfolio Card Preview */}
      <div className={`${fullSize ? "max-w-md" : "max-w-sm"} mx-auto`}>
        <div className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 ${fullSize ? "scale-100" : ""}`}>
          {/* Banner */}
          <div
            className={`${fullSize ? "h-48" : "h-40"} ${project.theme.bgMain || "bg-slate-800"} relative overflow-hidden p-5 flex flex-col justify-between`}
          >
            <div
              className={`absolute top-0 right-0 w-28 h-28 ${project.theme.accentBlur || "bg-indigo-500"} rounded-full blur-[50px] opacity-20 -translate-y-1/2 translate-x-1/4`}
            />

            <div className="flex justify-between items-start z-10">
              <span
                className={`${project.theme.pillBg || "bg-indigo-500/10"} ${project.theme.pillText || "text-indigo-400"} border ${project.theme.pillBorder || "border-indigo-500/20"} px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm`}
              >
                {project.category || "Category"}
              </span>
              <BannerIcon className="w-5 h-5 text-slate-400" />
            </div>

            <div className="z-10">
              <h4 className={`${fullSize ? "text-2xl" : "text-xl"} font-bold text-white mb-0.5`}>
                {project.title || "Project Title"}
              </h4>
              <p className="text-slate-300 text-xs">
                {project.subtitle || "Project subtitle goes here"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className={`${fullSize ? "p-6" : "p-5"}`}>
            <p className={`text-slate-600 ${fullSize ? "text-base" : "text-sm"} mb-4 line-clamp-3 leading-relaxed`}>
              {project.overview
                ? project.overview.split(".")[0] + "."
                : "Project overview will appear here..."}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(project.techStack.frontend.length > 0
                ? project.techStack.frontend.slice(0, 4)
                : ["React", "TypeScript", "Tailwind"]
              ).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div
              className={`flex items-center font-semibold ${fullSize ? "text-sm" : "text-xs"}`}
              style={{ color: project.theme.textMain || "#1e1b4b" }}
            >
              View Case Study <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details in Full Size */}
      {fullSize && (
        <div className="mt-6 space-y-4">
          {/* Features Preview */}
          {project.features.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Features ({project.features.length})</h4>
              <div className="space-y-2">
                {project.features.slice(0, 3).map((feature, idx) => {
                  const FeatureIcon = getIcon(feature.iconName);
                  return (
                    <div key={idx} className="flex items-start gap-2">
                      <FeatureIcon className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white font-medium">{feature.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
                {project.features.length > 3 && (
                  <p className="text-xs text-slate-500">+{project.features.length - 3} more features</p>
                )}
              </div>
            </div>
          )}

          {/* Images Preview */}
          {project.images.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Images ({project.images.length})</h4>
              <div className="grid grid-cols-3 gap-2">
                {project.images.slice(0, 3).map((image, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-slate-700">
                    {image.src ? (
                      <img src={image.src} alt={image.caption} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {project.images.length > 3 && (
                <p className="text-xs text-slate-500 mt-2">+{project.images.length - 3} more images</p>
              )}
            </div>
          )}

          {/* Tech Stack Full */}
          {(project.techStack.frontend.length > 0 || project.techStack.backend.length > 0 || project.techStack.devops.length > 0) && (
            <div className="bg-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Tech Stack</h4>
              <div className="space-y-2">
                {project.techStack.frontend.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500">Frontend:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.techStack.frontend.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.techStack.backend.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500">Backend:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.techStack.backend.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.techStack.devops.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500">DevOps:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.techStack.devops.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contributions */}
          {project.contributions.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Contributions ({project.contributions.length})</h4>
              <div className="space-y-2">
                {project.contributions.slice(0, 3).map((contrib, idx) => (
                  <div key={idx}>
                    <p className="text-sm text-white font-medium">{contrib.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{contrib.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Label */}
      <p className="text-center text-xs text-slate-500 mt-4">
        {fullSize
          ? "Full preview of your project"
          : "This is how your project will appear on the portfolio page"}
      </p>
    </div>
  );

  // Maximized Modal
  if (isMaximized) {
    return (
      <>
        {/* Sidebar placeholder */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Preview
            </h3>
            <button
              type="button"
              onClick={() => setIsMaximized(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Maximized
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="text-slate-500 text-sm">
              Preview is displayed in full screen mode
            </div>
          </div>
        </div>

        {/* Full Screen Modal */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                Project Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMaximized(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                  Minimize
                </button>
                <button
                  type="button"
                  onClick={() => setIsMaximized(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <PreviewContent fullSize={true} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Live Preview
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMaximized(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Maximize preview"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onTogglePreview}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${showPreview
                ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }
            `}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Show
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      {showPreview && (
        <div className="p-4 max-h-[500px] overflow-y-auto">
          <PreviewContent />
        </div>
      )}

      {/* Collapsed State */}
      {!showPreview && (
        <div className="p-8 text-center">
          <div className="text-slate-600 text-sm">
            Click "Show" to see a live preview of your project card
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCardPreview;
