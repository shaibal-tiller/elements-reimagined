import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StorySection from '@/components/StorySection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Divider from '@/components/divider';
import { useProjects } from '@/hooks/useProjects';
import { resolveThemeStyles } from '@/lib/twColors';
import { isVideo } from '@/lib/mediaUtils';
import { Project } from '@/types/firebase';

const stats = [
  { number: "74+", label: "Completed Projects" },
  { number: "50+", label: "Happy Customers" },
  { number: "14+", label: "Honors and Awards" },
];

const FeaturedProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const ts = resolveThemeStyles(project.theme);
  const coverImg = useMemo(() => {
    const dedicated = (project.coverMedia || []).filter(m => m.src && !isVideo(m));
    if (dedicated.length > 0) return dedicated[0].src;
    const imgs = (project.images || []).filter(m => m.src && !isVideo(m));
    return imgs.length > 0 ? imgs[0].src : null;
  }, [project.coverMedia, project.images]);

  return (
    <Link to={`/portfolio/${project.slug}`} className="group block flex-shrink-0 w-[75vw] md:w-auto">
      <div className="h-full overflow-hidden rounded-2xl border border-slate-700/50 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
        {/* Image / themed banner */}
        <div className="h-32 md:h-40 relative overflow-hidden" style={ts.bgMain}>
          {coverImg ? (
            <>
              <img src={coverImg} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 -translate-y-1/2 translate-x-1/4" style={ts.accentBlur} />
          )}
          <span className="absolute top-3 left-3 border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm" style={{ ...ts.pillBg, ...ts.pillBorder, ...ts.pillText }}>
            {project.category}
          </span>
        </div>
        {/* Content */}
        <div className="p-4 bg-[#00283A] flex flex-col">
          <h4 className="text-sm font-bold text-foreground mb-1 truncate">{project.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed h-8 line-clamp-2">{project.subtitle}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.techStack.frontend.slice(0, 3).map(tech => (
              <span key={tech.name} className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded font-medium">
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

const Index: React.FC = () => {
  const { data: projects } = useProjects();
  const featuredProjects = useMemo(() => (projects || []).slice(0, 4), [projects]);

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-6 mt-4 md:mt-8 animate-fadeUp" >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card-white p-3 md:p-6 text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="text-2xl md:text-5xl font-bold text-primary">{stat.number}</div>
            <Divider color="#e5e7eb76" />
            <div className="text-[9px] md:text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <StorySection />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="pt-8 md:pt-12 bg-[#02162C] animate-fadeUp">
          <div className="container mx-auto px-3 md:px-6">
            <div className="flex items-center justify-between gap-4 mb-5 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap shrink-0">Featured Projects</h2>
              <Divider />
            </div>
            <div className="flex items-center justify-end mb-4">
              <Link to="/portfolio" className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Mobile: horizontal scroll, Desktop: grid */}
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:hidden no-scrollbar">
              {featuredProjects.map(p => (
                <div key={p.id} className="snap-start">
                  <FeaturedProjectCard project={p} />
                </div>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {featuredProjects.map(p => (
                <FeaturedProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
};

export default Index;