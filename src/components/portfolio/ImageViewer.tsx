import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Play,
} from 'lucide-react';
import { isVideo, isEmbedVideo, getEmbedUrl } from '../../lib/mediaUtils';

const ImageViewer = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
  const currentImage = images[currentIndex];
  useEffect(() => { setShowDetails(false); }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDetails) setShowDetails(false);
        else onClose();
      }
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showDetails]);

  useEffect(() => {
    const blockScroll = (e) => e.preventDefault();
    window.addEventListener('wheel', blockScroll, { passive: false });
    return () => window.removeEventListener('wheel', blockScroll);
  }, []);

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
      if (showDetails) {
        setShowDetails(false);
      } else {
        onClose();
      }
    }
  };

  return (
    <div
      data-overlay
      className="fixed inset-0 top-16 z-[1000] bg-black/90 backdrop-blur-md flex flex-col animate-fadeIn overflow-hidden"
      onClick={handleBackdropClick}
    >

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 text-white z-20" onClick={e => e.stopPropagation()}>
        <span className="text-sm font-medium tracking-wider opacity-80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={showDetails ? undefined : onClose}
          disabled={showDetails}
          className={`p-2 bg-black/40 border border-white/10 rounded-full transition-colors backdrop-blur-md group ${
            showDetails ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20"
          }`}
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

        {/* Media Container */}
        <div
          className={`relative w-full transition-all duration-500 ease-in-out flex items-center justify-center min-h-0 ${showDetails ? 'flex-[0_0_35vh] mt-4' : 'flex-1'}`}
          style={{ paddingBottom: !showDetails && currentImage.caption ? '3.5rem' : 0 }}
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
                controlsList="nodownload"
                className="max-h-full max-w-[90%] object-contain shadow-2xl rounded-lg"
              />
            )
          ) : (
            <img
              key={currentIndex}
              src={currentImage.src}
              alt={currentImage.caption}
              className="max-h-full max-w-[90%] object-contain shadow-2xl"
            />
          )}
        </div>

        {/* Slide-up Details Panel */}
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
                <div className="w-full h-full bg-slate-800" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white drop-shadow" />
                </div>
              </>
            ) : (
              <img src={img.src} alt="thumb" loading="lazy" className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
