import React from 'react';
import { 
  Map, 
  Database, 
  Server, 
  ShieldCheck, 
  FileText, 
  Users, 
  Globe, 
  Calendar, 
  Building2, 
  Landmark,
  Layers,
  Code2,
  Cpu,
  CheckCircle2,
  ArrowUpRight,
  Target
} from 'lucide-react';

const PortfolioDetail = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-[#02162C] text-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-lime-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute left-10 bottom-0 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <span className="inline-flex items-center gap-2 bg-lime-500/10 text-lime-400 border border-lime-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Globe className="w-3 h-3" /> National GIS Platform
            </span>
            <div className="flex items-center gap-6 mt-4 md:mt-0 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 2022 - 2023
              </span>
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Tiller
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            PLIS: Climate Resilient <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              Planning Information System
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10">
            A specialized digital platform designed to integrate climate risk data into Bangladesh's national development planning, safeguarding infrastructure investments against climate-induced disasters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Client</p>
              <div className="flex items-center gap-2 font-semibold">
                <Landmark className="w-5 h-5 text-lime-400" />
                Bangladesh Planning Commission
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Funded By</p>
              <div className="flex items-center gap-2 font-semibold">
                <Users className="w-5 h-5 text-lime-400" />
                GIZ (Germany)
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Impact Goal</p>
              <div className="flex items-center gap-2 font-semibold">
                <Target className="w-5 h-5 text-lime-400" />
                Delta Plan 2100 & Vision 2041
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Project Overview */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-[#02162C] mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-lime-500 rounded-full"></div>
                Project Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                  <strong>PLIS (Planning Information System)</strong> serves as the technological backbone for the ACCNLDP Phase II project. Its primary mandate is to institutionalize the "Climate Check"—a mandatory appraisal process for all government Development Project Proforma (DPP).
                </p>
                <p>
                  Before PLIS, climate risk assessments were manual and inconsistent. We built a web-based GIS solution that allows government officials to overlay proposed infrastructure sites against 10+ climate hazard layers (salinity, river erosion, flash floods) to assess viability.
                </p>
                <p>
                   The system directly supports the <strong>Bangladesh Delta Plan 2100</strong> by preventing public investment in high-risk zones without adequate mitigation, potentially saving the nation <strong>~1.3% of annual GDP</strong> loss due to climate disasters.
                </p>
              </div>
            </section>

            {/* Key Features Grid */}
            <section>
              <h3 className="text-xl font-bold text-[#02162C] mb-6">Key System Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard 
                  icon={Layers} 
                  title="Interactive GIS Analysis" 
                  desc="Multi-layer map engine using OpenLayers to visualize complex climate data from agencies like WARPO and BMD."
                />
                <FeatureCard 
                  icon={FileText} 
                  title="Automated Reporting" 
                  desc="One-click generation of clearance certificates merging maps, data, and Bengali text into PDF reports."
                />
                <FeatureCard 
                  icon={ShieldCheck} 
                  title="RBAC Security" 
                  desc="Strict Role-Based Access Control managing hierarchy between Ministry users and Planning Commission appraisers."
                />
                <FeatureCard 
                  icon={Target} 
                  title="Digital Screening" 
                  desc="Automated risk scoring algorithms that evaluate project locations against historical climate data."
                />
              </div>
            </section>

            {/* My Contributions */}
            <section className="bg-[#02162C] text-white rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <div className="w-2 h-8 bg-lime-500 rounded-full"></div>
                My Contributions
              </h2>

              <div className="space-y-6 relative z-10">
                <ContributionItem 
                  title="Frontend Architecture & GIS"
                  desc="Led the React frontend development. Engineered the map interaction layer using OpenLayers, handling complex state management to toggle interdependent climate layers without performance degradation."
                />
                <ContributionItem 
                  title="Solved Localization Challenge"
                  desc="Overcame a critical technical bottleneck regarding Bengali language rendering in PDFs. Implemented a custom merge solution using html-to-pdf and pdf-lib to ensure 100% accurate Bangla typography in official government reports."
                />
                <ContributionItem 
                  title="Full Cycle Delivery"
                  desc="Managed the project SDLC from requirement analysis to deployment on Windows Server. Contributed to PostgreSQL schema design for spatial data and optimized SQL queries."
                />
                <ContributionItem 
                  title="Client Success & UAT"
                  desc="Led the User Acceptance Testing (UAT) phase with high-level officials. Managed critical last-minute change requests and conducted hands-on training for DPP makers."
                />
              </div>
            </section>

             {/* Gallery Placeholder */}
             <section>
              <h3 className="text-xl font-bold text-[#02162C] mb-6">System Visuals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center border border-slate-300 shadow-inner group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">GIS Map Dashboard</span>
                  </div>
                  <span className="text-slate-400 font-medium group-hover:opacity-0 transition-opacity">Map Interface Placeholder</span>
                </div>
                <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center border border-slate-300 shadow-inner group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">Risk Analysis Report</span>
                  </div>
                  <span className="text-slate-400 font-medium group-hover:opacity-0 transition-opacity">PDF Report Placeholder</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tech Stack Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-[#02162C] mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-lime-600" />
                Tech Stack
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Frontend & Maps</p>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'Redux Toolkit', 'Tailwind', 'OpenLayers', 'Google Maps API', 'React Charts'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-lime-500 hover:text-lime-700 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Backend & Data</p>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'Express', 'PostgreSQL', 'GeoServer'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-lime-500 hover:text-lime-700 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Tools & DevOps</p>
                  <div className="flex flex-wrap gap-2">
                    {['Git/GitHub', 'Windows Server', 'IIS', 'Jira'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-lime-500 hover:text-lime-700 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-[#02162C] mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-lime-600" />
                  Key Challenge
                </h3>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-amber-900 font-medium mb-1">Bengali PDF Generation</p>
                  <p className="text-xs text-amber-700/80 leading-relaxed">
                    Standard libraries failed to render complex Bengali scripts. Engineered a custom merge pipeline to ensure government-compliant reporting.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-lime-500 group-hover:text-[#02162C] transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const ContributionItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="mt-1">
      <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-lime-400" />
      </div>
    </div>
    <div>
      <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
      <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default PortfolioDetail;