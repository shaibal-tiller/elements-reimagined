import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projectsData';

const Portfolio: React.FC = () => {
  return (
    <div className="animate-fadeUp">
      <h2 className="text-3xl font-bold mb-8 text-[#f1f1f1]">Featured Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => {
          const BannerIcon = project.bannerIcon;

          return (
            <Link key={project.id} to={`/portfolio/${project.id}`} className="group block">
              <div className="card-white p-0 h-full overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-100 flex flex-col">
                {/* Header / Banner */}
                <div className={`h-48 ${project.theme.bgMain} relative overflow-hidden p-6 flex flex-col justify-between`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${project.theme.accentBlur} rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/4`}></div>

                  <div className="flex justify-between items-start z-10">
                    <span className={`${project.theme.pillBg} ${project.theme.pillText} border ${project.theme.pillBorder} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm`}>
                      {project.category}
                    </span>
                    <BannerIcon className={`text-slate-400 group-hover:${project.theme.pillText} transition-colors`} />
                  </div>

                  <div className="z-10">
                    <h3 className={`text-2xl font-bold text-white mb-1 group-hover:${project.theme.pillText} transition-colors`}>
                      {project.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{project.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {project.overview.split('.')[0]}.
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.frontend.slice(0, 4).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className={`flex items-center font-semibold text-sm group-hover:translate-x-1 transition-transform`} style={{ color: project.theme.textMain }}>
                    View Case Study <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;