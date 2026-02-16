/**
 * One-Time Script: Add Exemplar Consortium website as a Personal Project
 *
 * Run with: npx tsx scripts/add-exemplar-project.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exemplarProject = {
  id: "10",
  slug: "exemplar-consortium",
  title: "Exemplar Consortium Ltd.",
  subtitle: "Architecture, Consulting & Research Firm Website",
  category: "Personal Project",
  year: "2024",
  company: "Personal",
  bannerIconName: "Building2",
  theme: {
    primary: "teal",
    secondary: "cyan",
    bgMain: "bg-[#0a1a1f]",
    bgGradient: "from-teal-400 to-cyan-400",
    accentBlur: "bg-teal-500",
    textMain: "#0a1a1f",
    pillBg: "bg-teal-500/10",
    pillBorder: "border-teal-500/20",
    pillText: "text-teal-400",
  },
  headerInfo: [
    {
      label: "Type",
      text: "Corporate Website",
      iconName: "Building2",
    },
    {
      label: "Client",
      text: "Exemplar Consortium Ltd.",
      iconName: "Briefcase",
    },
    {
      label: "Year",
      text: "2024",
      iconName: "Activity",
    },
  ],
  overview: `A high-performance, responsive corporate website designed and built end-to-end for Exemplar Consortium Ltd. (ECL)—an architecture, consulting, and research firm based in Khulna, Bangladesh, founded in 2022 with a vision to be a one-stop solution in the southern region. The platform serves as the firm's primary business acquisition tool, showcasing complex architectural portfolios, diverse consulting services, and professional credentials across multiple dedicated modules.

The website is structured into six core modules: a Home page with an immersive hero section, trust indicators (Projects Completed, Clients Served), and a "Delivering Excellence" highlight; an About section detailing ECL's corporate journey and categorized track record (Public & Commercial, Interior, Survey & Data Collection) with major client logos; a comprehensive Services page presenting 11+ professional offerings organized in an icon-based grid—spanning Architectural Solutions, GIS Mapping, Construction Works, Survey & Data Collection, Market Research, Social Research, Development Project Consultancy, Marketing & Branding, Management Consultancy, Business Solutions, and Event Management; a Portfolio section with interactive category filtering (All, Interior, Commercial, Residence) featuring projects like Phoenix Fashion retail interior, Dr. S Ahsan Ahmed Residence, Moonera Medical Clinic, and Mr. Monir Residence; a high-resolution Gallery providing a mosaic view of design projects; and a Contact module optimized for lead generation with multi-channel contact (email, phone, address, operating hours) and a custom inquiry form.

Built with a modular React component-driven architecture for high code reusability, Tailwind CSS utility-first styling for a bespoke responsive design system, client-side SPA routing for instantaneous page transitions, and lazy-loading for high-resolution architectural images. Custom metadata and Open Graph tags are implemented for each section to ensure professional social sharing appearance. Deployed on Vercel's global Edge Network for low-latency delivery.`,

  features: [
    {
      title: "Multi-Module Architecture",
      desc: "Six dedicated modules—Home, About, Services, Portfolio, Gallery, and Contact—each serving a specific business function with modular React components enabling high code reusability across the platform.",
      iconName: "Layers",
    },
    {
      title: "Interactive Portfolio & Gallery",
      desc: "Portfolio section with category filtering (All, Interior, Commercial, Residence) showcasing projects like Phoenix Fashion, Moonera Medical Clinic, and residential interiors. Separate high-resolution Gallery with a mosaic grid view and lazy-loaded architectural imagery.",
      iconName: "Image",
    },
    {
      title: "Comprehensive Services Grid",
      desc: "Icon-based grid presenting 11+ professional offerings: Architectural Solutions, GIS Mapping, Construction Works, Survey & Data Collection, Market Research, Social Research, Development Consultancy, Marketing & Branding, Management Consultancy, Business Solutions, and Event Management.",
      iconName: "Grid3x3",
    },
    {
      title: "Lead Generation & Contact",
      desc: "Conversion-optimized Contact module with multi-channel access (admin@exemplar.com.bd, +880 1707110136, Shibbari More Khulna), operating hours (10 AM – 10 PM), and a custom inquiry form capturing Name, Email, Phone, Country, and Message.",
      iconName: "Mail",
    },
    {
      title: "Brand & Trust Building",
      desc: "About section with ECL's corporate journey since 2022, categorized track record, trust indicators (Projects Completed, Clients Served), 'Delivering Excellence' highlights, and Major Clients logo showcase for professional credibility.",
      iconName: "Award",
    },
    {
      title: "Performance & SEO Optimization",
      desc: "Lazy-loading for high-resolution images, custom metadata and Open Graph tags per section for social sharing, client-side SPA routing for instant transitions, and Vercel Edge Network deployment for low-latency global delivery.",
      iconName: "Zap",
    },
  ],

  images: [],

  contributions: [
    {
      title: "End-to-End Full Stack Development",
      desc: "Designed and developed the complete corporate platform from concept to production—including UI/UX design, modular React component architecture, responsive Tailwind CSS design system, SPA routing, image optimization, and Vercel deployment with CI/CD.",
    },
    {
      title: "Brand Identity & Visual Design",
      desc: "Translated Exemplar Consortium's multi-disciplinary identity (architecture, consulting, research) into a cohesive digital presence with a bespoke color system, professional typography, immersive hero sections, and visual hierarchy that communicates credibility.",
    },
    {
      title: "Information Architecture & Content Strategy",
      desc: "Structured six business-focused modules with clear user journeys—from the hero's dual CTAs through services discovery, portfolio proof-of-work, and contact conversion—organizing 11+ service categories and multiple project showcases into an intuitive flow.",
    },
    {
      title: "Performance Engineering",
      desc: "Implemented lazy-loading for architectural imagery, optimized asset delivery, configured Open Graph metadata for professional social sharing, and deployed on Vercel's Edge Network ensuring fast global content delivery with automatic HTTPS.",
    },
  ],

  techStack: {
    frontend: [
      "React",
      "Tailwind CSS",
      "Client-Side Routing",
      "Lucide Icons",
      "CSS Custom Properties",
      "Lazy Loading",
      "Open Graph / SEO",
      "Responsive Design",
    ],
    backend: [],
    devops: [
      "Vercel",
      "Edge Network CDN",
      "Git CI/CD",
    ],
  },

  marqueeIconNames: [
    "Building2",
    "Layers",
    "Globe2",
    "Palette",
    "Map",
    "Ruler",
    "Image",
    "Users",
    "Mail",
    "Smartphone",
    "Code2",
    "Briefcase",
  ],

  challenge: {
    title: "Multi-Disciplinary Corporate Platform",
    desc: "Building a high-performance corporate website that coherently represents a firm spanning architecture, GIS mapping, interior design, construction, research, and business consulting—organizing 11+ service categories, multiple portfolio projects with filtering, and a lead-generation pipeline into a unified, visually compelling platform that serves as the primary business acquisition tool.",
  },

  coverMedia: [],
  webLinks: [
    {
      label: "Live Site",
      url: "https://exemplar-consortium.vercel.app/",
    },
  ],
  order: 9,
};

async function main() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

  if (!existsSync(serviceAccountPath)) {
    console.error("\n❌ Service account key not found!");
    process.exit(1);
  }

  try {
    const serviceAccountJson = readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    initializeApp({ credential: cert(serviceAccount) });

    const db = getFirestore();
    console.log("✅ Firebase Admin initialized\n");

    // Add Exemplar Consortium project
    console.log("📁 Adding Exemplar Consortium project...");
    const ref = db.collection("projects").doc(exemplarProject.id);
    const existing = await ref.get();

    if (existing.exists) {
      console.log("   ⚠ Project 10 already exists, updating...");
      await ref.update(exemplarProject);
      console.log("   ✓ Updated: Exemplar Consortium Ltd.\n");
    } else {
      await ref.set(exemplarProject);
      console.log("   ✓ Added: Exemplar Consortium Ltd.\n");
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Exemplar Consortium project added.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
