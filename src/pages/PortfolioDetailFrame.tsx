import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderX,
  User,
  ExternalLink,
} from 'lucide-react';
import { isVideo, isEmbedVideo, getEmbedUrl } from '../lib/mediaUtils';
import { useProject } from '../hooks/useProject';
import { ProjectDetailSkeleton } from '../components/skeletons';
import { resolveTechPillStyles } from '../lib/twColors';
import { getIcon } from '../lib/iconRegistry';
import { useSidebar } from '../contexts/SidebarContext';
import { LazyMedia, ImageViewer, GallerySection, MarqueeRow } from '../components/portfolio';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { setCollapsed } = useSidebar();
  const contextSectionRef = useRef<HTMLElement>(null);

  const { data: project, isLoading, error, refetch } = useProject(slug);
  const [showFloatingBack, setShowFloatingBack] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  // The app uses react-custom-scrollbars-2 — the scrollable element
  // is its inner "view" div, tagged with data-scroll-container.
  const getScrollContainer = (): HTMLElement | null =>
    document.querySelector<HTMLElement>('[data-scroll-container]');

  // Scroll to top on route change AND after data finishes loading
  useEffect(() => {
    const scrollToTop = () => {
      const container = getScrollContainer();
      if (container) {
        container.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    };
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, [slug, isLoading]);

  useEffect(() => {
    const container = getScrollContainer();
    const target = container || window;

    const onScroll = () => {
      const scrollY = container ? container.scrollTop : window.scrollY;
      setShowFloatingBack(scrollY > 300);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, []);

  // Collapse sidebar once when scrolling past "Project Context" — one-way, never re-expands on scroll
  const hasCollapsedRef = useRef(false);

  useEffect(() => {
    hasCollapsedRef.current = false;
    setProfileExpanded(false);
  }, [slug]);

  // When profileExpanded changes, sync with sidebar
  useEffect(() => {
    if (profileExpanded) {
      setCollapsed(false);
    } else if (hasCollapsedRef.current) {
      setCollapsed(true);
    }
  }, [profileExpanded, setCollapsed]);

  useEffect(() => {
    const el = contextSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.bottom < window.innerHeight / 2) {
          if (!hasCollapsedRef.current || profileExpanded) {
            hasCollapsedRef.current = true;
            setProfileExpanded(false);
            setCollapsed(true);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      setCollapsed(false);
    };
  }, [project, setCollapsed, profileExpanded]);

  // Cover media slideshow: starts at -1 (themed bg), then loops through coverMedia
  const coverMedia = project?.coverMedia || [];
  const [coverIdx, setCoverIdx] = useState(-1);
  const hasShownCoverRef = useRef(false);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCoverIdx(-1);
    hasShownCoverRef.current = false;
    isPausedRef.current = false;

    if (coverMedia.length === 0) return;

    const tick = () => {
      if (isPausedRef.current) return;
      setCoverIdx((prev) => {
        if (!hasShownCoverRef.current) {
          hasShownCoverRef.current = true;
          return 0;
        }
        return (prev + 1) % coverMedia.length;
      });
    };

    intervalRef.current = setInterval(tick, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [coverMedia.length]);

  const handleHeroMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleHeroMouseLeave = () => {
    isPausedRef.current = false;
  };

  // Loading State
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-[100px]">
        <div className="text-center px-4">
          <div className="bg-red-500/10 p-4 rounded-full mb-6 inline-block">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Failed to load project</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            {error.message || "We couldn't fetch this project. Please check your connection and try again."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/portfolio')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-[100px]">
        <div className="text-center px-4">
          <div className="bg-slate-700/50 p-4 rounded-full mb-6 inline-block">
            <FolderX className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Project Not Found</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            The project you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const { theme } = project;
  const hasCover = coverMedia.length > 0;

  return (
    <>
      {selectedImageIndex !== null && (
        <ImageViewer
          images={project.images}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}

      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 animate-fadeUp mt-[100px]">

        {/* Hero Header */}
        <div
          className={`relative ${theme.bgMain} text-white overflow-hidden rounded-xl -translate-y-[10px]`}
          onMouseEnter={handleHeroMouseEnter}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Slide 0: Themed cover background (shown initially) */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-10"
            style={{ opacity: coverIdx === -1 ? 0.1 : 0 }}
          >
            <div className={`absolute right-0 top-0 w-[600px] h-[600px] ${theme.accentBlur} rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4`}></div>
            <div className={`absolute left-10 bottom-0 w-[400px] h-[400px] ${theme.accentBlur} rounded-full blur-[100px] translate-y-1/2`}></div>
          </div>

          {/* Slides 1+: Cover media items */}
          {hasCover && (
            <>
              {coverMedia.map((media, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{ opacity: idx === coverIdx ? 1 : 0 }}
                >
                  {isVideo(media) ? (
                    isEmbedVideo(media.src) ? (
                      <iframe
                        src={getEmbedUrl(media.src) || media.src}
                        className="w-full h-full object-cover"
                        allow="autoplay; muted"
                        style={{ border: 0 }}
                      />
                    ) : (
                      <LazyMedia
                        src={media.src}
                        type="video"
                        className="w-full h-full object-cover"
                        videoProps={{ autoPlay: true, muted: true, loop: true, playsInline: true, style: { objectFit: "cover" } }}
                      />
                    )
                  ) : (
                    <LazyMedia
                      src={media.src}
                      alt={media.caption || ""}
                      type="image"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {/* Dark overlay for readability (only when showing media) */}
              <div
                className="absolute inset-0 bg-black/55 transition-opacity duration-700"
                style={{ opacity: coverIdx >= 0 ? 1 : 0 }}
              />
            </>
          )}

          <div className="container mx-auto px-6 pt-6 pb-16 relative z-10" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            <button onClick={() => navigate('/portfolio')} className="mb-8 flex items-center text-slate-300 hover:text-white transition-colors border hover:border-white rounded-lg pl-2 pr-4" >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <span className={`inline-flex items-center gap-2 ${theme.pillBg} ${theme.pillText} ${theme.pillBorder} border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm`}>
                <project.bannerIcon className="w-3 h-3" /> {project.category}
              </span>
              <div className={`flex items-center gap-6 mt-4 md:mt-0 text-slate-300 text-sm font-medium`}>
                <span>{project.year}</span>
                <span>{project.company}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {project.title} <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.bgGradient} text-3xl md:text-5xl`}
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
              >
                {project.subtitle}
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mt-12">
              {project.headerInfo.map((info, idx) => (
                <div key={idx} className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                  <p className={`text-[10px] uppercase tracking-wider mb-1 text-slate-300`}>{info.label}</p>
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <info.icon className={`w-4 h-4 ${theme.pillText}`} />
                    {info.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="container mx-auto px-6 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Main Content */}
            <div className="lg:col-span-8 space-y-8">

              <section ref={contextSectionRef} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.textMain }}>
                  <div className={`w-2 h-8 ${theme.accentBlur} rounded-full`}></div>
                  Project Context
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.overview}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-6" style={{ color: theme.textMain }}>System Modules & Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className={`w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:${theme.accentBlur} group-hover:text-white transition-colors`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <GallerySection
                images={project.images}
                theme={theme}
                onImageClick={(idx) => setSelectedImageIndex(idx)}
              />

              <section className={`bg-gradient-to-br ${theme.bgMain} text-white rounded-2xl p-8 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${theme.accentBlur} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                  <div className={`w-2 h-8 ${theme.accentBlur} rounded-full`}></div>
                  My Key Contributions
                </h2>
                <div className="space-y-6 relative z-10">
                  {project.contributions.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1">
                        <div className={`w-6 h-6 rounded-full ${theme.pillBg} flex items-center justify-center`}>
                          <CheckCircle2 className={`w-4 h-4 ${theme.pillText}`} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white mb-2">{item.title}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-24 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden bg-slate-50">
                  <style>{`
                      @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                      @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
                   `}</style>
                  <div className="absolute inset-[-100%] flex flex-col justify-center gap-12 rotate-[30deg] scale-150">
                    <MarqueeRow direction="left" duration="40s" icons={project.marqueeIcons} />
                    <MarqueeRow direction="right" duration="50s" icons={project.marqueeIcons} />
                    <MarqueeRow direction="left" duration="45s" icons={project.marqueeIcons} />
                  </div>
                </div>

                <div className="relative z-10 p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textMain }}>
                    <project.bannerIcon className={`w-5 h-5`} style={{ color: theme.textMain }} />
                    Tech Stack
                  </h3>

                  <div className="space-y-6">
                    {([
                      { key: "frontend" as const, label: "Frontend", colorOverride: theme.techFrontendColor },
                      { key: "backend" as const, label: "Backend", colorOverride: theme.techBackendColor },
                      { key: "devops" as const, label: "DevOps & Tools", colorOverride: theme.techDevopsColor },
                    ]).map(({ key, label, colorOverride }) => {
                      const pillStyle = resolveTechPillStyles(theme, colorOverride);
                      return (
                        <div key={key}>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">{label}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack[key].map((tech) => {
                              const TechIcon = tech.iconName ? getIcon(tech.iconName) : null;
                              return (
                                <span key={tech.name} className="px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-default backdrop-blur-sm inline-flex items-center gap-1.5" style={pillStyle}>
                                  {TechIcon && <TechIcon className="w-3 h-3" />}
                                  {tech.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {project.webLinks && project.webLinks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textMain }}>
                        <project.bannerIcon className={`w-5 h-5`} style={{ color: theme.textMain }} />
                        Related Links
                      </h3>
                      <div className="space-y-2">
                        {project.webLinks.map((link, idx) => {
                          const LinkIcon = link.iconName ? getIcon(link.iconName) : null;
                          return (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group overflow-hidden"
                          >
                            <div className="flex items-center gap-2 px-3 py-2.5">
                              <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                                {LinkIcon && <LinkIcon className="w-3.5 h-3.5 text-slate-400" />}
                              </span>
                              <span className="text-sm font-medium text-slate-700 flex-1">{link.label}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>
                            <div className="max-h-0 group-hover:max-h-10 transition-all duration-300 ease-in-out overflow-hidden">
                              <div className="px-3 pb-2 text-xs text-slate-400 truncate">{link.url}</div>
                            </div>
                          </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textMain }}>
                      <project.bannerIcon className={`w-5 h-5`} style={{ color: theme.textMain }} />
                      Key Challenge
                    </h3>
                    <div className={`bg-orange-50 border border-orange-100 rounded-xl p-4`}>
                      <p className="text-sm text-orange-900 font-medium mb-1">{project.challenge.title}</p>
                      <p className="text-xs text-orange-800/80 leading-relaxed">
                        {project.challenge.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Floating buttons */}
      <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 transition-all duration-300 ${
        showFloatingBack ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}>
        <button
          onClick={() => navigate("/portfolio")}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 backdrop-blur-sm border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 rounded-full shadow-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Portfolio</span>
        </button>

        {hasCollapsedRef.current && !profileExpanded && (
          <button
            onClick={() => setProfileExpanded(true)}
            className="p-2.5 bg-slate-800/90 backdrop-blur-sm border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 rounded-full shadow-lg transition-colors"
            title="Show profile card"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

export default ProjectDetail;
