import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import heroBg from "@/assets/bg-image.jpg";
import { Outlet } from 'react-router-dom';
import { Play } from 'lucide-react';
import HeroComponent from '@/components/HeroComponent';

const MainLayout: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallaxOffset = scrollY * 0.5;
    const stickyTop = '80px';
    const overlapMargin = '-27.5vh';

    return (
        <div className="min-h-[250vh] bg-[#02162C] pb-16 font-sans">
            {/* Fixed Header */}
            <div className="shadow-lg fixed top-0 left-0 right-0 bg-[#02162C] p-3 pb-0 z-[99]">
                <Navbar />
            </div>

            <div className="pt-[90px]">
                {/* Parallax/Hero Section */}
                <section className="w-[90%] mx-auto h-[55vh] rounded-2xl overflow-hidden shadow-2xl relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
                        style={{
                            backgroundImage: `url(${heroBg})`,
                            backgroundPositionY: `calc(50% + ${-parallaxOffset}px)`,
                            backgroundPositionX: `50px`,
                            height: '150%',
                            top: '-25%',
                        }}
                    />
                </section>

                {/* Main Content Grid */}
                <main
                    className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 relative z-20"
                    style={{ marginTop: overlapMargin }}
                >
                    {/* Left Column: Sticky Profile Card */}
                    <aside className="h-full">
                        <div
                            className="sticky p-6 pt-0 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center text-center text-white text-2xl font-bold"
                            style={{ top: stickyTop }}
                        >
                            <ProfileCard />
                        </div>
                    </aside>

                    {/* Right Column: Page Content (Outlet renders child routes) */}
                    <section className="space-y-6">
                        <HeroComponent />
                        <Outlet />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;