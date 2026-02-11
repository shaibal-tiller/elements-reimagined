import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import heroBg from "@/assets/bg-image.jpg";
import { Outlet, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import HeroComponent from '@/components/HeroComponent';
import SidebarContext from '@/contexts/SidebarContext';

const MainLayout: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    // Reset sidebar when navigating away from a project detail page
    const isDetailPage = /^\/portfolio\/[^/]+$/.test(location.pathname);
    useEffect(() => {
        if (!isDetailPage) {
            setSidebarCollapsed(false);
        }
    }, [location.pathname, isDetailPage]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallaxOffset = scrollY * 0.5;
    const stickyTop = '100px';
    const overlapMargin = '-27.5vh';

    const collapsed = sidebarCollapsed && isDetailPage;

    return (
        <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
            <div className=" bg-[#02162C] pb-16 font-sans">
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
                        className="w-[90%] mx-auto grid grid-cols-1 md:grid relative z-20"
                        style={{
                            marginTop: overlapMargin,
                            gridTemplateColumns: collapsed ? '0fr 1fr' : '3fr 7fr',
                            gap: collapsed ? 0 : '1.5rem',
                            transition: 'grid-template-columns 0.7s cubic-bezier(0.4, 0, 0.2, 1), gap 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {/* Left Column: Sticky Profile Card */}
                        <aside className="h-full min-w-0">
                            <div
                                className="sticky p-6 pt-0 rounded-2xl shadow-xl flex items-center justify-center text-center text-white text-2xl font-bold"
                                style={{
                                    top: stickyTop,
                                    opacity: collapsed ? 0 : 1,
                                    transform: collapsed ? 'translateX(-2rem) scale(0.96)' : 'translateX(0) scale(1)',
                                    transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    pointerEvents: collapsed ? 'none' : 'auto',
                                }}
                            >
                                <ProfileCard />
                            </div>
                        </aside>

                        {/* Right Column: Page Content (Outlet renders child routes) */}
                        <section className="space-y-6 min-w-0">
                            <HeroComponent />
                            <Outlet />
                        </section>
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};

export default MainLayout;
