/**
 * One-Time Script: Update Tiller Billing Compass with detailed info
 *
 * Run with: npx tsx scripts/update-billing-app.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updatedFields = {
  overview: `A full-stack billing and project management system built for Tiller to centralize consultancy engagement tracking, multi-installment billing, VAT/tax calculations, project guarantees, and market receivables across all active contracts.

Tiller handles numerous consultancy projects where payments are spread across multiple bills over the project duration. Tracking receivables, project guarantee (PG) deposits and expiry dates, financial milestones, and client-level revenue analytics was becoming unmanageable with spreadsheets. This application replaces that with a single platform featuring real-time dashboards, role-based access control, and comprehensive financial intelligence.

The dashboard provides a high-level financial summary — Total Budget, Total Received, Total Remaining, and Active Projects — alongside PG overview (Deposited/Cleared/Pending), monthly and yearly revenue charts, budget vs. received comparisons, project distribution visualizations, upcoming deadline alerts, and a project calendar. Each project has its own analytics page with milestone-level billing progress, allocation percentages, tentative and received dates, PG status with guarantee expiry tracking, and a document management system for file attachments.

The billing module enables milestone-level bill entry and payment recording with schedule tracking, allocation percentages, and status management. The client intelligence module provides per-client engagement analysis with budget share distribution, clearance trend charts, departmental engagement breakdowns, associated project listings, and revenue & collections waterfall charts. User management implements role-based access (Super Admin, System Administrator, Finance Manager, Project Manager) with session lock security and member administration.`,

  features: [
    {
      title: "Financial Dashboard",
      desc: "Real-time overview with Total Budget, Received, Remaining, Active Projects count, PG overview, monthly/yearly revenue charts, budget vs received bar charts, project distribution donut chart, upcoming deadlines, and project calendar with fiscal year filtering.",
      iconName: "BarChart3",
    },
    {
      title: "Project Management & Authorization",
      desc: "Full project lifecycle from authorization workflow with client entity, domain/category, division, agreement dates, financial milestone allocation with deliverables, to individual project analytics with milestone-level progress tracking and document attachments.",
      iconName: "Layers",
    },
    {
      title: "Billing & Collections",
      desc: "Global milestone-level billing tracker with bill entry, payment recording modals showing remaining calculations, VAT/tax handling, schedule vs actual dates, allocation percentages, and configurable column views filterable by project, status, department, and year.",
      iconName: "FileText",
    },
    {
      title: "Project Guarantee (PG) Tracking",
      desc: "Dedicated PG module tracking deposited, cleared, and pending guarantee amounts with expiry dates, clearance status, and financial summaries across all active contracts.",
      iconName: "ShieldCheck",
    },
    {
      title: "Client Intelligence",
      desc: "Client registry with budget share donut chart, clearance trend bar charts, per-client detail pages showing departmental engagement share, associated projects with status, and revenue & collections waterfall analysis.",
      iconName: "Users2",
    },
    {
      title: "Role-Based Access & Session Security",
      desc: "Multi-role user management (Super Admin, System Administrator, Finance Manager, Project Manager) with session lock screen, password management, suspend/delete actions, and role-specific permissions throughout the application.",
      iconName: "Shield",
    },
  ],

  contributions: [
    {
      title: "Full-Stack Architecture & Development",
      desc: "Designed and built the complete application end-to-end — from PostgreSQL database schema design to RESTful API development with Express/Node.js to the Next.js frontend with Shadcn UI components and Recharts visualizations.",
    },
    {
      title: "Financial Analytics & Visualization Engine",
      desc: "Developed the comprehensive dashboard analytics including budget tracking, monthly/yearly revenue trends, budget vs received comparisons, project distribution charts, PG calculations, client-level financial intelligence with waterfall charts, and upcoming deadline tracking.",
    },
    {
      title: "Project Authorization & Billing Workflow",
      desc: "Built the project creation authorization flow with milestone-based financial allocation, deliverable tracking, payment recording with remaining balance calculations, and document attachment system with drag-and-drop PDF uploads.",
    },
    {
      title: "Authentication & Role-Based Access Control",
      desc: "Implemented secure authentication with JWT, multi-role authorization system, session lock mechanism, and user management with role assignment, password reset, and account suspension capabilities.",
    },
  ],

  techStack: {
    frontend: ["Next.js", "React", "Tailwind CSS", "Shadcn UI", "Radix UI", "Recharts", "Lucide Icons"],
    backend: ["Express", "Node.js", "PostgreSQL", "REST API", "JWT Authentication"],
    devops: ["Vercel", "Role-Based Access Control", "Session Management"],
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
    desc: "Managing interconnected billing milestones with allocation percentages, VAT calculations, project guarantee deposits with expiry tracking, client-level receivable analytics, and real-time financial summaries across dozens of concurrent consultancy engagements — all while maintaining role-based data access and audit integrity.",
  },
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

    console.log("📝 Updating Tiller Billing Compass project...");
    const ref = db.collection("projects").doc("8");
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update(updatedFields);
      console.log("   ✓ Updated: overview, features, contributions, techStack, challenge\n");
    } else {
      console.log("   ⚠ Project 8 not found\n");
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Billing Compass project updated.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
