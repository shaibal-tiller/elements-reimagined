/**
 * One-Time Script: Add Tiller Billing Management App Project
 *
 * Run with: npx tsx scripts/add-billing-app.ts
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

const billingProject = {
  id: "8",
  slug: "tiller-billing-management",
  title: "Tiller Billing Compass",
  subtitle: "Consultancy Project & Billing Management System",
  category: "In-House Tool",
  year: "2026",
  company: "Tiller",
  bannerIconName: "BarChart3",
  theme: {
    primary: "emerald",
    secondary: "teal",
    bgMain: "bg-[#064e3b]",
    bgGradient: "from-emerald-400 to-teal-400",
    accentBlur: "bg-emerald-500",
    textMain: "text-[#064e3b]",
    pillBg: "bg-emerald-500/10",
    pillBorder: "border-emerald-500/20",
    pillText: "text-emerald-400",
  },
  headerInfo: [
    {
      label: "Company",
      text: "Tiller",
      iconName: "Building",
    },
    {
      label: "Type",
      text: "Internal Business Tool",
      iconName: "BarChart3",
    },
    {
      label: "Year",
      text: "2026",
      iconName: "Activity",
    },
  ],
  overview: `A full-stack billing and project management system built for Tiller to track consultancy engagements, multi-installment billing, VAT/tax calculations, project guarantees, and market receivables across all active contracts.

Tiller handles numerous consultancy projects with payments spread across multiple bills over the project duration. Tracking receivables, project guarantee (PG) deposits and expiry, financial milestones, and client-level revenue analytics was becoming increasingly complex with spreadsheets. This application centralizes everything into a single platform with real-time dashboards, role-based access, and comprehensive financial intelligence.

The system features a rich analytics dashboard with budget vs. received comparisons, monthly revenue trends, project distribution charts, upcoming deadline tracking, and a project calendar. Each project has its own analytics page with milestone-level billing progress, PG status tracking, and document management. The client intelligence module provides per-client engagement analysis with revenue and collections waterfall charts.`,
  features: [
    {
      title: "Financial Dashboard",
      desc: "Real-time overview with total budget, received, remaining amounts, PG overview, monthly revenue charts, budget vs received analysis, and project distribution visualization.",
      iconName: "BarChart3",
    },
    {
      title: "Project Management",
      desc: "Full project lifecycle tracking with authorization workflow, financial milestones, deliverable allocation, department and category filtering, and fiscal year-based reporting.",
      iconName: "Layers",
    },
    {
      title: "Billing & Collections",
      desc: "Global milestone-level billing tracker with payment recording, VAT/tax handling, receivable vs received status, and configurable column views across all projects.",
      iconName: "FileText",
    },
    {
      title: "Project Guarantee Tracking",
      desc: "Dedicated PG module tracking deposited, cleared, and pending guarantee amounts with expiry dates across all active contracts.",
      iconName: "ShieldCheck",
    },
    {
      title: "Client Intelligence",
      desc: "Client registry with budget share analysis, clearance trends, departmental engagement breakdown, associated projects, and revenue & collections waterfall charts.",
      iconName: "Users2",
    },
    {
      title: "Role-Based Access & Security",
      desc: "Multi-role user management (Super Admin, Admin, User) with session lock, password management, and role-specific permissions.",
      iconName: "Shield",
    },
  ],
  images: [],
  contributions: [
    {
      title: "Full-Stack Architecture & Development",
      desc: "Designed and built the complete application from database schema to frontend UI using Next.js, Express, Node.js, and PostgreSQL.",
    },
    {
      title: "Financial Analytics Engine",
      desc: "Developed the dashboard analytics including budget tracking, revenue charts, PG calculations, and client-level financial intelligence.",
    },
    {
      title: "Project Authorization Workflow",
      desc: "Built the project creation flow with milestone-based financial allocation, deliverable tracking, and document attachment system.",
    },
  ],
  techStack: {
    frontend: ["Next.js", "React", "Tailwind CSS", "Recharts"],
    backend: ["Express", "Node.js", "PostgreSQL", "REST API"],
    devops: ["Vercel", "Authentication", "Role-Based Access Control"],
  },
  marqueeIconNames: [
    "BarChart3",
    "FileText",
    "ShieldCheck",
    "Users2",
    "Database",
    "Layers",
    "Building",
    "Settings",
    "Globe2",
    "Activity",
    "PieChart",
    "Shield",
  ],
  challenge: {
    title: "Complex Multi-Project Financial Tracking",
    desc: "Managing interconnected billing milestones, VAT calculations, project guarantees with expiry tracking, and client-level receivable analytics across dozens of concurrent consultancy engagements.",
  },
  coverMedia: [],
  webLinks: [
    { label: "Live Application", url: "https://tiller-billing-compass.vercel.app/" },
  ],
  order: 7,
};

async function main() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

  if (!existsSync(serviceAccountPath)) {
    console.error("\n❌ Service account key not found!");
    console.error(`   Expected path: ${serviceAccountPath}\n`);
    process.exit(1);
  }

  try {
    const serviceAccountJson = readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    initializeApp({ credential: cert(serviceAccount) });

    const db = getFirestore();
    console.log("✅ Firebase Admin initialized\n");

    console.log("📁 Adding Tiller Billing Compass project...");
    await db.collection("projects").doc(billingProject.id).set(billingProject);
    console.log("   ✓ Added: Tiller Billing Compass\n");

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Billing project added to Firestore.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
