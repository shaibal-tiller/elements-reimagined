/**
 * One-Time Script: Add the Portfolio Website itself as a Personal Project
 *
 * Run with: npx tsx scripts/add-portfolio-project.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const portfolioProject = {
  id: "9",
  slug: "portfolio-website",
  title: "Developer Portfolio",
  subtitle: "AI-Assisted Personal Portfolio & CMS",
  category: "Personal Project",
  year: "2025",
  company: "Personal",
  bannerIconName: "Code2",
  theme: {
    primary: "amber",
    secondary: "orange",
    bgMain: "bg-[#1a1207]",
    bgGradient: "from-amber-400 to-orange-400",
    accentBlur: "bg-amber-500",
    textMain: "text-[#1a1207]",
    pillBg: "bg-amber-500/10",
    pillBorder: "border-amber-500/20",
    pillText: "text-amber-400",
  },
  headerInfo: [
    {
      label: "Type",
      text: "Personal Portfolio",
      iconName: "User",
    },
    {
      label: "Built With",
      text: "Vibe Coding + Claude Code",
      iconName: "Zap",
    },
    {
      label: "Year",
      text: "2025",
      iconName: "Activity",
    },
  ],
  overview: `A modern developer portfolio built almost entirely through AI-assisted "vibe coding" using Claude Code and Lovable. The project showcases a complete full-stack architecture—React frontend with a custom admin CMS, Firebase backend for dynamic content, UploadThing for media management, and automated data seeding scripts—all orchestrated through conversational AI prompts rather than traditional manual coding.

The portfolio features a parallax hero section, smooth Lenis scrolling, a collapsible sidebar layout with a persistent profile card, dynamic project case study pages with image/video galleries and fullscreen viewers, a filterable portfolio grid with category tabs, an interactive resume page pulling data from Firestore, services section, testimonials carousel, and a contact form. The admin panel provides full CRUD for projects (with drag-and-drop image/video uploads, theme customization, icon selection from a 200+ Lucide registry, and live preview), services, profile information, and resume data.

What makes this project unique is the development methodology: the entire codebase—from component architecture to Firebase service layers to one-time data migration scripts—was generated through iterative AI conversations. Firestore data population was handled via typed TypeScript seed scripts for each project, with separate scripts for project metadata, image arrays with captions, web links, and category migrations. The deployment pipeline runs on Vercel with an Express dev server for UploadThing API routes during local development.`,

  features: [
    {
      title: "AI-Assisted Vibe Coding",
      desc: "Entire application built through conversational AI prompts using Claude Code and Lovable, from architecture decisions to component implementation to data migration scripts.",
      iconName: "Zap",
    },
    {
      title: "Dynamic Admin CMS",
      desc: "Full-featured admin panel with Firebase Auth, CRUD operations for projects/services/profile/resume, drag-and-drop media uploads via UploadThing, theme customizer with live preview, and icon picker from 200+ Lucide icons.",
      iconName: "Settings",
    },
    {
      title: "Project Case Study Pages",
      desc: "Rich project detail pages with parallax headers, animated tech stack marquees, feature grids, contribution highlights, challenge sections, and image/video galleries with fullscreen lightbox viewer supporting YouTube and Google Drive embeds.",
      iconName: "Layers",
    },
    {
      title: "Parallax & Smooth Scrolling",
      desc: "Custom parallax hero with scroll-based background movement, Lenis smooth scrolling throughout, animated section transitions, and a collapsible sidebar layout for detail pages.",
      iconName: "ArrowRightLeft",
    },
    {
      title: "Firebase Data Architecture",
      desc: "Firestore collections for projects, services, profile, links, and resume with typed TypeScript service layers, React Query caching, and custom hooks for real-time data fetching.",
      iconName: "Database",
    },
    {
      title: "Automated Data Seeding",
      desc: "Suite of typed TypeScript scripts using Firebase Admin SDK for populating project data, images with captions, web links, category migrations, and bulk updates—enabling programmatic content management.",
      iconName: "Terminal",
    },
  ],

  images: [],

  contributions: [
    {
      title: "AI-First Development Workflow",
      desc: "Pioneered a vibe coding approach where every component, service, hook, and utility was generated through iterative AI conversations—proving that complex full-stack applications can be built almost entirely through natural language prompts.",
    },
    {
      title: "Full-Stack Architecture Design",
      desc: "Designed the complete application architecture: React + Vite frontend, Firebase/Firestore backend, UploadThing media pipeline, Express dev server, Tanstack React Query data layer, and Vercel deployment—all through AI-guided decisions.",
    },
    {
      title: "Admin CMS & Content Pipeline",
      desc: "Built a comprehensive admin panel with authentication, project form with 10+ sections (theme, icons, features, images, tech stack, contributions, challenges), drag-and-drop image/video management, and inline preview capabilities.",
    },
    {
      title: "Data Migration & Seeding Scripts",
      desc: "Created 12+ TypeScript scripts using Firebase Admin SDK for project creation, image seeding with detailed captions, web link population, category migrations, Firestore export/import, and bulk field updates—establishing a scriptable content pipeline.",
    },
  ],

  techStack: {
    frontend: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Shadcn UI",
      "Radix UI",
      "Lucide Icons",
      "Lenis Smooth Scroll",
      "Embla Carousel",
      "React Router",
      "Tanstack React Query",
    ],
    backend: [
      "Firebase",
      "Firestore",
      "Firebase Auth",
      "UploadThing",
      "Express Dev Server",
      "Firebase Admin SDK",
    ],
    devops: [
      "Vercel",
      "Claude Code",
      "Lovable",
      "Vibe Coding",
      "TypeScript Seed Scripts",
    ],
  },

  marqueeIconNames: [
    "Code2",
    "Zap",
    "Database",
    "Settings",
    "Layers",
    "Globe2",
    "Terminal",
    "Palette",
    "Shield",
    "Activity",
    "Server",
    "ArrowRightLeft",
  ],

  challenge: {
    title: "AI-Driven Full-Stack Development",
    desc: "Building a production-quality portfolio with dynamic CMS, media management, complex UI interactions (parallax, galleries, smooth scrolling), and a scriptable data pipeline—entirely through AI-assisted vibe coding without writing traditional code manually.",
  },

  coverMedia: [],
  order: 8,
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

    // Add portfolio project
    console.log("📁 Adding Developer Portfolio project...");
    const ref = db.collection("projects").doc(portfolioProject.id);
    const existing = await ref.get();

    if (existing.exists) {
      console.log("   ⚠ Project 9 already exists, updating...");
      await ref.update(portfolioProject);
      console.log("   ✓ Updated: Developer Portfolio\n");
    } else {
      await ref.set(portfolioProject);
      console.log("   ✓ Added: Developer Portfolio\n");
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Developer Portfolio project added.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
