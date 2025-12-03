import { Play, ChevronDown, Mouse } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ProfileCard from "./ProfileCard";

const stats = [
  { number: "74+", label: "Completed Projects" },
  { number: "50+", label: "Happy Customers" },
  { number: "14+", label: "Honors and Awards" },
];

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Profile Card - Left Side */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <ProfileCard />
          </div>

          {/* Hero Content - Right Side */}
          <div className="lg:col-span-8 text-center lg:text-left">
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="card-white p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl md:text-5xl font-bold text-primary">{stat.number}</div>
                  <div className="divider-dotted my-3" />
                  <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator hidden lg:flex">
        <Mouse className="w-5 h-5 mb-2 animate-bounce" />
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

export default HeroSection;
