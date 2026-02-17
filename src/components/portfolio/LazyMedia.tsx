import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

const LazyMedia = ({
  src,
  alt = "",
  type,
  className = "",
  wrapperClassName = "",
  videoProps = {},
}: {
  src: string;
  alt?: string;
  type: "image" | "video";
  className?: string;
  wrapperClassName?: string;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  const spinner = !loaded && !error && (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 pointer-events-none">
      <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
    </div>
  );

  const errorOverlay = error && (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 pointer-events-none">
      <AlertTriangle className="w-5 h-5 text-slate-500" />
    </div>
  );

  if (type === "video") {
    const handleProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (loaded) return;
      const vid = e.currentTarget;
      const buffered = vid.buffered;
      if (buffered.length > 0 && vid.duration > 0) {
        const ratio = buffered.end(buffered.length - 1) / vid.duration;
        if (ratio >= 0.2) setLoaded(true);
      }
    };

    return (
      <div className={`relative ${wrapperClassName}`}>
        {spinner}
        {errorOverlay}
        <video
          src={src}
          preload="auto"
          onProgress={handleProgress}
          onCanPlay={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          {...videoProps}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      {spinner}
      {errorOverlay}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </div>
  );
};

export default LazyMedia;
