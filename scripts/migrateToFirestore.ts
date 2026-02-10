/**
 * Migration Script: Populate Firestore with Portfolio Data
 *
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin --save-dev
 * 2. Download service account key from Firebase Console:
 *    - Go to Project Settings > Service accounts
 *    - Click "Generate new private key"
 *    - Save as "serviceAccountKey.json" in the scripts folder
 * 3. Run with: npx tsx scripts/migrateToFirestore.ts
 *
 * This script is designed to be run once to populate Firestore collections.
 * It converts icon components to string names for storage.
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample project data in Firestore format
const projectsData = [
  {
    id: "4",
    title: "TVET UMIMCC",
    subtitle: "Job Placement & Business Mentoring Platform",
    category: "Migration & Livelihood",
    year: "Jun 2023 - Sep 2023",
    company: "GIZ Hamburg",
    bannerIconName: "Users2",
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
      {
        label: "Client",
        text: "GIZ (Urban Migration Management)",
        iconName: "Building",
      },
      {
        label: "Coverage",
        text: "Khulna, Satkhira, Barisal, Rajshahi, Sirajganj",
        iconName: "Map",
      },
      {
        label: "Beneficiaries",
        text: "6,304 Graduates (74% Women)",
        iconName: "Users2",
      },
    ],
    overview: `The TVET project under the "Urban Management of Internal Migration due to Climate Change" (UMIMCC) initiative addresses the livelihood challenges faced by climate migrants in five partner cities of Bangladesh. As climate change displaces approximately six million people, vulnerable migrants often end up in underdeveloped urban slums without access to basic services and income opportunities.

This comprehensive digital platform was developed to track, mentor, and support 6,304 vocational and entrepreneurship training graduates—74% of whom are women—in securing employment and establishing small businesses. The system manages the entire lifecycle from baseline surveys through job placements, business mentoring, and continuous monitoring, creating a data-driven approach to improving livelihoods for climate-displaced populations.

Working across six divisions, the platform integrates multiple datasets, tracking graduate progress, coordinating with employers and financial institutions, and measuring project impact through performance-based frameworks. The system facilitated online marketing training for 250 graduates, Tally accounting training for 370 entrepreneurs, and organized job fairs and mentoring sessions across all partner cities.`,
    features: [
      {
        title: "Graduate Tracking Database",
        desc: "Comprehensive system managing 6,304 graduate profiles with geographic mapping and status monitoring.",
        iconName: "Database",
      },
      {
        title: "Job Placement Portal",
        desc: "Digital platform connecting vocational graduates with employers through job fairs and mentoring sessions.",
        iconName: "Target",
      },
      {
        title: "Business Mentoring System",
        desc: "Tracking and support framework for entrepreneurship graduates seeking financing and business guidance.",
        iconName: "Building",
      },
      {
        title: "Performance Analytics",
        desc: "Real-time monitoring dashboard with outcomes, indicators, baselines, and targets for project evaluation.",
        iconName: "BarChart",
      },
      {
        title: "Multi-City Coordination",
        desc: "Centralized management system coordinating activities across five partner municipalities.",
        iconName: "Globe2",
      },
      {
        title: "Training Management",
        desc: "Digital platform for organizing online marketing and accounting training programs.",
        iconName: "FileText",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
        caption: "Graduate Database & Tracking System",
        details:
          "Comprehensive dashboard showing the 6,304 training graduates across five cities, with real-time status updates on employment, business ventures, and training participation.",
      },
      {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        caption: "Job Placement & Mentoring Portal",
        details:
          "Interface connecting vocational training graduates with potential employers through digital job fairs and mentoring session scheduling.",
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        caption: "Performance Monitoring Analytics",
        details:
          "Comprehensive analytics dashboard tracking project outcomes against baseline indicators with gender-disaggregated data.",
      },
    ],
    contributions: [
      {
        title: "Multi-Division Data Integration",
        desc: "Analyzed and processed extensive datasets from six divisions into a unified tracking system.",
      },
      {
        title: "Graduate Progress Portal",
        desc: "Developed a comprehensive web portal for tracking the current job status of contacted trainees.",
      },
      {
        title: "Performance Framework Implementation",
        desc: "Built analytics tools to measure project efficiency and progress against baseline indicators.",
      },
    ],
    techStack: {
      frontend: ["React.js", "Dashboard UI", "Data Visualization", "Geospatial Mapping"],
      backend: ["Node.js", "Express", "PostgreSQL", "Data Processing"],
      devops: ["Database Management", "Multi-City Deployment", "Data Security"],
    },
    marqueeIconNames: ["Users2", "Database", "BarChart", "Target", "Building", "Map", "Globe2", "FileText", "Activity", "Settings", "Shield", "Workflow"],
    challenge: {
      title: "Multi-Division Data Consolidation",
      desc: "Integrating diverse datasets from six divisions with varying data quality while maintaining real-time status updates.",
    },
    order: 0,
  },
  {
    id: "5",
    title: "Survey Monitoring System",
    subtitle: "Real-Time GIS Survey Progress Tracking Platform",
    category: "Internal GIS Tool",
    year: "2023 - Present",
    company: "Tiller",
    bannerIconName: "Map",
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
      { label: "Project Type", text: "In-House Survey Management Tool", iconName: "Building" },
      { label: "Technology", text: "Full-Stack GIS Application", iconName: "Code2" },
      { label: "Impact", text: "Zero Data Loss & Real-Time Tracking", iconName: "Activity" },
    ],
    overview: `The Survey Monitoring System is a comprehensive in-house platform developed to revolutionize how large-scale geospatial survey projects are managed, tracked, and executed. Traditional survey workflows faced critical challenges: data loss during daily transfers, mismatches between field data and digital records, inefficient progress tracking, and inability to make real-time decisions on resource allocation.

This system transforms the entire survey lifecycle by dividing city areas into phases and working unit grids, enabling surveyors to conduct drone flights and manual surveys while digitizing data in 2D/3D using QGIS and other desktop GIS tools.`,
    features: [
      { title: "Real-Time Data Synchronization", desc: "Direct integration with QGIS for automatic database updates.", iconName: "Database" },
      { title: "Grid-Based Progress Tracking", desc: "Visual management of survey phases with color-coded completion status.", iconName: "Layers" },
      { title: "Interactive Web GIS Viewer", desc: "Web-based map interface for visualizing survey coverage.", iconName: "Globe2" },
      { title: "Automated Progress Analytics", desc: "Real-time dashboards showing completion percentages.", iconName: "BarChart" },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", caption: "Real-Time Survey Progress Dashboard", details: "Main dashboard showing live survey progress across all phases and grids." },
      { src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop", caption: "Interactive GIS Web Map Viewer", details: "Web-based GIS interface displaying survey grids overlaid on satellite imagery." },
    ],
    contributions: [
      { title: "Full-Stack Development", desc: "Architected and developed the complete system from database design to frontend UI." },
      { title: "QGIS Integration & Automation", desc: "Implemented Python scripts for seamless integration with QGIS." },
    ],
    techStack: {
      frontend: ["React.js", "OpenLayers", "Tailwind CSS", "Web GIS UI"],
      backend: ["Node.js", "Express", "PostgreSQL", "PostGIS", "Prisma ORM", "GeoServer"],
      devops: ["Real-Time Sync", "QGIS Integration", "Authentication"],
    },
    marqueeIconNames: ["Map", "Database", "Layers", "Globe2", "Code2", "Server", "Terminal", "GitBranch", "Settings", "Shield", "Activity", "Workflow"],
    challenge: {
      title: "Real-Time GIS Data Synchronization",
      desc: "Creating seamless integration between desktop GIS tools and a centralized database with real-time sync.",
    },
    order: 1,
  },
  {
    id: "1",
    title: "PLIS-ACCNLDP",
    subtitle: "Climate Resilient Planning System",
    category: "Govt. GIS Platform",
    year: "2022 - 2023",
    company: "Tiller",
    bannerIconName: "Map",
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
      { label: "Client", text: "Bangladesh Planning Commission", iconName: "Landmark" },
      { label: "Funded By", text: "GIZ (Germany)", iconName: "Users2" },
      { label: "Impact Goal", text: "Delta Plan 2100 & Vision 2041", iconName: "Target" },
    ],
    overview: `PLIS (Planning Information System) serves as the technological backbone for the ACCNLDP Phase II project, enabling the Bangladesh Planning Commission to mainstream climate considerations into national development planning.`,
    features: [
      { title: "Interactive GIS Analysis", desc: "Multi-layer map engine using OpenLayers for spatial decision-making.", iconName: "Layers" },
      { title: "Automated Reporting", desc: "One-click generation of climate clearance certificates in Bengali.", iconName: "FileText" },
      { title: "RBAC Security", desc: "Strict Role-Based Access Control managing ministerial hierarchy.", iconName: "ShieldCheck" },
      { title: "Digital Screening", desc: "Automated climate risk scoring algorithms for projects.", iconName: "Target" },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop", caption: "Multi-layer GIS Interface", details: "The core interface allows planners to toggle between satellite imagery and hazard layers." },
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", caption: "Project Screening Dashboard", details: "High-level statistical overview for ministry officials." },
    ],
    contributions: [
      { title: "Frontend Architecture & GIS", desc: "Led the React frontend development and OpenLayers-based GIS engine." },
      { title: "Solved Localization Challenge", desc: "Overcame Bengali language PDF rendering challenges." },
    ],
    techStack: {
      frontend: ["React.js", "Redux Toolkit", "Tailwind", "OpenLayers", "Google Maps API"],
      backend: ["Node.js", "Express", "PostgreSQL", "GeoServer"],
      devops: ["Git/GitHub", "Windows Server", "IIS", "Jira"],
    },
    marqueeIconNames: ["Database", "Server", "Code2", "Globe2", "Layers", "Box", "Terminal", "Cpu", "GitBranch", "Activity", "ShieldCheck", "Workflow"],
    challenge: {
      title: "Bengali PDF Generation",
      desc: "Standard libraries failed to render complex Bengali scripts. Required custom font embedding solution.",
    },
    order: 2,
  },
  {
    id: "2",
    title: "IUNSD",
    subtitle: "Integrative Upscaling of National Sanitation Database",
    category: "WASH Data Hub",
    year: "2023",
    company: "DPHE",
    bannerIconName: "Droplets",
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
      { label: "Implemented In", text: "DPHE Bangladesh", iconName: "Building" },
      { label: "Partners", text: "AIT Thailand, GWSC, ITN-BUET", iconName: "Users2" },
      { label: "Funded By", text: "Bill & Melinda Gates Foundation", iconName: "Droplets" },
    ],
    overview: `IUNSD stands as a landmark initiative in the WASH sector for Bangladesh, creating the nation's first comprehensive digital platform for tracking sanitation value chains.`,
    features: [
      { title: "Advanced Sankey Diagrams", desc: "Custom-built Sankey charts representing 'Shit Flow Diagram' for cities.", iconName: "ArrowRightLeft" },
      { title: "City Profile & Comparison", desc: "Detailed analytical views for individual cities with comparative metrics.", iconName: "LayoutDashboard" },
      { title: "IMIS Integration", desc: "Seamless integration with IMIS to fetch dynamic infrastructure data.", iconName: "Database" },
      { title: "Multilingual Support", desc: "Full internationalization (i18n) support for Bengali and English.", iconName: "Languages" },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1543286386-713df548e9cc?q=80&w=2070&auto=format&fit=crop", caption: "National Sanitation Data Overview", details: "High-level view for national policymakers." },
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", caption: "City Profile Dashboard", details: "Dashboard for specific municipality data." },
    ],
    contributions: [
      { title: "Complex Sankey Implementation", desc: "Engineered the Sankey Chart for waste flow visualization." },
      { title: "Full-Stack Development", desc: "Handled frontend UI and backend API logic." },
    ],
    techStack: {
      frontend: ["React.js", "React Router", "Tailwind", "Sankey Charts", "i18n"],
      backend: ["Node.js", "Express", "PostgreSQL", "GeoServer"],
      devops: ["Docker", "CI/CD", "Windows Server"],
    },
    marqueeIconNames: ["BarChart3", "Map", "LayoutDashboard", "PieChart", "ArrowRightLeft", "Droplets", "Database", "Server", "Code2", "Globe2", "Layers", "Box"],
    challenge: {
      title: "Manual Data Formulation",
      desc: "Developing the logic to trace 'distinct flows' through the sanitation chain was mathematically intensive.",
    },
    order: 3,
  },
  {
    id: "3",
    title: "INCLUDE Call for Ideas",
    subtitle: "Climate Innovation Platform for Urban Bangladesh",
    category: "Grant Management System",
    year: "2024 - 2025",
    company: "GIZ Bangladesh",
    bannerIconName: "Award",
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
      { label: "Client", text: "GIZ Bangladesh (INCLUDE Project)", iconName: "Building" },
      { label: "Municipalities", text: "Chapainawabganj, Charghat, Gaibandha, Sirajganj", iconName: "Landmark" },
      { label: "Funded By", text: "German Federal Ministry (BMZ)", iconName: "Users2" },
    ],
    overview: `The INCLUDE Call for Ideas platform serves as the digital backbone for a nationwide climate innovation challenge across four municipalities in Bangladesh.`,
    features: [
      { title: "Multi-Stage Application System", desc: "Managed online and paper-based submissions across 12 climate challenges.", iconName: "FileText" },
      { title: "Custom Evaluation Framework", desc: "Built specialized review workflows for eligibility and jury evaluation.", iconName: "UserCheck" },
      { title: "API-Powered Dashboards", desc: "Developed custom web applications using Good Grants API.", iconName: "BarChart" },
      { title: "Stakeholder Communication", desc: "Coordinated automated email broadcasts and SMS notifications.", iconName: "Mail" },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", caption: "Application Dashboard Overview", details: "Real-time analytics showing application statistics." },
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", caption: "Multi-Stage Review System", details: "Custom evaluation workflow managing multiple stages." },
    ],
    contributions: [
      { title: "Platform Administration & Configuration", desc: "Managed the entire Good Grants platform setup." },
      { title: "Custom API Integration", desc: "Built specialized web applications using Good Grants API." },
    ],
    techStack: {
      frontend: ["React.js", "Custom Dashboard UI", "Data Visualization"],
      backend: ["Good Grants Platform", "REST API Integration", "Automated Workflows"],
      devops: ["Platform Configuration", "User Management", "Email/SMS Systems"],
    },
    marqueeIconNames: ["Award", "FileText", "Users2", "BarChart", "Database", "Settings", "Shield", "Mail", "Bell", "Activity", "Target", "Workflow"],
    challenge: {
      title: "Complex Multi-Stage Workflow",
      desc: "Managing a sophisticated evaluation pipeline across multiple stakeholder groups.",
    },
    order: 4,
  },
];

const servicesData = [
  {
    iconName: "Code2",
    title: "Full-Stack Web Development",
    description: "Building scalable, production-ready web applications using React, Next.js, Node.js, and modern web standards—from frontend to backend.",
    order: 0,
  },
  {
    iconName: "LayoutDashboard",
    title: "Frontend Engineering",
    description: "Crafting responsive, accessible, and high-performance user interfaces with React, Next.js, HTML, CSS, and Tailwind for exceptional UX.",
    order: 1,
  },
  {
    iconName: "Server",
    title: "Backend & API Development",
    description: "Developing secure backend systems with Node.js and Next.js APIs, including authentication, role-based access control, and REST integrations.",
    order: 2,
  },
  {
    iconName: "Database",
    title: "Database & Server Management",
    description: "Managing PostgreSQL, MySQL, and Firebase databases along with deploying and maintaining applications on local servers and cloud infrastructure.",
    order: 3,
  },
  {
    iconName: "Wrench",
    title: "CI/CD, Testing & Deployment",
    description: "Implementing automated testing, Docker-based CI/CD pipelines, and smooth deployment workflows for reliable and maintainable systems.",
    order: 4,
  },
  {
    iconName: "LifeBuoy",
    title: "Technical Support & Event Facilitation",
    description: "Providing on-ground technical support as a backstopper—ensuring system stability, rapid issue resolution, and smooth project or event execution.",
    order: 5,
  },
];

const profileData = {
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
  bio: "React/Next.js frontend engineer. Delivers robust, tested code & enjoys collaborative problem-solving. Brings a positive, fun energy to the team, enhancing productivity & morale. Passionate about creating exceptional user experiences.",
};

const linksData = {
  facebook: "",
  linkedin: "",
  github: "",
  whatsapp: "",
};

async function migrateData() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

  // Check if service account file exists
  if (!existsSync(serviceAccountPath)) {
    console.error("\n❌ Service account key not found!");
    console.error("\nTo run this migration:");
    console.error("1. Go to Firebase Console > Project Settings > Service accounts");
    console.error("2. Click 'Generate new private key'");
    console.error("3. Save the file as 'serviceAccountKey.json' in the scripts folder");
    console.error(`   Expected path: ${serviceAccountPath}`);
    console.error("4. Run this script again");
    process.exit(1);
  }

  try {
    // Read and parse service account
    const serviceAccountJson = readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    // Initialize Firebase Admin
    initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore();
    console.log("✅ Firebase Admin initialized successfully\n");

    // Migrate Projects
    console.log("📁 Migrating projects...");
    const projectsCollection = db.collection("projects");
    for (const project of projectsData) {
      await projectsCollection.doc(project.id).set(project);
      console.log(`   ✓ Added project: ${project.title}`);
    }
    console.log(`   Total: ${projectsData.length} projects\n`);

    // Migrate Services
    console.log("🔧 Migrating services...");
    const servicesCollection = db.collection("services");
    for (let i = 0; i < servicesData.length; i++) {
      const service = servicesData[i];
      await servicesCollection.doc(`service-${i}`).set(service);
      console.log(`   ✓ Added service: ${service.title}`);
    }
    console.log(`   Total: ${servicesData.length} services\n`);

    // Migrate Profile
    console.log("👤 Migrating profile...");
    const profileCollection = db.collection("profile");
    await profileCollection.doc("main").set(profileData);
    console.log("   ✓ Added main profile");

    // Migrate Links
    await profileCollection.doc("links").set(linksData);
    console.log("   ✓ Added social links\n");

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Migration completed successfully!");
    console.log("═══════════════════════════════════════════════════");
    console.log("\nNext steps:");
    console.log("1. Verify data in Firebase Console");
    console.log("2. Update security rules in Firebase Console");
    console.log("3. Test the portfolio at http://localhost:5173");
    console.log("4. Test admin panel at http://localhost:5173/admin\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateData();
