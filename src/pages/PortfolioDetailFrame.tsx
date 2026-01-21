import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { projects } from '../data/projectsData';

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
      className="fixed top-16 inset-0 z-[1000] bg-black/90 backdrop-blur-md flex flex-col animate-fadeIn"
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
      <div className="flex-1 relative flex flex-col items-center justify-center w-full h-full overflow-hidden">

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

        {/* Image Container */}
        <div
          className={`relative w-full transition-all duration-500 ease-in-out flex items-center justify-center ${showDetails ? 'h-[35vh] mt-4' : 'h-[75vh]'}`}
          onClick={e => e.stopPropagation()}
        >
          <img
            src={currentImage.src}
            alt={currentImage.caption}
            className="h-full w-auto object-contain max-w-[90%] shadow-2xl"
          />
        </div>

        {/* Caption Bar (Visible when details hidden) */}
        {!showDetails && (
          <div
            className="absolute bottom-24 left-0 right-0 z-30 flex justify-center pointer-events-none"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center gap-4 pointer-events-auto hover:bg-black/70 transition-colors cursor-pointer" onClick={() => setShowDetails(true)}>
              <span className="text-white font-medium text-sm md:text-base">{currentImage.caption}</span>
              <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <ChevronUp className="w-4 h-4 text-white animate-bounce" />
              </button>
            </div>
          </div>
        )}

        {/* Slide-up Details Panel */}
        <div
          className={`absolute -bottom-6 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 text-white p-8 md:p-12 flex flex-col transition-transform duration-500 ease-in-out h-[55vh] ${showDetails ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setShowDetails(false)}
            className="absolute -top-5 left-1/2 -translate-x-1/2 p-2 bg-slate-800 text-white rounded-full shadow-lg border border-white/10 hover:bg-slate-700 transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="max-w-4xl mx-auto w-full overflow-y-auto pr-4 custom-scrollbar">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-cyan-400 rounded-full"></div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Image Details</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{currentImage.caption}</h3>
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">{currentImage.details}</p>
          </div>
        </div>

      </div>

      {/* Thumbnails Strip */}
      <div className={`h-20 w-full flex items-center justify-center gap-2 overflow-x-auto px-4 py-2 z-20 transition-all duration-300 ${showDetails ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={(e) => selectImage(idx, e)}
            className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 border ${idx === currentIndex ? 'border-cyan-400 opacity-100 scale-110' : 'border-white/20 opacity-40 hover:opacity-80'
              }`}
          >
            <img src={img.src} alt="thumb" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-[200px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <button onClick={() => navigate('/portfolio')} className="text-primary hover:underline">
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const { theme } = project;

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
        <div className={`relative ${theme.bgMain} text-white overflow-hidden rounded-xl`}>
          <div className="absolute inset-0 opacity-10">
            <div className={`absolute right-0 top-0 w-[600px] h-[600px] ${theme.accentBlur} rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4`}></div>
            <div className={`absolute left-10 bottom-0 w-[400px] h-[400px] ${theme.accentBlur} rounded-full blur-[100px] translate-y-1/2`}></div>
          </div>

          <div className="container mx-auto px-6 pt-6 pb-16 relative z-10">
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

              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
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

              <section>
                <h3 className={`text-xl font-bold ${theme.textMain} mb-6`}>System Visuals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className="group relative aspect-video bg-slate-200 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white border border-white/30">
                          <Maximize2 className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity truncate text-sm font-medium">
                        {img.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-24 overflow-hidden relative">
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
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Frontend</p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.frontend.map((tech) => (
                          <span key={tech} className={`px-3 py-1 ${theme.pillBg} ${theme.pillBorder} rounded-lg text-xs font-medium border transition-colors cursor-default backdrop-blur-sm`} style={{ color: theme.textMain }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Backend</p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.backend.map((tech) => (
                          <span key={tech} className={`px-3 py-1 ${theme.pillBg} ${theme.pillBorder} rounded-lg text-xs font-medium border transition-colors cursor-default backdrop-blur-sm`} style={{ color: theme.textMain }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">DevOps & Tools</p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.devops.map((tech) => (
                          <span key={tech} className={`px-3 py-1 ${theme.pillBg} ${theme.pillBorder} rounded-lg text-xs font-medium border transition-colors cursor-default backdrop-blur-sm`} style={{ color: theme.textMain }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
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