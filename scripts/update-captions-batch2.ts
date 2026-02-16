/**
 * One-Time Script: Update captions for Billing Compass (project 8),
 * Exemplar Consortium (project 10), and IUNSD videos (project 2)
 *
 * Run with: npx tsx scripts/update-captions-batch2.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Billing Compass (Project 8) ── 15 images ─────────────────────────────────
const billingCaptions = [
  {
    caption: "User Management and Roles",
    details:
      "The User Management page displays a Members table listing system users with columns for User name, Email, Role, Status, and Actions. Four users are shown including Super Admin, System Administrator, Finance Manager, and Project Manager, each with assigned roles and status badges. A dropdown action menu is visible with options for Change Password, Edit, and Delete, along with an 'Add Member' button at the top.",
  },
  {
    caption: "Client Intelligence Analytics",
    details:
      "The Client Intelligence page shows analytics for a selected client, featuring a Departmental Engagement Share donut chart highlighting Engineering engagement, an Associated Projects panel listing project details with status and value, and a Revenue & Collections Waterfall bar chart comparing billed versus received amounts across multiple projects with green and pink stacked bars.",
  },
  {
    caption: "Client Registry & Directory",
    details:
      "The Client Registry page displays a Budget Share donut chart and a Clearance Trend by Client bar chart at the top, followed by a Client Directory table listing companies with columns for Primary Contact, Direct Projects count, Financial Figures, and status indicators. An 'Add Client' button and Column Settings control are available.",
  },
  {
    caption: "Billing & Collections Overview",
    details:
      "The Billing & Collections page presents four summary KPI cards showing Total Budget, Today Received, Total Pending, and Total Bills. Filter dropdowns for All Projects, Statuses, Departments, and Years sit above a detailed milestone-level billing table with columns for milestone name, amounts, completion percentage, and BDT received/remaining for items like Advance Payment, Requirements & Design, and Development Phases.",
  },
  {
    caption: "Record Payment Update Modal",
    details:
      "A modal dialog titled 'Update Received' overlays the interface, showing payment recording for a project milestone. It displays Total Project Value, Bill Allocation, Tentative Date, and Remaining to Collect fields. An Amount Input with percentage toggle, 'Pay Full Remaining' checkbox, Payment Date picker, and 'Record Payment' action button are visible.",
  },
  {
    caption: "Project Documents Upload",
    details:
      "A modal dialog titled 'Project Documents' displays over the Project Analytics page. The modal shows a 'No documents uploaded yet' message and an Upload Documents section with a drag-and-drop zone instructing users to upload PDF files with file size limits per file and total.",
  },
  {
    caption: "Project Analytics Detail View",
    details:
      "The Project Analytics page shows a project's total value with category label. Two circular progress indicators display billed and remaining percentages. A Project Guarantee (PG) section shows deposited, claimed, and clearance amounts with PG expiry date. Below is a Milestones table listing items with columns for allocation percentages, amounts, received, remaining, target dates, and payment recording actions.",
  },
  {
    caption: "Project Authorization Form",
    details:
      "A Project Authorization modal form displays fields for Project Identity, Total Valuation, Client Entity, Domain/Category, Division, Agreement and End Dates. A Financial Milestones section shows milestone rows with description, value percentage, target date, and amount fields. A 'Perfect Allocation' indicator confirms 100% allocation, followed by Project Guarantee, Document Attachments, and 'Authorize Project Creation' button.",
  },
  {
    caption: "Project Management Hub",
    details:
      "The Project Management page shows four top-level KPI cards for Total Budget, Total Received, Total Pending, and Active Projects. A PG Overview section displays deposited, cleared, and pending guarantee amounts. Filter dropdowns for Departments, Categories, Status, and Years sit above a project listing table showing entries with client, date, budget, and status columns.",
  },
  {
    caption: "Dashboard with Project Filters",
    details:
      "The Dashboard page displays filtered financial KPIs—Total Budget, Total Received, Total Remaining, and Active Projects count. The PG Overview shows guarantee values. Below is a togglable Charts/Projects view on the Projects tab, listing projects with client names, dates, and budget figures in a clean tabular layout.",
  },
  {
    caption: "Analytics, Deadlines & Calendar",
    details:
      "The lower Dashboard section shows a Project Distribution donut chart segmented by project with a color-coded legend, a 'Last Received' panel highlighting the most recent payment. Below are Upcoming Deadlines cards listing projects with amounts and days-left countdowns, and a Project Calendar with date cells containing event markers and project milestone entries.",
  },
  {
    caption: "Financial Dashboard Charts",
    details:
      "The main Dashboard view shows KPI summary cards for Total Budget, Total Received, Total Remaining, and Active Projects with a fiscal year filter dropdown. The PG Overview displays guarantee amounts. Below are two charts: a Monthly Revenue area chart tracking revenue over months, and a horizontal Budget vs Received bar chart comparing budgeted versus received amounts per project.",
  },
  {
    caption: "Session Lock Screen",
    details:
      "A full-screen Session Locked overlay with a soft gradient background in light green and white tones. A centered lock icon inside a circular badge is shown above 'Session Locked' text with the instruction 'Click anywhere to unlock and resume', providing an idle-timeout security feature that protects the application when the user is away.",
  },
  {
    caption: "Dashboard Financial Overview",
    details:
      "The Dashboard displays primary financial KPI cards showing Total Budget, Total Received, Total Pending, and Active Projects with no filters applied. The PG Overview shows deposited, cleared, and pending guarantee amounts. Below are a Monthly Revenue area chart with revenue trends and a horizontal Budget vs Received bar chart comparing actual vs remaining across all projects.",
  },
  {
    caption: "Login Authentication Page",
    details:
      "The Tiller Billing Compass login page features the Tiller logo and 'Project & Billing Tracker' tagline, a 'Welcome back' heading with Email Address and Password input fields, a prominent 'Sign In' button, and a footer note about secure access. The background features a subtle wave pattern with faint bar chart graphics.",
  },
];

// ─── Exemplar Consortium (Project 10) ── 8 images ──────────────────────────────
const exemplarCaptions = [
  {
    caption: "Contact Page With Form",
    details:
      "The Contact page features a 'Have A Project in Mind?' heading under a 'GET IN TOUCH' label, with contact info cards on the left (Email Us, Find Us at Shibbari More Khulna, and Call Us) and a multi-field contact form on the right with Name, Email, Phone, Country, and Message fields plus a 'Submit Now' button.",
  },
  {
    caption: "Project Gallery With Filters",
    details:
      "The Gallery page displays a blue gradient hero banner with the title 'Gallery' and subtitle. Below, a 'Project Gallery' section shows filterable category tabs (All, Interior, Commercial, Residence) with a grid of architectural project thumbnail images including interior spaces, commercial buildings, and residential properties.",
  },
  {
    caption: "Team Members Profile Page",
    details:
      "The Team page introduces Exemplar Consortium Ltd. as the first of its kind in the greater Khulna Region. It showcases two team members: Zahir Haider (Suden) as Chairman & Chief Architect with photo, bio, and skill tags (Residential Design, Commercial Design, Interior Design), and Pritam Das as Managing Director with expertise in Marketing, Branding, Management Consultancy, and Business Analytics.",
  },
  {
    caption: "Portfolio Project Detail Modal",
    details:
      "A modal overlay displays the 'Mr. Monir Residence' project detail page, showing a large hero image of a modern multi-story residential building. Below are project metadata (Client, Location: Khulna Bangladesh, Year: 2023), a description of the architectural and interior design project, and a Project Gallery section with additional building view thumbnails.",
  },
  {
    caption: "Portfolio Page Project Cards",
    details:
      "The Portfolio page features a blue gradient hero with 'Our Portfolio' title. Below, a 'Portfolio Gallery' section with filter tabs (All, Interior, Commercial, Residence) displays project cards including Phoenix Fashion, Home Interior of Dr S Ahsan Ahmed, and Moonera Medical Clinic, each with a thumbnail image and description.",
  },
  {
    caption: "Homepage Hero & Recent Works",
    details:
      "The homepage displays a hero section with the tagline 'Delivering Excellence in Architecture & Consulting' over a gradient background with abstract shapes. Below, a 'Recent Works' section shows four project cards: Phoenix Fashion, Dr S Ahsan Ahmed Home, Moonera Medical Clinic, and Mr. Monir Residence, each with thumbnail images and category labels.",
  },
  {
    caption: "Services Overview Grid Layout",
    details:
      "The services section presents six service cards in a two-row, three-column grid under 'Services Tailored to Your Needs.' Each card has a blue icon and description: Architectural Solutions, GIS Mapping, Interior & Exterior Design, Survey & Data Collection, Market Research, and Construction Works.",
  },
  {
    caption: "About Hero With Team Photo",
    details:
      "The About/landing page hero features a bold blue gradient background with 'Exemplar Consortium Ltd.' heading and a tagline describing it as a dynamic consulting firm in Khulna for project management, architecture, engineering, and research. Two CTA buttons ('Our Works' and 'Contact Us') are displayed alongside hero images showing a conference room and group team photo.",
  },
];

// ─── IUNSD Videos (Project 2) ── indices 24-28 ────────────────────────────────
const iunsdVideoCaptions = [
  {
    index: 24,
    caption: "Platform Overview Demo",
    details:
      "Video walkthrough demonstrating the National Sanitation Dashboard platform, showcasing the main navigation, city profile selection, and key data visualization features including sanitation indicators and geographic mapping capabilities.",
  },
  {
    index: 25,
    caption: "Survey Data Collection Flow",
    details:
      "Video demonstration of the survey management workflow, showing how survey questionnaires are created, assigned to cities, and submitted through the platform's data collection pipeline for nationwide sanitation monitoring.",
  },
  {
    index: 26,
    caption: "City Comparison Analytics",
    details:
      "Video showcase of the city comparison and analytics features, including side-by-side SDG indicator comparisons, sanitation metric visualizations, and interactive chart filtering across multiple municipal areas.",
  },
  {
    index: 27,
    caption: "Admin Panel Walkthrough",
    details:
      "Video tour of the administrative modules including User Management, Project Management, Survey Management, IMIS Data Management, and City Profile Data Management—demonstrating the platform's role-based access and data governance capabilities.",
  },
  {
    index: 28,
    caption: "GIS Infrastructure Mapping",
    details:
      "Video demonstration of the GIS mapping features showing interactive infrastructure maps with sanitation facility markers, treatment plant locations, and geographic data overlays for FSM & SWM infrastructure across Bangladesh.",
  },
];

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

    // Helper to update captions
    async function updateProjectCaptions(
      projectId: string,
      projectName: string,
      captions: { caption: string; details: string }[],
      videoIndices?: { index: number; caption: string; details: string }[]
    ) {
      console.log(`📝 Updating ${projectName} (Project ${projectId})...`);
      const ref = db.collection("projects").doc(projectId);
      const snap = await ref.get();

      if (!snap.exists) {
        console.log(`   ⚠ Project ${projectId} not found\n`);
        return;
      }

      const data = snap.data()!;
      const images = data.images || [];

      let updated = 0;

      if (videoIndices) {
        // Update specific indices (for videos)
        for (const v of videoIndices) {
          if (v.index < images.length) {
            images[v.index].caption = v.caption;
            images[v.index].details = v.details;
            updated++;
          }
        }
      } else {
        // Update all images in order
        for (let i = 0; i < captions.length; i++) {
          if (i < images.length) {
            images[i].caption = captions[i].caption;
            images[i].details = captions[i].details;
            updated++;
          }
        }
      }

      await ref.update({ images });
      console.log(`   ✓ Updated ${updated} captions\n`);
    }

    // 1. Billing Compass (15 images)
    await updateProjectCaptions("8", "Tiller Billing Compass", billingCaptions);

    // 2. Exemplar Consortium (8 images)
    await updateProjectCaptions(
      "10",
      "Exemplar Consortium",
      exemplarCaptions
    );

    // 3. IUNSD Videos (indices 24-28)
    await updateProjectCaptions(
      "2",
      "IUNSD Videos",
      [],
      iunsdVideoCaptions
    );

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Captions updated for all 3 projects.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
