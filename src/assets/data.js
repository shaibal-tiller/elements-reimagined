// import { getAge } from "../assets/data.js";

import { 
  Wrench,
  LifeBuoy,
  Activity, 
  Server, 
  Code2,
  Map, 
  Droplets, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Target, 
  ArrowRightLeft, 
  LayoutDashboard, 
  Database, 
  Languages, 
  Workflow,
  BarChart3,
  Globe2,
  Box,
  Terminal,
  Cpu,
  GitBranch,
  PieChart,
  Building,
  Users2,
  Landmark
} from 'lucide-react';

export const personalInfo = {
  name: "Mohshin Ahamed Sharif Shaibal",
  short_name: "Sharif Shaibal",
  reverse_short_name: "Shaibal Sharif",
  first_short_name: "Mohshin Ahamed ",
  email: "shaibalsharif@gmail.com",
  business_email: "shaibal.tiller@gmail.com",
  company_email: "shaibal@tiller.com.bd",
  student_email: "sharif15-7348@diu.edu.bd",

  primary_phone: "+8801521330598",
  secondary_phone: "+8801978330598",

  full_address: "Mirpur, Dhaka, Bangladesh",
  residence: "Mirpur",
  city: "Dhaka",
  country: "Bangladesh",
  dob: "1998-06-25",
  gender: "Male",
  age: "26 yrs",
};

export const links = {
  facebook: "",
  linkedin: "",
  github: "",
  whatsapp: "",
};

export const services = [
  {
    icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "Building scalable, production-ready web applications using React, Next.js, Node.js, and modern web standards—from frontend to backend.",
  },
  {
    icon: LayoutDashboard,
    title: "Frontend Engineering",
    description:
      "Crafting responsive, accessible, and high-performance user interfaces with React, Next.js, HTML, CSS, and Tailwind for exceptional UX.",
  },
  {
    icon: Server,
    title: "Backend & API Development",
    description:
      "Developing secure backend systems with Node.js and Next.js APIs, including authentication, role-based access control, and REST integrations.",
  },
  {
    icon: Database,
    title: "Database & Server Management",
    description:
      "Managing PostgreSQL, MySQL, and Firebase databases along with deploying and maintaining applications on local servers and cloud infrastructure.",
  },
  {
    icon: Wrench,
    title: "CI/CD, Testing & Deployment",
    description:
      "Implementing automated testing, Docker-based CI/CD pipelines, and smooth deployment workflows for reliable and maintainable systems.",
  },
  {
    icon: LifeBuoy,
    title: "Technical Support & Event Facilitation",
    description:
      "Providing on-ground technical support as a backstopper—ensuring system stability, rapid issue resolution, and smooth project or event execution.",
  },
];

export const skills = [];
export const profile = `React/Next.js frontend engineer. Delivers robust, tested code & enjoys collaborative problem-solving. Brings a positive, fun energy
 to the team, enhancing productivity & morale. Passionate about creating exceptional user experiences.`;
export const projects = [
  {
    id: "1",
    title: "PLIS-ACCNLDP",
    subtitle: "Climate Resilient Planning System",
    category: "Govt. GIS Platform",
    year: "2022 - 2023",
    company: "Tiller",
    bannerIcon: Map,

    // Theme Colors
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
      {
        label: "Client",
        text: "Bangladesh Planning Commission",
        icon: Landmark,
      },
      { label: "Funded By", text: "GIZ (Germany)", icon: Users2 },
      {
        label: "Impact Goal",
        text: "Delta Plan 2100 & Vision 2041",
        icon: Target,
      },
    ],

    overview: `PLIS (Planning Information System) serves as the technological backbone for the ACCNLDP Phase II project. Its primary mandate is to institutionalize the "Climate Check"—a mandatory appraisal process for all government Development Project Proforma (DPP).

    Before PLIS, climate risk assessments were manual and inconsistent. We built a web-based GIS solution that allows government officials to overlay proposed infrastructure sites against 10+ climate hazard layers (salinity, river erosion, flash floods) to assess viability.
    
    The system directly supports the Bangladesh Delta Plan 2100 by preventing public investment in high-risk zones without adequate mitigation, potentially saving the nation ~1.3% of annual GDP loss due to climate disasters.`,

    features: [
      {
        title: "Interactive GIS Analysis",
        desc: "Multi-layer map engine using OpenLayers to visualize complex climate data from agencies like WARPO and BMD.",
        icon: Layers,
      },
      {
        title: "Automated Reporting",
        desc: "One-click generation of clearance certificates merging maps, data, and Bengali text into PDF reports.",
        icon: FileText,
      },
      {
        title: "RBAC Security",
        desc: "Strict Role-Based Access Control managing hierarchy between Ministry users and Planning Commission appraisers.",
        icon: ShieldCheck,
      },
      {
        title: "Digital Screening",
        desc: "Automated risk scoring algorithms that evaluate project locations against historical climate data.",
        icon: Target,
      },
    ],

    contributions: [
      {
        title: "Frontend Architecture & GIS",
        desc: "Led the React frontend development. Engineered the map interaction layer using OpenLayers, handling complex state management to toggle interdependent climate layers without performance degradation.",
      },
      {
        title: "Solved Localization Challenge",
        desc: "Overcame a critical technical bottleneck regarding Bengali language rendering in PDFs. Implemented a custom merge solution using html-to-pdf and pdf-lib to ensure 100% accurate Bangla typography in official government reports.",
      },
      {
        title: "Full Cycle Delivery",
        desc: "Managed the project SDLC from requirement analysis to deployment on Windows Server. Contributed to PostgreSQL schema design for spatial data and optimized SQL queries.",
      },
      {
        title: "Client Success & UAT",
        desc: "Led the User Acceptance Testing (UAT) phase with high-level officials. Managed critical last-minute change requests and conducted hands-on training for DPP makers.",
      },
    ],

    techStack: {
      frontend: [
        "React.js",
        "Redux Toolkit",
        "Tailwind",
        "OpenLayers",
        "Google Maps API",
        "React Charts",
      ],
      backend: ["Node.js", "Express", "PostgreSQL", "GeoServer"],
      devops: ["Git/GitHub", "Windows Server", "IIS", "Jira"],
    },

    marqueeIcons: [
      Database,
      Server,
      Code2,
      Globe2,
      Layers,
      Box,
      Terminal,
      Cpu,
      GitBranch,
      Activity,
      ShieldCheck,
      Workflow,
    ],

    challenge: {
      title: "Bengali PDF Generation",
      desc: "Standard libraries failed to render complex Bengali scripts. Engineered a custom merge pipeline to ensure government-compliant reporting.",
    },
  },
  {
    id: "2",
    title: "IUNSD",
    subtitle: "Integrative Upscaling of National Sanitation Database",
    category: "WASH Data Hub",
    year: "2023",
    company: "DPHE",
    bannerIcon: Droplets,

    // Theme Colors
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
      {
        label: "Funded By",
        text: "Bill & Melinda Gates Foundation",
        icon: Droplets,
      },
    ],

    overview: `IUNSD stands as a landmark initiative in the WASH (Water, Sanitation, and Hygiene) sector of Bangladesh. Implemented under the Strengthening of Public Data Systems for Sanitation in Bangladesh (SPDSSB) program, it serves as a central intelligence hub for policy-makers.

    The system integrates with the Integrated Management Information System (IMIS) to capture dynamic, real-time changes in sanitation data. It provides detailed "City Profiles" that offer single and comparative views on critical metrics like SDG 6.2 indicators, Fecal Sludge Management (FSM) infrastructure, and groundwater contamination threats.
    
    A core feature is the visualization of the sanitation value chain through Shit Flow Diagrams (SFD) and complex Sankey charts, enabling authorities to track waste from containment to disposal.`,

    features: [
      {
        title: "Advanced Sankey Diagrams",
        desc: "Custom-built Sankey charts representing the 'Shit Flow Diagram' (SFD), visualizing the complete lifecycle of solid waste.",
        icon: ArrowRightLeft,
      },
      {
        title: "City Profile & Comparison",
        desc: "Detailed analytical views for individual cities and comparative tools for SDG indicators and institutional capacity.",
        icon: LayoutDashboard,
      },
      {
        title: "IMIS Integration",
        desc: "Seamless integration with IMIS to fetch and visualize dynamic operational data from municipalities.",
        icon: Database,
      },
      {
        title: "Multilingual Support",
        desc: "Full internationalization (i18n) support, ensuring accessibility for both local government officials and international partners.",
        icon: Languages,
      },
    ],

    contributions: [
      {
        title: "Complex Sankey Implementation",
        desc: "Engineered the most challenging visual component: the Sankey Chart for waste flow. This required complex manual data formulation algorithms to accurately map distinct flows from node to node.",
      },
      {
        title: "Full-Stack Development",
        desc: "Handled both frontend UI implementation in React and backend logic in Node.js/Express. Developed APIs for data retrieval and integration with the IMIS system.",
      },
      {
        title: "City Profile & Analytics",
        desc: "Developed the 'City Profile' module, integrating Sunburst, Interactive Bar, and Pie charts to visualize multi-dimensional sanitation data.",
      },
      {
        title: "System Architecture",
        desc: "Implemented the RBAC system for secure user management. Established the CI/CD workflow using Docker and managed deployment on Windows Servers.",
      },
    ],

    techStack: {
      frontend: [
        "React.js",
        "React Router",
        "Tailwind",
        "Sankey Charts",
        "Sunburst Charts",
        "i18n",
        "Figma",
      ],
      backend: ["Node.js", "Express", "PostgreSQL", "GeoServer"],
      devops: ["Docker", "CI/CD", "Windows Server", "HTML to PDF"],
    },

    marqueeIcons: [
      BarChart3,
      Map,
      LayoutDashboard,
      PieChart,
      ArrowRightLeft,
      Droplets,
      Database,
      Server,
      Code2,
      Globe2,
      Layers,
      Box,
    ],

    challenge: {
      title: "Manual Data Formulation",
      desc: "Developing the logic to trace 'distinct flows from node to node' for the Sankey charts was mathematically intensive, requiring custom backend algorithms to structure raw survey data.",
    },
  },
];
