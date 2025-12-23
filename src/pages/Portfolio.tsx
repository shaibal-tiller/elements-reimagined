import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Map, 
  Droplets, 
  ArrowRight, 
  Layers, 
  Workflow, 
  Database, 
  Globe2 
} from 'lucide-react';

const Portfolio: React.FC = () => {
  return (
    <div className="animate-fadeUp">
        <h2 className="text-3xl font-bold mb-8 text-[#02162C]">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Project 1: PLIS-ACCNLDP */}
            <Link to="/portfolio/1" className="group block">
                <div className="card-white p-0 h-full overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-100 flex flex-col">
                    {/* Header / Banner */}
                    <div className="h-48 bg-[#02162C] relative overflow-hidden p-6 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500 rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
                        
                        <div className="flex justify-between items-start z-10">
                            <span className="bg-lime-500/20 text-lime-400 border border-lime-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                Govt. GIS Platform
                            </span>
                            <Map className="text-slate-400 group-hover:text-lime-400 transition-colors" />
                        </div>

                        <div className="z-10">
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-lime-400 transition-colors">PLIS-ACCNLDP</h3>
                            <p className="text-slate-400 text-sm">Climate Resilient Planning System</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                            A national-scale GIS decision support system for the Bangladesh Planning Commission. It integrates climate risk data into development planning to safeguard infrastructure investments using advanced map layers and automated reporting.
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['React', 'OpenLayers', 'Redux', 'Node.js'].map(tech => (
                                <span key={tech} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center text-lime-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            View Case Study <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Project 2: IUNSD */}
            <Link to="/portfolio/2" className="group block">
                <div className="card-white p-0 h-full overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-100 flex flex-col">
                    {/* Header / Banner */}
                    <div className="h-48 bg-[#004d61] relative overflow-hidden p-6 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
                        
                        <div className="flex justify-between items-start z-10">
                            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                WASH Data Hub
                            </span>
                            <Droplets className="text-slate-400 group-hover:text-cyan-300 transition-colors" />
                        </div>

                        <div className="z-10">
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Project IUNSD</h3>
                            <p className="text-slate-300 text-sm">National Sanitation Database</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                            A landmark WASH sector project for DPHE visualizing sanitation value chains via complex Sankey charts (SFD). Features real-time IMIS integration and city-wide inclusive sanitation (CWIS) modeling.
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['React', 'Sankey Charts', 'PostgreSQL', 'Docker'].map(tech => (
                                <span key={tech} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center text-cyan-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            View Case Study <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </div>
            </Link>

        </div>
    </div>
  );
};

export default Portfolio;