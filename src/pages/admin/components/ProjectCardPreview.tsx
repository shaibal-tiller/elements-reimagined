import React from "react";
import { ArrowRight, Play } from "lucide-react";
import { FirestoreProject } from "../../../types/firebase";
import { getIcon } from "../../../lib/iconRegistry";
import { resolveThemeStyles, resolveTechPillStyles } from "../../../lib/twColors";
import { isVideo } from "../../../lib/mediaUtils";

interface ProjectCardPreviewProps {
  project: FirestoreProject;
  panelWidth: number;
}

const ProjectCardPreview: React.FC<ProjectCardPreviewProps> = ({
  project,
  panelWidth,
}) => {
  const BannerIcon = getIcon(project.bannerIconName);
  const isWide = panelWidth >= 380;
  const isNarrow = panelWidth < 320;

  const themeStyles = resolveThemeStyles(project.theme);

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div className="mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          {/* Banner */}
          <div
            className={`${isNarrow ? "h-32" : isWide ? "h-48" : "h-40"} relative overflow-hidden p-4 flex flex-col justify-between transition-all duration-150`}
            style={themeStyles.bgMain}
          >
            {/* Cover media background */}
            {project.coverMedia && project.coverMedia.length > 0 && project.coverMedia[0].src ? (
              <>
                {isVideo(project.coverMedia[0]) ? (
                  <video
                    src={project.coverMedia[0].src}
                    muted
                    playsInline
                    autoPlay
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={project.coverMedia[0].src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/50" />
              </>
            ) : (
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full blur-[50px] opacity-20 -translate-y-1/2 translate-x-1/4"
                style={themeStyles.accentBlur}
              />
            )}
            <div className="flex justify-between items-start z-10">
              <span
                className="border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
                style={{ ...themeStyles.pillBg, ...themeStyles.pillText, ...themeStyles.pillBorder }}
              >
                {project.category || "Category"}
              </span>
              <BannerIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="z-10">
              <h4 className={`${isWide ? "text-2xl" : "text-lg"} font-bold text-white mb-0.5 leading-tight transition-all duration-150`}>
                {project.title || "Project Title"}
              </h4>
              <p className={`text-slate-300 ${isWide ? "text-sm" : "text-xs"}`}>
                {project.subtitle || "Project subtitle goes here"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className={isWide ? "p-5" : "p-4"}>
            <p className={`text-slate-600 ${isWide ? "text-sm" : "text-xs"} mb-3 line-clamp-3 leading-relaxed`}>
              {project.overview
                ? project.overview.split(".")[0] + "."
                : "Project overview will appear here..."}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(project.techStack.frontend.length > 0
                ? project.techStack.frontend.slice(0, isWide ? 5 : 3)
                : [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind" }]
              ).map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium border border-slate-200"
                >
                  {tech.name}
                </span>
              ))}
            </div>
            <div
              className={`flex items-center font-semibold ${isWide ? "text-sm" : "text-xs"}`}
              style={{ color: project.theme.textMain || "#1e1b4b" }}
            >
              View Case Study <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid ${isWide ? "grid-cols-3" : "grid-cols-3"} gap-2`}>
        <div className="bg-slate-800/80 rounded-lg px-2.5 py-2 border border-slate-700/50 text-center">
          <p className="text-lg font-bold text-white">{project.images.length}</p>
          <p className="text-[10px] text-slate-500">Media</p>
        </div>
        <div className="bg-slate-800/80 rounded-lg px-2.5 py-2 border border-slate-700/50 text-center">
          <p className="text-lg font-bold text-white">{project.features.length}</p>
          <p className="text-[10px] text-slate-500">Features</p>
        </div>
        <div className="bg-slate-800/80 rounded-lg px-2.5 py-2 border border-slate-700/50 text-center">
          <p className="text-lg font-bold text-white">{project.contributions.length}</p>
          <p className="text-[10px] text-slate-500">Contribs</p>
        </div>
      </div>

      {/* Features */}
      {project.features.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Features</h4>
          <div className="space-y-1.5">
            {project.features.map((feature, idx) => {
              const FeatureIcon = getIcon(feature.iconName);
              return (
                <div key={idx} className="flex items-start gap-2 bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/40">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FeatureIcon className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white font-medium leading-tight">{feature.title}</p>
                    {isWide && feature.desc && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{feature.desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Images */}
      {project.images.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Gallery
          </h4>
          <div className={`grid ${isWide ? "grid-cols-2" : "grid-cols-2"} gap-1.5`}>
            {project.images.slice(0, isWide ? 4 : 2).map((image, idx) => (
              <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 relative">
                {image.src ? (
                  isVideo(image) ? (
                    <>
                      <video src={image.src} muted preload="metadata" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={image.src} alt={image.caption} className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">
                    Empty
                  </div>
                )}
              </div>
            ))}
          </div>
          {project.images.length > (isWide ? 4 : 2) && (
            <p className="text-[10px] text-slate-600 mt-1.5 text-center">
              +{project.images.length - (isWide ? 4 : 2)} more
            </p>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {(project.techStack.frontend.length > 0 || project.techStack.backend.length > 0 || project.techStack.devops.length > 0) && (
        <div>
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Tech Stack</h4>
          <div className="space-y-2">
            {(["frontend", "backend", "devops"] as const).map((category) => {
              if (project.techStack[category].length === 0) return null;
              const categoryColorMap = {
                frontend: project.theme.techFrontendColor,
                backend: project.theme.techBackendColor,
                devops: project.theme.techDevopsColor,
              };
              const pillStyle = resolveTechPillStyles(project.theme, categoryColorMap[category]);
              return (
                <div key={category}>
                  <span className="text-[10px] text-slate-600 font-medium capitalize">{category === "devops" ? "DevOps" : category}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.techStack[category].map((tech) => (
                      <span
                        key={tech.name}
                        className="px-1.5 py-0.5 text-[10px] rounded border"
                        style={pillStyle}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contributions */}
      {project.contributions.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Contributions</h4>
          <div className="space-y-1.5">
            {project.contributions.map((contrib, idx) => (
              <div key={idx} className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/40">
                <p className="text-xs text-white font-medium">{contrib.title}</p>
                {isWide && contrib.desc && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{contrib.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenge */}
      {(project.challenge.title || project.challenge.desc) && (
        <div>
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Challenge</h4>
          <div className="bg-amber-500/5 rounded-lg p-2.5 border border-amber-500/10">
            {project.challenge.title && (
              <p className="text-xs text-amber-300 font-medium">{project.challenge.title}</p>
            )}
            {isWide && project.challenge.desc && (
              <p className="text-[11px] text-slate-500 line-clamp-3 mt-0.5">{project.challenge.desc}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCardPreview;
