import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  FolderX,
  Play,
} from 'lucide-react';
import { isVideo, isEmbedVideo, getEmbedUrl } from '../lib/mediaUtils';
import { useProject } from '../hooks/useProject';
import { ProjectDetailSkeleton } from '../components/skeletons';
import { resolveTechPillStyles } from '../lib/twColors';
import { useSidebar } from '../contexts/SidebarContext';

// --- IMAGE VIEWER COMPONENT ---

const ImageViewer = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
  const currentImage = images[currentIndex];

  useEffect(() => { setShowDetails(false); }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index, e) => {
    e?.stopPropagation();
    setCurrentIndex(index);
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 top-16 z-[1000] bg-black/90 backdrop-blur-md flex flex-col animate-fadeIn overflow-hidden"
      onClick={handleBackdropClick}
    >

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 text-white z-20" onClick={e => e.stopPropagation()}>
        <span className="text-sm font-medium tracking-wider opacity-80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 bg-black/40 hover:bg-white/20 border border-white/10 rounded-full transition-colors backdrop-blur-md group"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center w-full min-h-0">

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group"
          onClick={e => { e.stopPropagation(); prevImage(e) }}
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group"
          onClick={e => { e.stopPropagation(); nextImage(e) }}
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Media Container — fills remaining space, never overflows */}
        <div
          className={`relative w-full transition-all duration-500 ease-in-out flex items-center justify-center min-h-0 ${showDetails ? 'flex-[0_0_35vh] mt-4' : 'flex-1'}`}
          onClick={e => e.stopPropagation()}
        >
          {isVideo(currentImage) ? (
            isEmbedVideo(currentImage.src) ? (
              <iframe
                key={currentIndex}
                src={getEmbedUrl(currentImage.src) || currentImage.src}
                className="max-h-full w-[90%] aspect-video shadow-2xl rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={currentIndex}
                src={currentImage.src}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-[90%] object-contain shadow-2xl"
              />
            )
          ) : (
            <img
              src={currentImage.src}
              alt={currentImage.caption}
              className="max-h-full max-w-[90%] object-contain shadow-2xl"
            />
          )}
        </div>

        {/* Slide-up Details Panel — starts fully off-screen, slides to caption peek, then full details */}
        {currentImage.caption && (
          <div
            className={`absolute left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 text-white flex flex-col transition-all duration-500 ease-in-out ${showDetails ? 'bottom-0 h-[55vh]' : 'bottom-0 h-14'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Toggle handle */}
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="absolute -top-5 left-1/2 -translate-x-1/2 p-2 bg-slate-800 text-white rounded-full shadow-lg border border-white/10 hover:bg-slate-700 transition-colors z-10"
            >
              {showDetails ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5 animate-bounce" />
              )}
            </button>

            {/* Collapsed caption bar */}
            {!showDetails && (
              <div
                className="flex items-center justify-center h-14 cursor-pointer px-6"
                onClick={() => setShowDetails(true)}
              >
                <span className="text-white font-medium text-sm md:text-base truncate">{currentImage.caption}</span>
              </div>
            )}

            {/* Expanded details */}
            {showDetails && (
              <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-4">
                <div className="max-w-4xl mx-auto w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      {isVideo(currentImage) ? 'Media Details' : 'Image Details'}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{currentImage.caption}</h3>
                  <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">{currentImage.details}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Thumbnails Strip */}
      <div className={`flex-shrink-0 w-full flex items-center justify-center gap-2 overflow-x-auto px-4 py-2 z-20 transition-all duration-300 ${showDetails ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={(e) => selectImage(idx, e)}
            className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 border ${idx === currentIndex ? 'border-cyan-400 opacity-100 scale-110' : 'border-white/20 opacity-40 hover:opacity-80'
              }`}
          >
            {isVideo(img) ? (
              <>
                <video src={img.src} muted preload="metadata" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white drop-shadow" />
                </div>
              </>
            ) : (
              <img src={img.src} alt="thumb" className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- GALLERY CAROUSEL COMPONENT ---

const GallerySection = ({
  images,
  theme,
  onImageClick,
}: {
  images: { src: string; caption: string; details: string }[];
  theme: any;
  onImageClick: (idx: number) => void;
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  // Keep the active thumbnail scrolled into view
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeIdx] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIdx]);

  if (images.length === 0) return null;

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);
  const current = images[activeIdx];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold`} style={{ color: theme.textMain }}>System Visuals</h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {activeIdx + 1} / {images.length}
        </span>
      </div>

      {/* Featured Media */}
      <div className="relative group rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
        <div
          className="aspect-[16/9] cursor-pointer relative"
          onClick={() => onImageClick(activeIdx)}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
              style={{ opacity: idx === activeIdx ? 1 : 0, pointerEvents: idx === activeIdx ? 'auto' : 'none' }}
            >
              {isVideo(img) ? (
                isEmbedVideo(img.src) ? (
                  <iframe
                    src={getEmbedUrl(img.src) || img.src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={img.src}
                    controls
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ))}

          {/* Hover overlay (only for non-embed items) */}
          {!isEmbedVideo(current.src) && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs font-medium border border-white/20 flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                View full size
              </div>
            </div>
          )}
        </div>

        {/* Caption bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
          <p className="text-white text-sm font-medium truncate">{current.caption}</p>
          {current.details && (
            <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{current.details}</p>
          )}
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="mt-3 relative">
          <div
            ref={thumbStripRef}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 shadow-sm ${
                  idx === activeIdx
                    ? 'ring-2 ring-current/20 scale-105'
                    : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                }`}
                style={{
                  width: 80,
                  height: 52,
                  ...(idx === activeIdx ? { borderColor: theme.textMain, '--tw-ring-color': theme.textMain } as React.CSSProperties : {}),
                }}
              >
                {isVideo(img) ? (
                  <>
                    <video src={img.src} muted preload="metadata" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 text-white fill-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>

          {/* Fade edges when scrollable */}
          <div className="absolute left-0 top-0 bottom-1 w-6 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-1 w-6 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        </div>
      )}
    </section>
  );
};

// --- MAIN COMPONENT ---

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { setCollapsed } = useSidebar();
  const contextSectionRef = useRef<HTMLElement>(null);

  const { data: project, isLoading, error, refetch } = useProject(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Collapse sidebar when "Project Context" section scrolls past mid-screen
  useEffect(() => {
    const el = contextSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Section is crossing the mid-screen line → keep sidebar open
          setCollapsed(false);
        } else if (entry.boundingClientRect.bottom < window.innerHeight / 2) {
          // Section has scrolled above mid-screen → collapse
          setCollapsed(true);
        }
      },
      // Shrink root to a thin line at vertical center of viewport
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      setCollapsed(false);
    };
  }, [project, setCollapsed]);

  // Cover media slideshow: starts at -1 (themed bg), then loops through coverMedia
  const coverMedia = project?.coverMedia || [];
  const [coverIdx, setCoverIdx] = useState(-1);
  const hasShownCoverRef = useRef(false);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset on project change
    setCoverIdx(-1);
    hasShownCoverRef.current = false;
    isPausedRef.current = false;

    if (coverMedia.length === 0) return;

    const tick = () => {
      if (isPausedRef.current) return;
      setCoverIdx((prev) => {
        if (!hasShownCoverRef.current) {
          // First tick: move from cover bg (-1) to first media item (0)
          hasShownCoverRef.current = true;
          return 0;
        }
        // Subsequent ticks: loop through 0..length-1
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
                      <video
                        src={media.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <img
                      src={media.src}
                      alt={media.caption || ""}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {/* Dark overlay for readability (only when showing media) */}
              <div
                className="absolute inset-0 bg-black/50 transition-opacity duration-700"
                style={{ opacity: coverIdx >= 0 ? 1 : 0 }}
              />
            </>
          )}

          <div className="container mx-auto px-6 pt-6 pb-16 relative z-10 ">
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
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.bgGradient} text-3xl md:text-5xl`}>
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
                <h2 className={`text-2xl font-bold ${theme.textMain} mb-6 flex items-center gap-3`}>
                  <div className={`w-2 h-8 ${theme.accentBlur} rounded-full`}></div>
                  Project Context
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.overview}
                </div>
              </section>

              <section>
                <h3 className={`text-xl font-bold ${theme.textMain} mb-6`}>System Modules & Features</h3>
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
                  <h3 className={`text-lg font-bold ${theme.textMain} mb-4 flex items-center gap-2`}>
                    <project.bannerIcon className={`w-5 h-5`} style={{ color: theme.primary }} />
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
                            {project.techStack[key].map((tech) => (
                              <span key={tech} className="px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-default backdrop-blur-sm" style={pillStyle}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className={`text-lg font-bold ${theme.textMain} mb-4 flex items-center gap-2`}>
                      <project.bannerIcon className={`w-5 h-5`} style={{ color: theme.primary }} />
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
    </>
  );
};

const MarqueeRow = ({ icons, direction, duration }) => {
  const IconList = () => (
    <>
      {icons.map((Icon, idx) => <Icon key={idx} className="w-12 h-12 text-slate-900" />)}
    </>
  );

  return (
    <div
      className="flex gap-12 min-w-max"
      style={{
        animation: `marquee-${direction} ${duration} linear infinite`
      }}
    >
      <IconList />
      <IconList />
      <IconList />
      <IconList />
    </div>
  );
};

export default ProjectDetail;