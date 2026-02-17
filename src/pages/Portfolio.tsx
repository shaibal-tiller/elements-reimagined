import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types/firebase';
import { ProjectCardSkeleton } from '../components/skeletons';
import ErrorView from '../components/ErrorView';
import { resolveThemeStyles } from '../lib/twColors';
import { isVideo } from '../lib/mediaUtils';

const SECTIONS = [
  { label: 'Client Works', categories: ['Client Project'] },
  { label: 'Inhouse Projects', categories: ['In-House Tool', 'Company Product'] },
  { label: 'Personal Projects', categories: ['Personal Project'] },
];

const SLIDE_INTERVAL = 7000;

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const BannerIcon = project.bannerIcon;
  const ts = resolveThemeStyles(project.theme);

  // Determine cover slides: dedicated coverMedia, or fallback to project images
  const hasDedicatedCover = (project.coverMedia || []).some(m => m.src);
  const coverImages = useMemo(() => {
    if (hasDedicatedCover) {
      return (project.coverMedia || []).filter(m => m.src && !isVideo(m));
    }
    return (project.images || []).filter(m => m.src && !isVideo(m));
  }, [project.coverMedia, project.images, hasDedicatedCover]);

  // slideIndex: -1 = themed banner (first), 0+ = image slides
  const hasSlides = coverImages.length > 0;
  const [slideIndex, setSlideIndex] = useState(-1);

  const nextSlide = useCallback(() => {
    if (!hasSlides) return;
    setSlideIndex(prev => {
      const next = prev + 1;
      // Cycle: -1 → 0 → 1 → ... → N-1 → -1
      return next >= coverImages.length ? -1 : next;
    });
  }, [hasSlides, coverImages.length]);

  useEffect(() => {
    if (!hasSlides) return;
    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [hasSlides, nextSlide]);

  return (
    <Link to={`/portfolio/${project.slug}`} className="group block">
      <div className="card-white p-0 h-full overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-100 flex flex-col">
        {/* Header / Banner */}
        <div className="h-48 relative overflow-hidden p-6 flex flex-col justify-between" style={ts.bgMain}>
          {/* Themed banner background (slide -1) */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: slideIndex === -1 ? 1 : 0 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/4" style={ts.accentBlur}></div>
          </div>

          {/* Image slides */}
          {coverImages.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: slideIndex === idx ? 1 : 0 }}
            >
              <img
                src={img.src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}

          <div className="flex justify-between items-start z-10">
            <span className="border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm" style={{ ...ts.pillBg, ...ts.pillBorder, ...ts.pillText }}>
              {project.category}
            </span>
            <BannerIcon className="text-slate-400 transition-colors" />
          </div>

          <div className="z-10 relative">
            <div className='bg-black bg-opacity-20 absolute inset-[-23px]'></div>
            <h3 className="text-2xl font-bold text-white transition-colors">
              {project.title}
            </h3>
            <p className="text-slate-300 text-sm">{project.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-1">
            {project.overview.split('.')[0]}.
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.frontend.slice(0, 4).map(tech => (
              <span key={tech.name} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">
                {tech.name}
              </span>
            ))}
            {project.techStack.frontend.length > 4 ? <span className='text-white text-xs my-auto'>+ {(project.techStack.frontend.length - 4) +
              (project.techStack.backend.length) + (project.techStack.devops.length)} more . . .</span> : <span className='text-white text-xs my-auto'>+ {
                (project.techStack.backend.length) + (project.techStack.devops.length)} more . . .</span>}
          </div>

          {/* Footer */}
          {/* <div className="flex items-center font-semibold text-sm group-hover:translate-x-1 transition-transform" style={ts.textMain}>
            View Case Study <ArrowRight className="w-4 h-4 ml-2" />
          </div> */}
        </div>
      </div>
    </Link>
  );
};

const Portfolio: React.FC = () => {
  const { data: projects, isLoading, error, refetch } = useProjects();

  const sections = useMemo(() => {
    if (!projects) return [];
    return SECTIONS
      .map((section) => ({
        label: section.label,
        projects: projects.filter((p) => section.categories.includes(p.category)),
      }))
      .filter((section) => section.projects.length > 0);
  }, [projects]);

  return (
    <div className="animate-fadeUp">
      <h2 className="text-3xl font-bold mb-8 text-[#f1f1f1]">Featured Projects</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorView
          title="Failed to load projects"
          message={error.message || "We couldn't fetch the projects. Please check your connection and try again."}
          onRetry={() => refetch()}
          showHomeButton={false}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-slate-700/50 p-4 rounded-full mb-6">
            <FolderKanban className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-slate-400 text-center max-w-md">
            Projects will appear here once they are added to the database.
          </p>
        </div>
      )}

      {/* Project Sections */}
      {!isLoading && !error && sections.length > 0 && (
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.label}>
              <h3 className="text-xl font-semibold text-slate-300 mb-6">{section.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
