/**
 * One-Time Script: Update image captions & details for PLIS, IUNSD, and INCLUDE projects
 *
 * Run with: npx tsx scripts/update-image-captions.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── PLIS-ACCNLDP (Project 1) ── 13 images ───────────────────────────────────
const plisImages = [
  {
    caption: "Storm Surge Inundation Map",
    details:
      "Interactive GIS map displaying storm surge inundation depth for a 25-year return period. The OpenLayers-based viewer overlays hazard data on OpenStreetMap with fill-in percentage indicators, enabling planners to assess flood risk at proposed infrastructure sites.",
  },
  {
    caption: "Land Use Classification Table",
    details:
      "Tabular breakdown of land use types—Commercial, Community Service, Education, Mixed Use, Residential, and more—with Upazila-level fill-in percentages. A color-coded land use map below visualizes the spatial distribution across the selected area.",
  },
  {
    caption: "Delta Hotspot Climate Screening",
    details:
      "Climate Check questionnaire interface in Bengali showing Delta Hotspot analysis for 'Barind and Drought Prone Areas' in Sirajganj, Rajshahi Division, with 100% fill-in completion. Questions assess climate vulnerability factors with Yes/No/Not Applicable radio options.",
  },
  {
    caption: "Overall Analysis Result",
    details:
      "Complete Climate Check Method Questionnaire (CCMQ General 25.2) for project 'Construction Of R451' under Agency For Training, Rajshahi Division. Shows the full set of climate screening questions in Bengali with answer options and remarks fields for each criterion.",
  },
  {
    caption: "Climate Screening Questionnaire",
    details:
      "Focused view of the climate screening form showing individual CCMQ questions with Bengali-language prompts evaluating land use patterns, soil conditions, and environmental impact factors. Each question includes Yes/No/Not Applicable options with expandable remarks sections.",
  },
  {
    caption: "Analysis Loading State",
    details:
      "Overall Analysis Result page with loading indicator, showing the system processing climate risk calculations for the submitted project. The header displays PLIS branding with Bangladesh Planning Commission logo and GIZ support badges.",
  },
  {
    caption: "Multi-Layer GIS Analysis Engine",
    details:
      "Full GIS interface with the layer panel expanded on the left showing toggleable layers: Water Resources, Physical Features, Soil Condition, Spatial Planning & Landuse, Disaster Management (Flood/Cyclone return periods), and NAP projections. The main map displays Delta Hotspot zones with a comprehensive legend showing land use categories.",
  },
  {
    caption: "KML File Upload Interface",
    details:
      "Project location upload page with drag-and-drop KML file attachment area. Allows users to upload geographic boundary files (.kml format) for spatial analysis, with Back and Submit action buttons for the workflow.",
  },
  {
    caption: "User Profile & Navigation",
    details:
      "User profile page showing account details—ID, Username, Email, User Type (Agency User), Agency Name, and Ministry Name—with the navigation dropdown expanded showing links to Home, Project List, Profile, Change Password, Useful Links, and Sign Out.",
  },
  {
    caption: "Change Password Modal",
    details:
      "Security dialog overlaying the Profile Details page with fields for Current Password, New Password, and Confirm New Password. Enables authenticated users to update their credentials within the PLIS system.",
  },
  {
    caption: "User Profile Details",
    details:
      "Clean profile page displaying the logged-in user's information including ID, Username (Training 01), Email, User Type (Agency User), Agency Name (Agency for Training), and Ministry Name, with the government emblem and option to change profile photo.",
  },
  {
    caption: "All Projects List",
    details:
      "Project management table listing all submitted infrastructure projects with columns for Project Name, Department, Project Location, View on Map, and View PDF. Includes projects across multiple districts (Dhaka, Gazipur, Comilla, Khulna, Sirajganj) with pagination and 'Add new Project' functionality.",
  },
  {
    caption: "Login & Landing Page",
    details:
      "PLIS login screen with a dramatic climate-themed background showing storm clouds over agricultural land. Features the system description, email/password authentication fields, and quick-access links to Useful Resources, PLIS User Manual, CCM Report, Climate Check Method, and Climate Change Policy documents.",
  },
];

// ─── IUNSD (Project 2) ── 24 images (indices 0-23, skip 24-28 videos) ────────
const iunsdImages = [
  {
    caption: "City Profile Map Data Upload",
    details:
      "Admin interface for inserting city profile map data with dropdowns for City (Ajmiriganj), Year (2018), and Map Data Type (FSM & SWM Infrastructure Map Data). Includes a drag-and-drop Excel file upload area for bulk data import into the geospatial database.",
  },
  {
    caption: "IMIS Dashboard",
    details:
      "IMIS (Integrated Management Information System) data dashboard showing published datasets from multiple cities including Khulna, Innova, and Lakshmipur with upload dates, uploader emails, publication status, and View action buttons for each entry.",
  },
  {
    caption: "Survey Questionnaire Builder",
    details:
      "Modal dialog for creating survey questions within the questionnaire builder. Allows setting Question text, Response Type dropdown, Icon selection, Required flag, and Remarks field—enabling dynamic survey form creation for sanitation data collection.",
  },
  {
    caption: "Survey Template Selection",
    details:
      "Create Survey Questionnaire page with three tabs: Select Template, Create New, and File Import. Shows available templates—50 City Survey 2025, 23 Town Survey, and 61 Districts—with a 'Proceed with Selected Template' button for quick questionnaire setup.",
  },
  {
    caption: "Questionnaire File Import",
    details:
      "File Import tab of the Create Survey Questionnaire module with a drag-and-drop area for Excel file upload. Enables bulk import of pre-formatted questionnaire structures for rapid deployment across multiple survey campaigns.",
  },
  {
    caption: "Survey City Assignment Manager",
    details:
      "Manage Survey page with a modal showing city assignments for the '50 City Survey'. Lists municipalities (Sonaimuri, Debidwar, Daudkandi, Chauddagram) with City Type, submission Status, and Remove actions. Background shows the full survey list with assignment and submission tracking.",
  },
  {
    caption: "Survey Management Dashboard",
    details:
      "Central survey management view listing all surveys—50 City Survey, 23 Town Survey, and Survey-2020—with columns for Assigned Cities, Submitted Cities, Assignment/End Dates, and action buttons for View Mapped Questionnaire, City List, and Data Submission management.",
  },
  {
    caption: "Survey Questionnaire List",
    details:
      "Questionnaire management table showing three completed questionnaires (50 City Survey 2025, 23 Town Survey, 61 Districts) with creation dates, completion status, and action buttons: Use Template, View Questionnaire, Mapped Survey, and Delete Questionnaire.",
  },
  {
    caption: "View Survey Questionnaire",
    details:
      "Detailed questionnaire viewer for '50 City Survey 2025' displaying structured questions including Coordinate of the Area (GEO_POINT type), interview participation consent (Dropdown), and Type of Settlement with slum/non-slum options—showing the full question structure and response types.",
  },
  {
    caption: "Create New Survey Form",
    details:
      "Survey creation form with fields for Survey Title, Questionnaire selection, Survey Project, City/Cities multi-selector, and Start/End Date pickers. Features the Bengali language toggle and the full navigation sidebar with all platform modules visible.",
  },
  {
    caption: "KII Management Module",
    details:
      "Key Informant Interview (KII) management dashboard listing interview campaigns with Assigned Cities, Submitted Cities, Assignment/End Dates, and action buttons for View Mapped Questionnaire, City List, and Data Submission—supporting qualitative data collection workflows.",
  },
  {
    caption: "Project List & Management",
    details:
      "Project management view showing three survey projects: 50 City Survey (2024), 23 Town Survey (2022), and a Feasibility Study for IT-Based Smart Solid Waste & Faecal Sludge Management Systems across 53 District Level Paurashavas & 8 City Corporations (2019-2021).",
  },
  {
    caption: "Add User Registration Form",
    details:
      "User registration form with fields for First Name, Last Name, Email, Role selection dropdown, Department, Designation, Password, and Confirm Password—enabling role-based user provisioning for the National Sanitation Dashboard.",
  },
  {
    caption: "User Role Assignment Modal",
    details:
      "User management panel with a role assignment modal for 'Sadman Rahman' showing user details (Email, Role: Project Director, Department: MIS, Designation: Programmer) with a Role selector and Assign/Reject buttons. Background shows the full user list with Active/Inactive status indicators.",
  },
  {
    caption: "User Management Panel",
    details:
      "Users administration page with summary cards (Total Users: 10, Departments: 1, Active: 5, Inactive: 5) and a detailed table showing Name, Role, Department, Designation, and Action buttons (Activate, Manage User, Deactivate) with status indicators and filter options.",
  },
  {
    caption: "Admin Modules Hub",
    details:
      "Central modules page displaying seven management areas: User Management, Project Management, KII Management, Survey Management, Survey Questionnaire, KII Questionnaire, IMIS Data Management, and City Profile Data Management—each with descriptive icons and subtitles.",
  },
  {
    caption: "Sanitation Data Charts",
    details:
      "Interactive bar chart for Cumilla showing containment type distribution (No containment, Double pit, Septic tank, Single pit lined, Single pit unlined/dug hole) grouped by 'Ever Desludged' status. Includes city selector, chart type, dataset filters, and Export as PNG/XLSX options.",
  },
  {
    caption: "City Profile Comparison Dashboard",
    details:
      "Side-by-side city comparison view for Cumilla and Bogura showing Overview tab with SDG indicators for sanitation—Safely managed, Basic, Limited, Unimproved, Open defecation percentages—along with geographic data (Wards, Area, Population) displayed in donut charts.",
  },
  {
    caption: "Infrastructure & GIS Map View",
    details:
      "City Profile Infrastructure tab showing sanitation infrastructure inventory—Dustbins, Vacuum Tankers, STS locations—and Vehicles used in SWM (Rickshaws, Compactors, Dump Trucks). Below is an interactive FSM & SWM Infrastructure Map with color-coded markers and legend.",
  },
  {
    caption: "FSTP Details & Selection",
    details:
      "Fecal Sludge Treatment Plant (FSTP) detail page for Sakhipur with a dropdown listing all treatment plants nationwide. Shows Basic Information (Province, Area, Asset Owner: Government of Bangladesh, Project: Water Aid) and Technical Information including capacity, cost, and operational data.",
  },
  {
    caption: "Indicators Chart & Map View",
    details:
      "National indicators visualization with expandable sections for Citywide Inclusive Sanitation (CWIS), Solid Waste Management (SWM), and SDG 6.2. The Chart tab displays a ranked bar chart of waste segregation percentages across all cities, color-coded by performance levels.",
  },
  {
    caption: "National Indicators Map",
    details:
      "Geographic map view of sanitation indicators across Bangladesh showing district-level data points on an interactive map. Left panel provides indicator selection for CWIS, SWM metrics, and SDG 6.2 with a heat-map legend for performance visualization.",
  },
  {
    caption: "IMIS Cities CWIS Dashboard",
    details:
      "City-level CWIS (Citywide Inclusive Sanitation) dashboard for Dhaka (2024) displaying 12 key performance indicators in a grid layout—including FS disposal rates, treatment capacity (247), FSTP compliance, LC population access, and universal design metrics with numerical values.",
  },
  {
    caption: "Home Page (Bengali)",
    details:
      "National Sanitation Dashboard landing page in Bengali (ন্যাশনাল স্যানিটেশন ড্যাশবোর্ড) with an illustrated banner depicting the sanitation value chain—from household containment through collection, transport, and treatment. Shows the bilingual toggle and navigation to City Profile and City Comparison modules.",
  },
];

// ─── INCLUDE Call for Ideas (Project 3) ── 5 images ───────────────────────────
const includeImages = [
  {
    caption: "Call for Ideas Application Card",
    details:
      "Good Grants application card showing the INCLUDE Call for Ideas round with 1,024 total applications, the Viewing Round period (21 Dec - 31 Jan 2026), and four municipality photographs representing the climate challenge locations across urban Bangladesh.",
  },
  {
    caption: "Landing Page & Application Portal",
    details:
      "INCLUDE Call for Ideas landing page on Good Grants platform with bilingual support (English/Bengali), social sharing buttons, step-by-step application guide (Register, Start Application, Submit), and the 'Start Application' call-to-action linking to the IdeaForm submission portal.",
  },
  {
    caption: "Applicant Registration Form",
    details:
      "Registration page branded with German Cooperation, GIZ, and Bangladesh government logos. Collects First Name, Last Name, Email, and Password (12+ characters with complexity requirements), plus GDPR consent and communication preferences checkboxes.",
  },
  {
    caption: "Applicant Dashboard Overview",
    details:
      "Authenticated applicant dashboard showing Important Grants Information with submission dates, support contact details, editing guidelines, and the Call for Ideas - INCLUDE application card with 'Start Application' button. The bottom section displays 'My Applications' listing with status tracking.",
  },
  {
    caption: "My Applications & Submission Tracker",
    details:
      "Applicant's submission management view showing the active application rounds, Important Grants Information panel with deadline warnings and editing permissions, and the My Applications table with Active/Current filter tabs and search functionality for tracking submission status.",
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

    // Helper to update captions for a project
    async function updateProjectImages(
      projectId: string,
      projectName: string,
      captions: { caption: string; details: string }[]
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
      for (let i = 0; i < captions.length; i++) {
        if (i < images.length && images[i].type !== "video") {
          images[i].caption = captions[i].caption;
          images[i].details = captions[i].details;
          updated++;
        }
      }

      await ref.update({ images });
      console.log(`   ✓ Updated ${updated} image captions\n`);
    }

    // 1. PLIS-ACCNLDP
    await updateProjectImages("1", "PLIS-ACCNLDP", plisImages);

    // 2. IUNSD (only images, skip videos at indices 24-28)
    await updateProjectImages("2", "IUNSD", iunsdImages);

    // 3. INCLUDE Call for Ideas
    await updateProjectImages("3", "INCLUDE Call for Ideas", includeImages);

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! Image captions updated for all 3 projects.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
