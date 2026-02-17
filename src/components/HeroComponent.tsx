import { Play, X } from 'lucide-react'
import React, { useState } from 'react'
import { useResume } from '@/hooks/useResume'
import { getGDriveEmbedUrl } from '@/lib/mediaUtils'

const HeroComponent = () => {
    const [showVideoModal, setShowVideoModal] = useState(false);
    const { data: resume } = useResume();

    const videoUrl = resume?.videoResumeUrl || '';
    const embedUrl = videoUrl ? (getGDriveEmbedUrl(videoUrl) || videoUrl) : '';

    return (
        <div>
            <p className="section-title text-primary mb-4 animate-fadeUp">
                Software Engineer &bull; Full Stack Developer
            </p>
            <h1 className="heading-xl text-foreground mb-8 animate-fadeUp" >
                Building ideas into{" "}
                <span className="block">digital reality.</span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12 animate-fadeUp" >
                <button
                    onClick={() => setShowVideoModal(true)}
                    className="btn-lime flex items-center gap-3"
                >
                    <Play className="w-4 h-4" />
                    Video Resume
                </button>
            </div>

            {/* Video Modal */}
            {showVideoModal && embedUrl && (
                <div
                    data-overlay
                    className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center animate-fadeIn"
                    onClick={() => setShowVideoModal(false)}
                >
                    <div
                        className="relative w-[90vw] max-w-4xl aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowVideoModal(false)}
                            className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe
                            src={embedUrl}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroComponent
