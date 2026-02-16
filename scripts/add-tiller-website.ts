/**
 * One-Time Script: Add Tiller Website Project + Update Existing Categories
 *
 * Run with: npx tsx scripts/add-tiller-website.ts
 *
 * Prerequisites:
 * - serviceAccountKey.json in the scripts folder
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// New Tiller Website project
const tillerWebsiteProject = {
  id: "6",
  slug: "tiller-official-website",
  title: "Tiller Official Website",
  subtitle: "Corporate Website Modernization",
  category: "Company Product",
  year: "2022",
  company: "Tiller",
  bannerIconName: "Globe2",
  theme: {
    primary: "cyan",
    secondary: "teal",
    bgMain: "bg-[#164e63]",
    bgGradient: "from-cyan-400 to-teal-400",
    accentBlur: "bg-cyan-500",
    textMain: "text-[#164e63]",
    pillBg: "bg-cyan-500/10",
    pillBorder: "border-cyan-500/20",
    pillText: "text-cyan-400",
  },
  headerInfo: [
    {
      label: "Company",
      text: "Tiller",
      iconName: "Building",
    },
    {
      label: "Type",
      text: "Corporate Website Rebuild",
      iconName: "Globe2",
    },
    {
      label: "Year",
      text: "2022",
      iconName: "Activity",
    },
  ],
  overview: `Rebuilt the Tiller official company website from a legacy WordPress setup to a modern React + Express Node.js stack. The new platform features dynamic content management, a modern responsive design, and a custom admin portal for managing site content without relying on third-party CMS plugins.

The migration addressed performance bottlenecks, security vulnerabilities, and design limitations of the old WordPress site. The new architecture enables faster page loads, better SEO, and a fully customizable content management experience tailored to Tiller's specific needs.`,
  features: [
    {
      title: "WordPress Migration",
      desc: "Complete migration from WordPress to a custom React + Express stack with zero downtime.",
      iconName: "ArrowRightLeft",
    },
    {
      title: "Dynamic CMS",
      desc: "Custom content management system for updating site content, blog posts, and team information.",
      iconName: "LayoutDashboard",
    },
    {
      title: "Admin Portal",
      desc: "Built-in admin panel for managing all website content without external CMS dependencies.",
      iconName: "Settings",
    },
    {
      title: "Responsive Design",
      desc: "Fully responsive layout optimized for all devices from mobile to large desktop screens.",
      iconName: "Layers",
    },
    {
      title: "SEO Optimization",
      desc: "Server-side rendering and metadata management for improved search engine visibility.",
      iconName: "Target",
    },
  ],
  images: [],
  contributions: [
    {
      title: "Full-Stack Architecture",
      desc: "Designed and built the complete React frontend and Express Node.js backend.",
    },
    {
      title: "WordPress Content Migration",
      desc: "Migrated all existing content from WordPress to the new custom CMS.",
    },
    {
      title: "Admin Panel Development",
      desc: "Built a custom admin portal for non-technical team members to manage content.",
    },
  ],
  techStack: {
    frontend: ["React", "Responsive Design", "SEO", "Modern UI"],
    backend: ["Express", "Node.js", "Custom CMS", "REST API"],
    devops: ["Deployment", "Domain Migration", "Performance Optimization"],
  },
  marqueeIconNames: [
    "Globe2",
    "Code2",
    "Server",
    "LayoutDashboard",
    "Settings",
    "Layers",
    "Target",
    "ArrowRightLeft",
    "Terminal",
    "Cpu",
  ],
  challenge: {
    title: "Zero-Downtime WordPress Migration",
    desc: "Migrating all content and functionality from WordPress to a custom stack while maintaining site availability and SEO rankings.",
  },
  coverMedia: [],
  order: 5,
};

// Category updates for existing projects
const categoryUpdates: Record<string, string> = {
  "1": "Client Project",    // PLIS-ACCNLDP
  "2": "Client Project",    // IUNSD
  "3": "Client Project",    // INCLUDE Call for Ideas
  "4": "Client Project",    // TVET UMIMCC
  "5": "In-House Tool",     // Survey Monitoring System
};

async function main() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

  if (!existsSync(serviceAccountPath)) {
    console.error("\n❌ Service account key not found!");
    console.error(`   Expected path: ${serviceAccountPath}`);
    console.error("   Download from Firebase Console > Project Settings > Service accounts\n");
    process.exit(1);
  }

  try {
    const serviceAccountJson = readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore();
    console.log("✅ Firebase Admin initialized\n");

    // 1. Add Tiller Website project
    console.log("📁 Adding Tiller Official Website project...");
    await db.collection("projects").doc(tillerWebsiteProject.id).set(tillerWebsiteProject);
    console.log("   ✓ Added: Tiller Official Website\n");

    // 2. Update existing project categories
    console.log("🏷️  Updating existing project categories...");
    for (const [id, category] of Object.entries(categoryUpdates)) {
      const ref = db.collection("projects").doc(id);
      const snap = await ref.get();
      if (snap.exists) {
        await ref.update({ category });
        console.log(`   ✓ ${snap.data()?.title} → "${category}"`);
      } else {
        console.log(`   ⚠ Project ${id} not found, skipping`);
      }
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log("✅ Done! Tiller Website added + categories updated.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
