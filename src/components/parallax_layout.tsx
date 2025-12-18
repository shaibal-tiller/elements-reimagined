import React, { useState, useEffect } from 'react';
import { RefreshCcw, Home, LayoutList, BookOpen, ScrollText, Play, Mouse } from 'lucide-react'; // Icons for visual appeal
import ProfileCard from './ProfileCard';
// import heroBg from "@/assets/hero-bg.jpg"
import heroBg from "@/assets/bg-image.jpg";
import StorySection from './StorySection';
import Navbar from './Navbar';
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Divider from './divider';
import Footer from './Footer';


const stats = [
  { number: "74+", label: "Completed Projects" },
  { number: "50+", label: "Happy Customers" },
  { number: "14+", label: "Honors and Awards" },
];

// Define the main React component
const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  // Hook for handling the scroll offset for the parallax effect
  useEffect(() => {
    const handleScroll = () => {

      // Update the state with the current vertical scroll position
      setScrollY(window.scrollY);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax Calculation: Moves the background position slowly (0.3x speed of scroll)
  // This gives the effect of the foreground content moving faster than the background.
  const parallaxOffset = scrollY * 0.5;

  // Header height is 75px. Top margin is 5px.
  // The sticky card must start sticking at 75px + 5px = 80px from the top of the viewport.
  const stickyTop = '80px';

  // New calculation: The parallax section is 55vh. To overlap by half, we use -27.5vh margin.
  const overlapMargin = '-27.5vh';

  return (
    // Overall page container with the specified background color
    <div className="min-h-[250vh] bg-[#02162C] pb-16 font-sans">

      {/* 1. FIXED HEADER (75px height, 5px margins) */}
      <div className="shadow-lg fixed top-0 left-0 right-0 bg-[#02162C]  p-3 pb-0 z-[99]">
        <Navbar />
      </div>

      {/* Padding to push the main content down, clearing the fixed header area */}
      <div className="pt-[90px]">

        {/* 2. PARALLAX/HERO SECTION (55vh height, 90% width) */}
        {/* Removed mb-8 to facilitate clean overlap */}
        <section
          className="w-[90%] mx-auto h-[55vh] rounded-2xl overflow-hidden shadow-2xl relative"
        >
          {/* Background Image Container for Parallax Effect */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
            style={{
              backgroundImage: `url(${heroBg})`,
              // The key to the parallax effect: move the background position slowly using the scroll offset
              backgroundPositionY: `calc(50% + ${-parallaxOffset}px)`,
              backgroundPositionX: `50px`,
              height: '150%', // Make container taller to allow movement range
              top: '-25%',     // Offset initial position to center the image
            }}
          />
          {/* Hero Content Box (Colored Box over the image) */}

          {/* <div className="relative z-10 flex flex-col items-center justify-center h-full backdrop-blur-sm bg-black/40 p-8">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              <ScrollText size={40} className="inline mr-3" /> Parallax Background
            </h1>
            <p className="text-xl text-indigo-200">
              The main grid structure now overlaps this section by 50% (27.5vh).
            </p>
            <p className="text-sm text-yellow-300 mt-4">
              (Scroll Offset: {scrollY.toFixed(0)}px)
            </p>
          </div> */}
        </section>

        {/* 3. MAIN CONTENT GRID (30%/70% layout, now overlapping the section above) */}
        <main
          className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 relative z-20"
          style={{ marginTop: overlapMargin }} // APPLY NEGATIVE MARGIN for 50% overlap
        >

          {/* LEFT COLUMN: Sticky Card (30% width) */}
          <aside className="h-full">
            <div
              className={`sticky p-6 pt-0 rounded-2xl shadow-xl transition-all duration-300
                          flex items-center justify-center text-center text-white text-2xl font-bold`}
              style={{ top: stickyTop }} // Stick exactly below the fixed header 
            >
              <ProfileCard />
            </div>
          </aside>

          {/* RIGHT COLUMN: Scrollable Pages (70% width) */}
          {/* THIS IS THE MAIN CONTENT SECTION WHICH WILL BE INPLEMENTED IN LAYOUT */}
          <section className="space-y-6">

            <p className="section-title text-primary mb-4 animate-fadeUp">
              Hi my new friend!
            </p>
            <h1 className="heading-xl text-foreground mb-8 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
              Discover my{" "}
              <span className="block">art space!</span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12 animate-fadeUp" style={{ animationDelay: "0.2s" }}>
              <button className="btn-lime flex items-center gap-3">
                <Play className="w-4 h-4" />
                Video Resume
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="card-white p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl md:text-5xl font-bold text-primary">{stat.number}</div>
                  <Divider color="#e5e7eb76" />
                  <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* <div className="scroll-indicator hidden lg:flex">
              <Mouse className="w-5 h-5 mb-2 animate-bounce" />
              <span>Scroll Down</span>
            </div> */}
            <StorySection />
            <ServicesSection />
            <TestimonialsSection />
            <ContactSection />




          </section>

        </main>
      </div>
    </div>
  );
};

export default App;