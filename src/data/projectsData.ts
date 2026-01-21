import {
  Map,
  Droplets,
  Activity,
  Server,
  Code2,
  Layers,
  FileText,
  ShieldCheck,
  Target,
  ArrowRightLeft,
  LayoutDashboard,
  Database,
  Languages,
  BarChart3,
  Globe2,
  Box,
  Terminal,
  Cpu,
  GitBranch,
  PieChart,
  Building,
  Users2,
  Landmark,
  Workflow,
  Award,
  UserCheck,
  Settings,
  BarChart,
  Mail,
  Bell,
  Shield
} from 'lucide-react';

export interface ProjectImage {
  src: string;
  caption: string;
  details: string;
}

export interface ProjectFeature {
  title: string;
  desc: string;
  icon: any;
}

export interface ProjectContribution {
  title: string;
  desc: string;
}

export interface ProjectTheme {
  primary: string;
  secondary: string;
  bgMain: string;
  bgGradient: string;
  accentBlur: string;
  textMain: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
}

export interface HeaderInfo {
  label: string;
  text: string;
  icon: any;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  devops: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  company: string;
  bannerIcon: any;
  theme: ProjectTheme;
  headerInfo: HeaderInfo[];
  overview: string;
  features: ProjectFeature[];
  images: ProjectImage[];
  contributions: ProjectContribution[];
  techStack: TechStack;
  marqueeIcons: any[];
  challenge: {
    title: string;
    desc: string;
  };
}

export const projects: Project[] = [
  {
    id: "4",
    title: "TVET UMIMCC",
    subtitle: "Job Placement & Business Mentoring Platform",
    category: "Migration & Livelihood",
    year: "Jun 2023 - Sep 2023",
    company: "GIZ Hamburg",
    bannerIcon: Users2,
    theme: {
      primary: "amber",
      secondary: "orange",
      bgMain: "bg-[#78350f]",
      bgGradient: "from-amber-400 to-orange-400",
      accentBlur: "bg-amber-500",
      textMain: "text-[#78350f]",
      pillBg: "bg-amber-500/10",
      pillBorder: "border-amber-500/20",
      pillText: "text-amber-400",
    },
    headerInfo: [
      { label: "Client", text: "GIZ (Urban Migration Management)", icon: Building },
      { label: "Coverage", text: "Khulna, Satkhira, Barisal, Rajshahi, Sirajganj", icon: Map },
      { label: "Beneficiaries", text: "6,304 Graduates (74% Women)", icon: Users2 },
    ],
    overview: `The TVET project under the "Urban Management of Internal Migration due to Climate Change" (UMIMCC) initiative addresses the livelihood challenges faced by climate migrants in five partner cities of Bangladesh. As climate change displaces approximately six million people, vulnerable migrants often end up in underdeveloped urban slums without access to basic services and income opportunities.

This comprehensive digital platform was developed to track, mentor, and support 6,304 vocational and entrepreneurship training graduates—74% of whom are women—in securing employment and establishing small businesses. The system manages the entire lifecycle from baseline surveys through job placements, business mentoring, and continuous monitoring, creating a data-driven approach to improving livelihoods for climate-displaced populations.

Working across six divisions, the platform integrates multiple datasets, tracking graduate progress, coordinating with employers and financial institutions, and measuring project impact through performance-based frameworks. The system facilitated online marketing training for 250 graduates, Tally accounting training for 370 entrepreneurs, and organized job fairs and mentoring sessions across all partner cities.`,
    features: [
      { title: "Graduate Tracking Database", desc: "Comprehensive system managing 6,304 graduate profiles with geographic mapping and status monitoring.", icon: Database },
      { title: "Job Placement Portal", desc: "Digital platform connecting vocational graduates with employers through job fairs and mentoring sessions.", icon: Target },
      { title: "Business Mentoring System", desc: "Tracking and support framework for entrepreneurship graduates seeking financing and business guidance.", icon: Building },
      { title: "Performance Analytics", desc: "Real-time monitoring dashboard with outcomes, indicators, baselines, and targets for project evaluation.", icon: BarChart },
      { title: "Multi-City Coordination", desc: "Centralized management system coordinating activities across five partner municipalities.", icon: Globe2 },
      { title: "Training Management", desc: "Digital platform for organizing online marketing and accounting training programs.", icon: FileText },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
        caption: "Graduate Database & Tracking System",
        details: "Comprehensive dashboard showing the 6,304 training graduates across five cities, with real-time status updates on employment, business ventures, and training participation. Geographic mapping shows graduate distribution and residence locations for targeted intervention planning."
      },
      {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        caption: "Job Placement & Mentoring Portal",
        details: "Interface connecting vocational training graduates with potential employers through digital job fairs, mentoring session scheduling, and career counseling tracking. Shows successful placements and ongoing mentoring relationships."
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        caption: "Performance Monitoring Analytics",
        details: "Comprehensive analytics dashboard tracking project outcomes against baseline indicators. Shows employment rates, business establishment success, training completion rates, and gender-disaggregated data with 74% women participation highlighted."
      },
      {
        src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        caption: "Training Program Management",
        details: "Digital system managing online marketing training for 250 graduates and Tally accounting training for 370 entrepreneurship graduates. Tracks attendance, certification, and post-training employment outcomes."
      },
      {
        src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
        caption: "Private Sector Forum Dashboard",
        details: "Platform facilitating collaboration between training graduates, local employers, and financial institutions across five cities. Manages employer engagement, job opportunities, and financing options for small businesses."
      },
    ],
    contributions: [
      { title: "Multi-Division Data Integration", desc: "Analyzed and processed extensive datasets from six divisions, consolidating training records, employment data, and graduate information into a unified tracking system." },
      { title: "Graduate Progress Portal", desc: "Developed a comprehensive web portal for tracking the current job status of contacted trainees, enabling real-time monitoring of employment outcomes and business ventures." },
      { title: "Performance Framework Implementation", desc: "Built analytics tools to measure project efficiency and progress against baseline indicators, providing data-driven insights for program evaluation." },
      { title: "Stakeholder Coordination System", desc: "Created digital workflows connecting graduates with employers and financial institutions, facilitating job placements and business financing across five partner cities." },
      { title: "Gender-Responsive Tracking", desc: "Implemented specialized monitoring for the 74% women beneficiaries, ensuring equitable program access and targeted support for vulnerable climate migrants." }
    ],
    techStack: {
      frontend: ['React.js', 'Dashboard UI', 'Data Visualization', 'Geospatial Mapping'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'Data Processing'],
      devops: ['Database Management', 'Multi-City Deployment', 'Data Security', 'Reporting Systems']
    },
    marqueeIcons: [Users2, Database, BarChart, Target, Building, Map, Globe2, FileText, Activity, Settings, Shield, Workflow],
    challenge: { 
      title: "Multi-Division Data Consolidation", 
      desc: "Integrating diverse datasets from six divisions with varying data quality, tracking 6,304 graduates across five cities, and maintaining real-time status updates while ensuring data accuracy and privacy for vulnerable populations." 
    }
  },
  {
    id: "5",
    title: "Survey Monitoring System",
    subtitle: "Real-Time GIS Survey Progress Tracking Platform",
    category: "Internal GIS Tool",
    year: "2023 - Present",
    company: "Tiller",
    bannerIcon: Map,
    theme: {
      primary: "indigo",
      secondary: "blue",
      bgMain: "bg-[#1e1b4b]",
      bgGradient: "from-indigo-400 to-blue-400",
      accentBlur: "bg-indigo-500",
      textMain: "text-[#1e1b4b]",
      pillBg: "bg-indigo-500/10",
      pillBorder: "border-indigo-500/20",
      pillText: "text-indigo-400",
    },
    headerInfo: [
      { label: "Project Type", text: "In-House Survey Management Tool", icon: Building },
      { label: "Technology", text: "Full-Stack GIS Application", icon: Code2 },
      { label: "Impact", text: "Zero Data Loss & Real-Time Tracking", icon: Activity },
    ],
    overview: `The Survey Monitoring System is a comprehensive in-house platform developed to revolutionize how large-scale geospatial survey projects are managed, tracked, and executed. Traditional survey workflows faced critical challenges: data loss during daily transfers, mismatches between field data and digital records, inefficient progress tracking, and inability to make real-time decisions on resource allocation.

This system transforms the entire survey lifecycle by dividing city areas into phases and working unit grids, enabling surveyors to conduct drone flights and manual surveys while digitizing data in 2D/3D using QGIS and other desktop GIS tools. The breakthrough innovation is the real-time database integration—as surveyors work in QGIS, data automatically syncs to a centralized PostgreSQL/PostGIS database, eliminating end-of-day save processes and preventing data loss.

The web-based GIS interface provides stakeholders with live visibility into survey progress, allowing them to visualize completed grids, search for specific areas, and update project statuses dynamically. This data-driven approach enables effective manpower planning, accurate timeline predictions, and efficient resource allocation. The system has become essential infrastructure for managing complex multi-phase survey projects, ensuring data integrity, operational efficiency, and project transparency.`,
    features: [
      { title: "Real-Time Data Synchronization", desc: "Direct integration with QGIS and desktop GIS tools for automatic database updates, eliminating manual saves and data loss.", icon: Database },
      { title: "Grid-Based Progress Tracking", desc: "Visual management of survey phases and working unit grids with color-coded completion status and real-time updates.", icon: Layers },
      { title: "Interactive Web GIS Viewer", desc: "Web-based map interface for visualizing survey coverage, searching areas, and monitoring project progress across all phases.", icon: Globe2 },
      { title: "Automated Progress Analytics", desc: "Real-time dashboards showing completion percentages, manpower efficiency, and timeline projections for data-driven planning.", icon: BarChart },
      { title: "Multi-User Access Control", desc: "Role-based authentication system managing surveyor, supervisor, and administrator access with audit trails.", icon: Shield },
      { title: "Admin Management Panel", desc: "Comprehensive admin interface for creating projects, defining grids, managing teams, and configuring workflows.", icon: Settings },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        caption: "Real-Time Survey Progress Dashboard",
        details: "Main dashboard showing live survey progress across all phases and grids. Color-coded visualization indicates completed (green), in-progress (yellow), and pending (gray) survey units. Real-time statistics display completion percentages, active surveyors, and estimated completion timelines."
      },
      {
        src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop",
        caption: "Interactive GIS Web Map Viewer",
        details: "Web-based GIS interface displaying survey grids overlaid on satellite imagery. Users can click on individual grids to view detailed survey data, drone imagery, and digitization status. Search functionality enables quick navigation to specific areas or grid IDs."
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        caption: "Phase & Grid Management System",
        details: "Administrative view showing how large survey areas are divided into manageable phases and working unit grids. Each phase can be assigned to different teams with tracked progress, drone flight schedules, and data digitization workflows."
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        caption: "QGIS Database Integration",
        details: "Backend architecture showing real-time sync between QGIS desktop tools and PostgreSQL/PostGIS database. Python scripts monitor QGIS edits and automatically push changes to the central database, ensuring zero data loss and version control."
      },
      {
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
        caption: "Admin Project Configuration Panel",
        details: "Comprehensive admin interface for creating new survey projects, defining grid structures, uploading base maps, assigning surveyor teams, and configuring workflow automation rules. Includes project timeline planning and resource allocation tools."
      },
    ],
    contributions: [
      { title: "Full-Stack Development", desc: "Architected and developed the complete system from database design to frontend UI, including real-time GIS data synchronization and web-based visualization." },
      { title: "QGIS Integration & Automation", desc: "Implemented Python scripts for seamless integration with QGIS and desktop GIS tools, enabling automatic data sync and eliminating manual save processes." },
      { title: "Real-Time Database Architecture", desc: "Designed PostgreSQL/PostGIS schema with Prisma ORM for efficient spatial data storage, real-time updates, and concurrent multi-user access." },
      { title: "GeoServer Map Services", desc: "Configured GeoServer for serving dynamic map layers and implemented web mapping interface using OpenLayers for interactive survey visualization." },
      { title: "Admin Panel & Workflow Design", desc: "Built comprehensive admin interface for project creation, grid management, team assignments, and workflow configuration to streamline survey operations." },
      { title: "Authentication & Security", desc: "Implemented role-based access control with JWT authentication, ensuring secure data access and maintaining audit trails for all system activities." }
    ],
    techStack: {
      frontend: ['React.js', 'OpenLayers', 'Tailwind CSS', 'Web GIS UI', 'Data Visualization'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'PostGIS', 'Prisma ORM', 'Python Scripts', 'GeoServer'],
      devops: ['Real-Time Sync', 'QGIS Integration', 'Authentication', 'Data Security', 'Server Management']
    },
    marqueeIcons: [Map, Database, Layers, Globe2, Code2, Server, Terminal, GitBranch, Settings, Shield, Activity, Workflow],
    challenge: { 
      title: "Real-Time GIS Data Synchronization", 
      desc: "Creating seamless integration between desktop GIS tools (QGIS) and a centralized database with real-time sync, while preventing data conflicts, managing concurrent edits, and maintaining spatial data integrity across multiple surveyor teams." 
    }
  },
  {
    id: "1",
    title: "PLIS-ACCNLDP",
    subtitle: "Climate Resilient Planning System",
    category: "Govt. GIS Platform",
    year: "2022 - 2023",
    company: "Tiller",
    bannerIcon: Map,
    theme: {
      primary: "lime",
      secondary: "emerald",
      bgMain: "bg-[#02162C]",
      bgGradient: "from-lime-400 to-emerald-400",
      accentBlur: "bg-lime-500",
      textMain: "text-[#02162C]",
      pillBg: "bg-lime-500/10",
      pillBorder: "border-lime-500/20",
      pillText: "text-lime-400",
    },
    headerInfo: [
      { label: "Client", text: "Bangladesh Planning Commission", icon: Landmark },
      { label: "Funded By", text: "GIZ (Germany)", icon: Users2 },
      { label: "Impact Goal", text: "Delta Plan 2100 & Vision 2041", icon: Target },
    ],
    overview: `PLIS (Planning Information System) serves as the technological backbone for the ACCNLDP Phase II project, enabling the Bangladesh Planning Commission to mainstream climate considerations into national development planning. The system integrates multi-source geospatial data—including satellite imagery, flood risk zones, erosion patterns, and cyclone vulnerability maps—into a unified decision-support platform that helps evaluate every proposed infrastructure project against climate resilience criteria mandated by the Delta Plan 2100 and Bangladesh Vision 2041.`,
    features: [
      { title: "Interactive GIS Analysis", desc: "Multi-layer map engine using OpenLayers for spatial decision-making.", icon: Layers },
      { title: "Automated Reporting", desc: "One-click generation of climate clearance certificates in Bengali.", icon: FileText },
      { title: "RBAC Security", desc: "Strict Role-Based Access Control managing ministerial hierarchy.", icon: ShieldCheck },
      { title: "Digital Screening", desc: "Automated climate risk scoring algorithms for projects.", icon: Target },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop",
        caption: "Multi-layer GIS Interface",
        details: "The core interface allows planners to toggle between satellite imagery, hazard layers (like flood zones shown here), and proposed infrastructure sites. The layer controller on the left manages opacity and ordering."
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        caption: "Project Screening Dashboard",
        details: "High-level statistical overview for ministry officials, showing the number of projects submitted, approved, or flagged for climate risk across different administrative regions."
      },
      {
        src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        caption: "Global & Regional Climate Models",
        details: "Integration of macroscopic climate data models to predict long-term environmental shifts, essential for planning infrastructure with a 50+ year lifespan."
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        caption: "Risk Assessment Analytics",
        details: "Detailed charts showing the specific vulnerability scores of a selected project location against various hazards like salinity intrusion, river erosion, and cyclone storm surges."
      },
      {
        src: "https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=2070&auto=format&fit=crop",
        caption: "Automated Clearance Report Generation",
        details: "The system automatically generates official government PDF reports (in Bengali) summarizing the climate check findings, including generated maps and risk scores."
      },
    ],
    contributions: [
      { title: "Frontend Architecture & GIS", desc: "Led the React frontend development, designing the component architecture and implementing the OpenLayers-based GIS engine with custom layer controls and interaction handlers." },
      { title: "Solved Localization Challenge", desc: "Overcame a critical technical bottleneck regarding Bengali language PDF generation by researching and integrating specialized font rendering libraries." },
      { title: "Full Cycle Delivery", desc: "Managed the project SDLC from requirement analysis to deployment, coordinating with government stakeholders and ensuring compliance with security protocols." },
      { title: "Client Success & UAT", desc: "Led the User Acceptance Testing (UAT) phase with Planning Commission officials, incorporating feedback and delivering training sessions." }
    ],
    techStack: {
      frontend: ['React.js', 'Redux Toolkit', 'Tailwind', 'OpenLayers', 'Google Maps API', 'React Charts'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'GeoServer'],
      devops: ['Git/GitHub', 'Windows Server', 'IIS', 'Jira']
    },
    marqueeIcons: [Database, Server, Code2, Globe2, Layers, Box, Terminal, Cpu, GitBranch, Activity, ShieldCheck, Workflow],
    challenge: { title: "Bengali PDF Generation", desc: "Standard libraries failed to render complex Bengali scripts. Required custom font embedding solution." }
  },
  {
    id: "2",
    title: "IUNSD",
    subtitle: "Integrative Upscaling of National Sanitation Database",
    category: "WASH Data Hub",
    year: "2023",
    company: "DPHE",
    bannerIcon: Droplets,
    theme: {
      primary: "cyan",
      secondary: "teal",
      bgMain: "bg-[#004d61]",
      bgGradient: "from-cyan-300 to-teal-300",
      accentBlur: "bg-cyan-400",
      textMain: "text-[#004d61]",
      pillBg: "bg-cyan-500/10",
      pillBorder: "border-cyan-500/20",
      pillText: "text-cyan-300",
    },
    headerInfo: [
      { label: "Implemented In", text: "DPHE Bangladesh", icon: Building },
      { label: "Partners", text: "AIT Thailand, GWSC, ITN-BUET", icon: Users2 },
      { label: "Funded By", text: "Bill & Melinda Gates Foundation", icon: Droplets },
    ],
    overview: `IUNSD stands as a landmark initiative in the WASH (Water, Sanitation, and Hygiene) sector for Bangladesh, creating the nation's first comprehensive digital platform for tracking sanitation value chains. The system visualizes the complete lifecycle of fecal sludge management—from household containment through collection, transport, treatment, and safe disposal—using advanced Sankey diagrams known as "Shit Flow Diagrams" (SFD). This data-driven approach enables evidence-based policy decisions for achieving SDG 6.2 targets.`,
    features: [
      { title: "Advanced Sankey Diagrams", desc: "Custom-built Sankey charts representing 'Shit Flow Diagram' for cities.", icon: ArrowRightLeft },
      { title: "City Profile & Comparison", desc: "Detailed analytical views for individual cities with comparative metrics.", icon: LayoutDashboard },
      { title: "IMIS Integration", desc: "Seamless integration with IMIS to fetch dynamic infrastructure data.", icon: Database },
      { title: "Multilingual Support", desc: "Full internationalization (i18n) support for Bengali and English.", icon: Languages },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1543286386-713df548e9cc?q=80&w=2070&auto=format&fit=crop",
        caption: "National Sanitation Data Overview",
        details: "A high-level view for national policymakers, showing aggregate data on sanitation coverage, Fecal Sludge Management (FSM) progress, and SDG 6.2 indicators across the country."
      },
      {
        src: "https://images.unsplash.com/photo-1605218427306-0343d6138544?q=80&w=2070&auto=format&fit=crop",
        caption: "Infrastructure Mapping",
        details: "GIS view mapping physical sanitation infrastructure like treatment plants, transfer stations, and public toilets, color-coded by operational status and capacity."
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        caption: "City Profile Dashboard",
        details: "A dedicated dashboard for a specific municipality (e.g., Khulna), offering a deep dive into their specific sanitation value chain performance, budget utilization, and service gaps."
      },
      {
        src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
        caption: "Shit Flow Diagram (SFD) Analysis",
        details: "The complex Sankey diagram visualizes the flow of excreta across the sanitation value chain—from containment to emptying, transport, treatment, and final disposal—highlighting where safe vs. unsafe management occurs."
      },
      {
        src: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070&auto=format&fit=crop",
        caption: "Treatment Plant Monitoring",
        details: "Data inputs from Fecal Sludge Treatment Plants (FSTPs), monitoring inflow volumes, treatment efficiency, and output quality standards."
      },
    ],
    contributions: [
      { title: "Complex Sankey Implementation", desc: "Engineered the most challenging visual component: the Sankey chart logic that traces distinct sanitation pathways and calculates flow percentages." },
      { title: "Full-Stack Development", desc: "Handled both frontend UI development and backend API logic for data aggregation and transformation." },
      { title: "City Profile & Analytics", desc: "Developed the 'City Profile' module with comparative analytics and benchmarking features." },
      { title: "System Architecture", desc: "Implemented RBAC, multilingual support, and established CI/CD pipeline for continuous deployment." }
    ],
    techStack: {
      frontend: ['React.js', 'React Router', 'Tailwind', 'Sankey Charts', 'Sunburst Charts', 'i18n', 'Figma'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'GeoServer'],
      devops: ['Docker', 'CI/CD', 'Windows Server', 'HTML to PDF']
    },
    marqueeIcons: [BarChart3, Map, LayoutDashboard, PieChart, ArrowRightLeft, Droplets, Database, Server, Code2, Globe2, Layers, Box],
    challenge: { title: "Manual Data Formulation", desc: "Developing the logic to trace 'distinct flows' through the sanitation chain was mathematically intensive and required custom algorithms." }
  },
  {
    id: "3",
    title: "INCLUDE Call for Ideas",
    subtitle: "Climate Innovation Platform for Urban Bangladesh",
    category: "Grant Management System",
    year: "2024 - 2025",
    company: "GIZ Bangladesh",
    bannerIcon: Award,
    theme: {
      primary: "violet",
      secondary: "purple",
      bgMain: "bg-[#1e1b4b]",
      bgGradient: "from-violet-400 to-purple-400",
      accentBlur: "bg-violet-500",
      textMain: "text-[#1e1b4b]",
      pillBg: "bg-violet-500/10",
      pillBorder: "border-violet-500/20",
      pillText: "text-violet-400",
    },
    headerInfo: [
      { label: "Client", text: "GIZ Bangladesh (INCLUDE Project)", icon: Building },
      { label: "Municipalities", text: "Chapainawabganj, Charghat, Gaibandha, Sirajganj", icon: Landmark },
      { label: "Funded By", text: "German Federal Ministry (BMZ)", icon: Users2 },
    ],
    overview: `The INCLUDE Call for Ideas platform serves as the digital backbone for a nationwide climate innovation challenge across four municipalities in Bangladesh. As the platform administrator, I managed the entire grant lifecycle—from application submission through multi-stage evaluation to final award ceremonies. The platform facilitated citizen-driven climate solutions addressing water security, urban flooding, heat stress, agriculture resilience, and public health challenges.

Built on Good Grants infrastructure, I customized the platform extensively through API integration to create specialized dashboards, automated workflows, and analytics tools tailored to the unique requirements of municipal climate action. The system handled applications in both Bengali and English, managed complex jury evaluation processes, and coordinated with multiple stakeholder groups including municipalities, GIZ, technical evaluators, and community organizations.`,
    features: [
      { title: "Multi-Stage Application System", desc: "Managed online and paper-based submissions across 12 climate challenges.", icon: FileText },
      { title: "Custom Evaluation Framework", desc: "Built specialized review workflows for eligibility, technical assessment, and jury evaluation.", icon: UserCheck },
      { title: "API-Powered Dashboards", desc: "Developed custom web applications using Good Grants API for real-time analytics and reporting.", icon: BarChart },
      { title: "Stakeholder Communication", desc: "Coordinated automated email broadcasts, SMS notifications, and helpdesk support.", icon: Mail },
      { title: "Bilingual Platform Management", desc: "Handled content and user interactions in both Bengali and English.", icon: Languages },
      { title: "Award & Recognition System", desc: "Managed leaderboards, scoring systems, and certificate generation for 48 winning ideas.", icon: Award },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        caption: "Application Dashboard Overview",
        details: "Real-time analytics showing application statistics across four municipalities, with breakdowns by challenge category, submission method (online vs paper), and evaluation status."
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        caption: "Multi-Stage Review System",
        details: "Custom evaluation workflow managing eligibility screening, technical review by domain experts, and final jury assessment—each with distinct criteria and scoring rubrics."
      },
      {
        src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
        caption: "Municipality-Specific Challenge Pages",
        details: "Detailed challenge descriptions for each of the 12 climate problems across four cities, including context, evaluation criteria, and submission guidelines in both languages."
      },
      {
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        caption: "Custom Analytics Dashboard",
        details: "API-integrated analytics tool providing deep insights into applicant demographics, idea distribution, evaluation progress, and municipal engagement metrics."
      },
      {
        src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        caption: "Communication & Broadcast System",
        details: "Centralized hub for managing email campaigns, SMS alerts, and applicant notifications throughout the 6-month challenge period, reaching over 500+ participants."
      },
    ],
    contributions: [
      { title: "Platform Administration & Configuration", desc: "Managed the entire Good Grants platform setup including forms, rounds, evaluation rubrics, user roles, and application workflows for a complex multi-stage, multi-city challenge." },
      { title: "Custom API Integration", desc: "Built specialized web applications using Good Grants API to create custom dashboards for advanced analytics, reporting, and operational management beyond standard platform capabilities." },
      { title: "Multi-Stakeholder Coordination", desc: "Coordinated between GIZ project team, four municipal offices, technical evaluators, jury members, and 500+ applicants through systematic communication workflows." },
      { title: "Bilingual Content Management", desc: "Managed platform content in both Bengali and English, ensuring accessibility for diverse applicant groups including citizens, NGOs, academic institutions, and private sector." },
      { title: "Data Analysis & Reporting", desc: "Generated detailed analytics reports on application trends, demographic reach, challenge popularity, and evaluation outcomes to inform project decision-making." },
      { title: "Process Optimization", desc: "Streamlined review workflows, automated notifications, and created custom views to improve efficiency of the evaluation process handling 300+ submissions." }
    ],
    techStack: {
      frontend: ['React.js', 'Custom Dashboard UI', 'Data Visualization', 'Good Grants API'],
      backend: ['Good Grants Platform', 'REST API Integration', 'Database Queries', 'Automated Workflows'],
      devops: ['Platform Configuration', 'User Management', 'Email/SMS Systems', 'Analytics Tools']
    },
    marqueeIcons: [Award, FileText, Users2, BarChart, Database, Settings, Shield, Mail, Bell, Activity, Target, Workflow],
    challenge: { 
      title: "Complex Multi-Stage Workflow", 
      desc: "Managing a sophisticated evaluation pipeline across eligibility screening, technical review, and jury assessment while coordinating multiple stakeholder groups and maintaining data integrity." 
    }
  }
];

export default projects;