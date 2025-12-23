import { Play } from 'lucide-react'
import React from 'react'

const HeroComponent = () => {
    return (
        <div>
            <p className="section-title text-primary mb-4 animate-fadeUp">
                Hi my new friend!
            </p>
            <h1 className="heading-xl text-foreground mb-8 animate-fadeUp" >
                Discover my <span className="block">art space!</span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12 animate-fadeUp" >
                <button className="btn-lime flex items-center gap-3">
                    <Play className="w-4 h-4" />
                    Video Resume
                </button>
            </div></div>
    )
}

export default HeroComponent