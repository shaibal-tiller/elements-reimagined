/**
 * One-Time Script: Seed images for Tiller Billing Compass project
 *
 * Run with: npx tsx scripts/seed-billing-images.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basePath = "/images/billing-compass";

const images = [
  {
    src: `${basePath}/01-login.png`,
    caption: "Secure Login & Authentication",
    details: "Clean login interface with email/password authentication, branded with Tiller's identity. Provides secure access to the Project & Billing Tracker with role-based entry points.",
  },
  {
    src: `${basePath}/02-dashboard-overview.png`,
    caption: "Financial Dashboard Overview",
    details: "Main dashboard showing Total Budget (৳43,98,00,000), Total Received, Total Remaining, Active Projects count, Project Guarantee overview with Deposited/Cleared/Pending, Monthly Revenue chart, and Budget vs Received comparison across projects.",
  },
  {
    src: `${basePath}/04-dashboard-fiscal-filter.png`,
    caption: "Fiscal Year Filtering",
    details: "Dashboard with fiscal year dropdown (FY 2025-26, FY 2024-25, etc.) filtering all financial metrics, allowing year-over-year comparison of budget, received amounts, and project guarantee status.",
  },
  {
    src: `${basePath}/05-dashboard-charts-calendar.png`,
    caption: "Analytics, Deadlines & Project Calendar",
    details: "Project Distribution donut chart showing allocation by project, Last Received payments panel, Upcoming Deadlines with countdown indicators, and interactive Project Calendar with milestone events for the current month.",
  },
  {
    src: `${basePath}/06-dashboard-projects-table.png`,
    caption: "Dashboard Projects Table View",
    details: "Tabular view of all projects with columns for Project Info, Client, Sign Date, Budget, Recovery percentage, and Status — with configurable column settings for customized views.",
  },
  {
    src: `${basePath}/07-project-management.png`,
    caption: "Project Management Hub",
    details: "Central project management page with financial summary cards, PG overview, and filterable project listing by Department, Category, Status, and Year with Create New Project functionality.",
  },
  {
    src: `${basePath}/08-project-authorization.png`,
    caption: "Project Authorization Workflow",
    details: "New project creation form with Project Identity, Client Entity selection, Domain/Category, Division, Agreement dates, Financial Milestones with deliverable allocation percentages (e.g. Inception 20%, Final Handover 80%), PG section, and document attachments.",
  },
  {
    src: `${basePath}/09-project-analytics.png`,
    caption: "Individual Project Analytics",
    details: "Detailed project view for 'Robi 5G Network Rollout Support' showing ৳12,00,00,000 budget, bill progress at 5% with 95% remaining, PG status (Deposited/Cleared/Pending with expiry), and milestone-level breakdown with allocation, expected, received, and remaining amounts.",
  },
  {
    src: `${basePath}/10-project-documents.png`,
    caption: "Project Document Management",
    details: "Document upload modal with drag-and-drop PDF support (10MB per file, 50MB total), enabling attachment of contracts, invoices, and project documents directly to each project.",
  },
  {
    src: `${basePath}/11-update-received.png`,
    caption: "Payment Recording Modal",
    details: "Update Received dialog showing milestone details (Spectrum Analysis), total project value, bill allocation, tentative date, remaining balance calculation, amount input with percentage reference, and payment date selection for recording received payments.",
  },
  {
    src: `${basePath}/12-billing-collections.png`,
    caption: "Billing & Collections Tracker",
    details: "Global billing view with Total Budget, Today's Received, Total Pending, Total Bills count (94), and milestone-level entries showing Milestone & Project, Schedule, Allocation %, Amount (BDT), and Status — filterable by Project, Status, Department, and Year.",
  },
  {
    src: `${basePath}/13-client-registry.png`,
    caption: "Client Registry & Directory",
    details: "Client management with Budget Share donut chart, Clearance Trend by Client bar chart, and Client Directory table showing Client Entity, Primary Contact, Active Projects, Financial Volume, and Received percentage.",
  },
  {
    src: `${basePath}/14-client-intelligence.png`,
    caption: "Client Intelligence Analytics",
    details: "Per-client deep dive showing Departmental Engagement Share breakdown, Associated Projects with status and budget, and Revenue & Collections Waterfall chart comparing billed vs received across all milestones.",
  },
  {
    src: `${basePath}/15-user-management.png`,
    caption: "User Management & Access Control",
    details: "Team member administration with User, Email, Role (super_admin, admin, user), Status indicators, and action menu for Change Password, Suspend, and Delete — supporting role-based access control across the platform.",
  },
  {
    src: `${basePath}/03-session-lock.png`,
    caption: "Session Lock Security",
    details: "Auto-locking session screen that activates on inactivity, requiring click-to-unlock for session resumption — preventing unauthorized access when users step away from their workstations.",
  },
];

async function main() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

  if (!existsSync(serviceAccountPath)) {
    console.error("\n❌ Service account key not found!\n");
    process.exit(1);
  }

  try {
    const serviceAccountJson = readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    initializeApp({ credential: cert(serviceAccount) });

    const db = getFirestore();
    console.log("✅ Firebase Admin initialized\n");

    console.log("🖼️  Seeding images for Tiller Billing Compass...");
    const ref = db.collection("projects").doc("8");
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update({ images });
      console.log(`   ✓ Added ${images.length} images\n`);
    } else {
      console.log("   ⚠ Project 8 not found\n");
    }

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Billing Compass images seeded.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
