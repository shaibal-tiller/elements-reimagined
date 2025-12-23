import React from 'react';
import { 
  Droplets, 
  Database, 
  Activity, 
  BarChart3, 
  Map as MapIcon, 
  ShieldCheck, 
  Globe2, 
  Building, 
  Users2, 
  Server, 
  Languages, 
  Workflow, 
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  CheckCircle2,
  Code2,
  Layers,
  Box,
  Terminal,
  Cpu,
  GitBranch
} from 'lucide-react';

const PortfolioDetailIUNSD = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-[#004d61] text-white overflow-hidden">
        {/* Abstract Background Pattern - Water/Flow Theme */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-cyan-400 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute left-10 bottom-0 w-[400px] h-[400px] bg-teal-600 rounded-full blur-[100px] translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <span className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Droplets className="w-3 h-3" /> WASH Sector Landmark
            </span>
            <div className="flex items-center gap-6 mt-4 md:mt-0 text-cyan-100/80 text-sm font-medium">
              <span className="flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> National Scale
              </span>
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4" /> DPHE
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Project IUNSD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 text-3xl md:text-5xl">
              Integrative Upscaling of <br/> National Sanitation Database
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-cyan-50 max-w-3xl leading-relaxed mb-10">
            A pioneering digital platform for the Department of Public Health Engineering (DPHE) that unifies national sanitation data into actionable intelligence, featuring complex Citywide Inclusive Sanitation (CWIS) modeling and Shit Flow Diagrams (SFD).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
            <div className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-[10px] text-cyan-200 uppercase tracking-wider mb-1">Implemented In</p>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Building className="w-4 h-4 text-cyan-300" />
                DPHE Bangladesh
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-[10px] text-cyan-200 uppercase tracking-wider mb-1">Strategic Partners</p>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Users2 className="w-4 h-4 text-cyan-300" />
                AIT Thailand, GWSC, ITN-BUET
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-[10px] text-cyan-200 uppercase tracking-wider mb-1">Funded By</p>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Droplets className="w-4 h-4 text-cyan-300" />
                Bill & Melinda Gates Foundation
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <p className="text-[10px] text-cyan-200 uppercase tracking-wider mb-1">Key Tech</p>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Workflow className="w-4 h-4 text-cyan-300" />
                IMIS & Dynamic Sankey
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
              <h2 className="text-2xl font-bold text-[#004d61] mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-cyan-600 rounded-full"></div>
                Project Context
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                  <strong>IUNSD</strong> stands as a landmark initiative in the WASH (Water, Sanitation, and Hygiene) sector of Bangladesh. Implemented under the <strong>Strengthening of Public Data Systems for Sanitation in Bangladesh (SPDSSB)</strong> program, it serves as a central intelligence hub for policy-makers.
                </p>
                <p>
                  The system integrates with the <strong>Integrated Management Information System (IMIS)</strong> to capture dynamic, real-time changes in sanitation data. It provides detailed "City Profiles" that offer single and comparative views on critical metrics like SDG 6.2 indicators, Fecal Sludge Management (FSM) infrastructure, and groundwater contamination threats.
                </p>
                <p>
                   A core feature is the visualization of the sanitation value chain through <strong>Shit Flow Diagrams (SFD)</strong> and complex Sankey charts, enabling authorities to track waste from containment to disposal.
                </p>
              </div>
            </section>

            {/* Key Features Grid */}
            <section>
              <h3 className="text-xl font-bold text-[#004d61] mb-6">System Modules & Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard 
                  icon={ArrowRightLeft} 
                  title="Advanced Sankey Diagrams" 
                  desc="Custom-built Sankey charts representing the 'Shit Flow Diagram' (SFD), visualizing the complete lifecycle of solid waste and fecal sludge flow across the city."
                />
                <FeatureCard 
                  icon={LayoutDashboard} 
                  title="City Profile & Comparison" 
                  desc="Detailed analytical views for individual cities and comparative tools for SDG indicators, institutional capacity, and containment accessibility."
                />
                <FeatureCard 
                  icon={Database} 
                  title="IMIS Integration" 
                  desc="Seamless integration with the Integrated Management Information System (IMIS) to fetch and visualize dynamic operational data from municipalities."
                />
                <FeatureCard 
                  icon={MapIcon} 
                  title="Geospatial Analysis" 
                  desc="FSM & SWM Infrastructure maps with layers for containment outlet behavior and groundwater contamination threats using GeoServer."
                />
                <FeatureCard 
                  icon={ShieldCheck} 
                  title="RBAC & Management" 
                  desc="Multi-level user system with strict Role-Based Access Control. comprehensive CRUD modules for KII (Key Informant Interviews) and survey data."
                />
                <FeatureCard 
                  icon={Languages} 
                  title="Multilingual Support" 
                  desc="Full internationalization (i18n) support, ensuring accessibility for both local government officials (Bengali) and international partners (English)."
                />
              </div>
            </section>

            {/* My Contributions */}
            <section className="bg-gradient-to-br from-[#004d61] to-[#003847] text-white rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <div className="w-2 h-8 bg-cyan-400 rounded-full"></div>
                My Key Contributions
              </h2>

              <div className="space-y-6 relative z-10">
                <ContributionItem 
                  title="Complex Sankey Implementation"
                  desc="Engineered the most challenging visual component: the Sankey Chart for waste flow. This required complex manual data formulation algorithms to accurately map distinct flows from node to node, ensuring the 'Shit Flow Diagram' was mathematically and visually correct."
                />
                <ContributionItem 
                  title="Full-Stack Development"
                  desc="Handled both frontend UI implementation in React and backend logic in Node.js/Express. Developed APIs for data retrieval and integration with the IMIS system."
                />
                <ContributionItem 
                  title="City Profile & Analytics"
                  desc="Developed the 'City Profile' module, integrating Sunburst, Interactive Bar, and Pie charts to visualize multi-dimensional sanitation data (SWM Summary, Infrastructure, Capacity)."
                />
                <ContributionItem 
                  title="System Architecture & DevOps"
                  desc="Implemented the RBAC system for secure user management. Established the CI/CD workflow using Docker and managed deployment on Windows Servers."
                />
                <ContributionItem 
                  title="Requirements & Testing"
                  desc="Played a key role in finalizing requirements through continuous updates. Wrote unit tests to ensure system reliability and handled the UI implementation from Figma designs."
                />
              </div>
            </section>

             {/* Gallery Placeholder */}
             <section>
              <h3 className="text-xl font-bold text-[#004d61] mb-6">System Visuals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center border border-slate-300 shadow-inner group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">Sankey Diagram (SFD)</span>
                  </div>
                  <Workflow className="w-12 h-12 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center border border-slate-300 shadow-inner group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">City Comparison Dashboard</span>
                  </div>
                  <BarChart3 className="w-12 h-12 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tech Stack Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-24 overflow-hidden relative">
              
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden bg-slate-50">
                 <style>{`
                    @keyframes marquee-left {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    @keyframes marquee-right {
                      0% { transform: translateX(-50%); }
                      100% { transform: translateX(0); }
                    }
                 `}</style>
                 <div className="absolute inset-[-100%] flex flex-col justify-center gap-12 rotate-[30deg] scale-150">
                    <MarqueeRow direction="left" duration="40s" icons={[Database, Server, Code2, Globe2, Layers, Box]} />
                    <MarqueeRow direction="right" duration="50s" icons={[Terminal, Cpu, GitBranch, Activity, ShieldCheck, Workflow]} />
                    <MarqueeRow direction="left" duration="45s" icons={[BarChart3, MapIcon, LayoutDashboard, PieChart, ArrowRightLeft, Droplets]} />
                    <MarqueeRow direction="right" duration="55s" icons={[Database, Server, Code2, Globe2, Layers, Box]} />
                    <MarqueeRow direction="left" duration="40s" icons={[Terminal, Cpu, GitBranch, Activity, ShieldCheck, Workflow]} />
                 </div>
              </div>

              <div className="relative z-10 p-6">
                <h3 className="text-lg font-bold text-[#004d61] mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-600" />
                  Tech Stack
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Frontend & Dataviz</p>
                    <div className="flex flex-wrap gap-2">
                      {['React.js', 'React Router', 'Tailwind', 'Sankey Charts', 'Sunburst Charts', 'i18n', 'Figma'].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-cyan-50/80 border border-cyan-100 rounded-lg text-xs font-medium text-cyan-800 hover:border-cyan-500 transition-colors cursor-default backdrop-blur-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Backend & Database</p>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'Express', 'PostgreSQL', 'GeoServer'].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-cyan-50/80 border border-cyan-100 rounded-lg text-xs font-medium text-cyan-800 hover:border-cyan-500 transition-colors cursor-default backdrop-blur-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-3">DevOps & Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {['Docker', 'CI/CD', 'Windows Server', 'HTML to PDF'].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-cyan-50/80 border border-cyan-100 rounded-lg text-xs font-medium text-cyan-800 hover:border-cyan-500 transition-colors cursor-default backdrop-blur-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-[#004d61] mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-600" />
                    Key Challenge
                  </h3>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <p className="text-sm text-orange-900 font-medium mb-1">Manual Data Formulation</p>
                    <p className="text-xs text-orange-800/80 leading-relaxed">
                      Developing the logic to trace "distinct flows from node to node" for the Sankey charts was mathematically intensive, requiring custom backend algorithms to structure raw survey data into flow-compatible JSON.
                    </p>
                  </div>
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
    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const ContributionItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="mt-1">
      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
      </div>
    </div>
    <div>
      <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
      <p className="text-cyan-100/90 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const MarqueeRow = ({ icons, direction, duration }: { icons: any[], direction: 'left' | 'right', duration: string }) => {
  const IconList = () => (
    <>
      {icons.map((Icon, idx) => <Icon key={idx} className="w-12 h-12 text-slate-900" />)}
    </>
  );

  return (
    <div 
      className="flex gap-12 min-w-max"
      style={{ 
        animation: `marquee-${direction} ${duration} linear infinite` 
      }}
    >
      <IconList />
      <IconList />
      <IconList />
      <IconList />
      <IconList />
      <IconList />
    </div>
  );
};

export default PortfolioDetailIUNSD;