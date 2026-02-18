import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import heroBg from "@/assets/bg-image.jpg";
import avatarImg from "@/assets/avatar.jpg";
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Play, Mail } from 'lucide-react';
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

    const collapsed = sidebarCollapsed && isDetailPage;
    const isHomePage = location.pathname === '/';

    return (
        <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
            <div className="bg-[#02162C] pb-2 md:pb-6 font-sans">
                {/* Fixed Header */}
                <div className="shadow-lg fixed top-0 left-0 right-0 bg-[#02162C] p-3 pb-0 z-[99]">
                    <Navbar />
                </div>

                <div className="pt-[90px]">
                    {/* Parallax/Hero Section - hidden on mobile, shown on desktop */}
                    <section className="hidden md:block w-[90%] mx-auto h-[55vh] rounded-2xl overflow-hidden shadow-2xl relative">
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

                    {/* Mobile Layout */}
                    <div className="md:hidden w-[96%] mx-auto relative z-20">
                        {isHomePage ? (
                            <>
                                {/* Home: full profile card + hero with bg */}
                                <div className="flex justify-center mb-4">
                                    <ProfileCard />
                                </div>
                                <section className="relative rounded-2xl overflow-hidden mb-4">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${heroBg})` }}
                                    />
                                    <div className="absolute inset-0 bg-[#02162C]/70" />
                                    <div className="relative z-10 px-5 py-8">
                                        <HeroComponent />
                                    </div>
                                </section>
                            </>
                        ) : (
                            /* Other pages: compact profile strip */
                            <div className="relative rounded-2xl overflow-hidden mb-4">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${heroBg})` }}
                                />
                                <div className="absolute inset-0 bg-[#02162C]/80" />
                                <div className="relative z-10 flex items-center gap-3 px-4 py-3">
                                    <Link to="/" className="flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-slate-600/50">
                                            <img src={avatarImg} alt="Sharif Shaibal" className="w-full h-full object-cover" />
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to="/" className="text-sm font-bold text-white leading-tight hover:text-primary transition-colors">
                                            Sharif Shaibal
                                        </Link>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                                            Software Engineer &bull; Full Stack Developer
                                        </p>
                                    </div>
                                    <a
                                        href="https://wa.me/8801521330598"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 py-1.5 px-4 bg-lime-500 active:bg-lime-400
                                                 text-slate-900 font-bold rounded-full text-[11px] flex items-center gap-1.5"
                                    >
                                        Contact
                                        <Mail className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}
                        <section className="space-y-4 min-w-0">
                            <Outlet />
                        </section>
                    </div>

                    {/* Desktop Layout: Sidebar grid */}
                    <main
                        className="hidden md:grid w-[90%] mx-auto relative z-20"
                        style={{
                            marginTop: '-27.5vh',
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

                        {/* Right Column: Page Content */}
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
