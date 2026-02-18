import React, { useState } from 'react';
import { Maximize2, Play } from 'lucide-react';
import { isVideo, isEmbedVideo } from '../../lib/mediaUtils';

const GallerySection = ({
  images,
  theme,
  onImageClick,
}: {
  images: { src: string; caption: string; details: string }[];
  theme: any;
  onImageClick: (idx: number) => void;
}) => {
  const [paused, setPaused] = useState(false);

  if (images.length === 0) return null;

  const mid = Math.ceil(images.length / 2);
  const row1 = images.length <= 2 ? images : images.slice(0, mid);
  const row2 = images.length <= 2 ? [] : images.slice(mid);

  const speed = images.length <= 3 ? '40s' : '50s';

  const renderCard = (img: typeof images[0], idx: number, globalIdx: number) => {
    const isVid = isVideo(img);
    const isEmbed = isEmbedVideo(img.src);
    return (
      <div
        key={`${globalIdx}-${idx}`}
        className="flex-shrink-0 group/card relative cursor-pointer rounded-xl overflow-hidden shadow-md border border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        style={{ width: images.length === 1 ? '100%' : images.length === 2 ? 340 : 300, height: images.length === 1 ? 280 : 200 }}
        onClick={() => onImageClick(globalIdx)}
      >
        {isVid ? (
          isEmbed ? (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <Play className="w-10 h-10 text-white/60" />
            </div>
          ) : (
            <video src={img.src} muted loop playsInline className="w-full h-full object-cover" />
          )
        ) : (
          <img src={img.src} alt={img.caption} loading="lazy" className="w-full h-full object-cover" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white text-xs font-medium truncate">{img.caption}</p>
          <div className="flex items-center gap-1 mt-1 text-white/70">
            <Maximize2 className="w-3 h-3" />
            <span className="text-[10px]">Click to view</span>
          </div>
        </div>
        {isVid && !isEmbed && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
            <Play className="w-3 h-3 text-white fill-white" />
          </div>
        )}
      </div>
    );
  };

  if (images.length === 1) {
    return (
      <section>
        <h3 className="text-xl font-bold mb-6" style={{ color: theme.textMain }}>System Visuals</h3>
        {renderCard(images[0], 0, 0)}
      </section>
    );
  }

  if (images.length === 2) {
    return (
      <section>
        <h3 className="text-xl font-bold mb-6" style={{ color: theme.textMain }}>System Visuals</h3>
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => renderCard(img, idx, idx))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: theme.textMain }}>System Visuals</h3>
        <button
          onClick={() => setPaused((p) => !p)}
          className="text-xs font-medium text-slate-400 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <style>{`
        @keyframes gallery-slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gallery-slide-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div
        className="space-y-4 overflow-hidden rounded-2xl shadow-md md:shadow-none border border-slate-200 md:border-0 p-2 md:p-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Row 1 — slides left */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 w-max"
            style={{
              animation: `gallery-slide-left ${speed} linear infinite`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {row1.map((img, idx) => renderCard(img, idx, idx))}
            {row1.map((img, idx) => renderCard(img, idx + row1.length, idx))}
          </div>
        </div>

        {/* Row 2 — slides right */}
        {row2.length > 0 && (
          <div className="overflow-hidden">
            <div
              className="flex gap-4 w-max"
              style={{
                animation: `gallery-slide-right ${speed} linear infinite`,
                animationPlayState: paused ? 'paused' : 'running',
              }}
            >
              {row2.map((img, idx) => renderCard(img, idx, mid + idx))}
              {row2.map((img, idx) => renderCard(img, idx + row2.length, mid + idx))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
