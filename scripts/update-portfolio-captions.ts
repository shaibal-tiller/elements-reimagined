/**
 * One-Time Script: Update image captions, details & order for Developer Portfolio project (id: 9)
 *
 * Run with: npx tsx scripts/update-portfolio-captions.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Current index → desired order position, plus caption & details
// Current indices (from export):
//  0  = Image Editor Annotate mode
//  1  = Image Editor Crop mode
//  2  = Admin Edit Project – Images tab
//  3  = Admin Edit Project – Theme tab
//  4  = Admin Edit Project – Info tab
//  5  = Admin Profile Settings
//  6  = Admin Services Management
//  7  = Admin Login page
//  8  = Admin Projects Dashboard
//  9  = Public Case Study (PLIS-ACCNLDP)
//  10 = Public Blog page
//  11 = Public Resume page
//  12 = Public Portfolio page
//  13 = Public Contact page
//  14 = Public Services page
//  15 = Admin Edit Project – Image Upload progress

// Desired order (by current index):
// 12, 9, 11, 10, 14, 13, 7, 8, 4, 3, 2, 15, 1, 0, 5, 6
const desiredOrder = [12, 9, 11, 10, 14, 13, 7, 8, 4, 3, 2, 15, 1, 0, 5, 6];

const captions: Record<number, { caption: string; details: string }> = {
  12: {
    caption: "Portfolio Grid & Project Cards",
    details:
      "The main portfolio page with a persistent sidebar profile card, categorized project sections (Client Works, Inhouse Projects, Personal Projects), and richly styled project cards featuring cover images, category pills, tech stack tags, and themed color gradients—all dynamically rendered from Firestore data.",
  },
  9: {
    caption: "Project Case Study Detail Page",
    details:
      "A full-length project case study page for PLIS-ACCNLDP showing the collapsible sidebar layout, parallax banner with animated tech marquee, header info chips (Client, Agency, Year), project context overview, categorized tech stack pills with custom theme colors, and the System Modules & Features grid—all pulled live from Firestore.",
  },
  11: {
    caption: "Interactive Resume Page",
    details:
      "The resume page displaying Technical Skills organized by category (Frontend, Backend & Database, DevOps & Tools, Specialized) as styled pills, followed by a Professional Competencies section—all data-driven from Firestore. The persistent sidebar shows the profile card with social links, contact button, and personal details.",
  },
  10: {
    caption: "Blog & Articles Page",
    details:
      "The blog section featuring article cards with titles, publication dates, reading time estimates, category tags, and short descriptions. Each article links externally with a 'Read Full Article' call-to-action. The sidebar profile card remains persistent for seamless navigation across all pages.",
  },
  14: {
    caption: "My Services Page",
    details:
      "The services page presenting a grid of professional service offerings—Full-Stack Web Development, Frontend Engineering, Backend & API Development, and Database & Server Management—each with descriptive text and an 'Order now' link. Services are managed dynamically through the admin CMS.",
  },
  13: {
    caption: "Contact Page & Message Form",
    details:
      "The contact section with a two-column layout: Contact Information (email, phone, location) with social media connect links on the left, and a structured 'Send a Message' form (Name, Email, Subject, Message) with a submit button on the right. The parallax hero banner with Video Resume button is visible above.",
  },
  7: {
    caption: "Admin Panel Login",
    details:
      "The admin authentication gate featuring a centered login card with Email and Password fields, a 'Sign In' primary button, Google OAuth sign-in option, and a 'Forgot password?' recovery link. The dark-themed UI with purple accent indicates the admin-only access boundary protected by Firebase Auth.",
  },
  8: {
    caption: "Admin Projects Dashboard",
    details:
      "The admin panel's project management hub showing all portfolio projects as thumbnail cards in a responsive grid. Each card displays the project's cover image, title, and subtitle. The top navigation provides tabs for Projects, Services, Profile, and Resume management, with an 'Add Project' action button.",
  },
  4: {
    caption: "Project Editor – Basic Info Tab",
    details:
      "The project creation/edit modal showing the Info tab with fields for Project ID, Display Order, Title, Subtitle, Category dropdown, Year, Company, and Banner Icon selector. The Header Info section below allows adding labeled metadata chips (Type, Client, Year) with individual icon pickers. A live card preview panel on the right updates in real-time.",
  },
  3: {
    caption: "Project Editor – Theme Customizer",
    details:
      "The Theme tab of the project editor featuring Quick Presets (Indigo, Emerald, Amber, Lime, etc.), granular Color Identity pickers for Primary and Secondary colors, Background color controls with hex inputs, and Gradient configuration with color and shade selectors—all reflected instantly in the live preview card on the right.",
  },
  2: {
    caption: "Project Editor – Images & Gallery Manager",
    details:
      "The Images tab showing the drag-and-drop media management interface with uploaded project screenshots listed with captions and descriptions. Each image entry displays a thumbnail, editable caption and details fields, and action buttons. The live preview panel on the right shows the current card state with media count stats.",
  },
  15: {
    caption: "Project Editor – Bulk Image Upload",
    details:
      "The project editor during an active bulk upload session, showing multiple image files uploading simultaneously with individual progress bars, file sizes, and status indicators. The live preview card on the right updates the media count in real-time as uploads complete, demonstrating the UploadThing-powered media pipeline.",
  },
  1: {
    caption: "Built-In Image Editor – Crop Mode",
    details:
      "The integrated image editor in Crop mode with an interactive crop rectangle overlay on a project screenshot. The bottom toolbar shows aspect ratio presets (Free, 16:9, 4:3, 1:1), current crop dimensions in pixels, and an 'Apply Crop' button. The editor supports free-form and constrained cropping with draggable corner and edge handles.",
  },
  0: {
    caption: "Built-In Image Editor – Annotate Mode",
    details:
      "The integrated image editor in Annotate mode with a left toolbar providing drawing tools (rectangles, circles, arrows, lines, text), a color palette with 12+ colors, stroke width options, and font size controls with Undo/Delete actions. Enables non-destructive annotation overlays on project screenshots before saving and uploading.",
  },
  5: {
    caption: "Admin Profile Settings",
    details:
      "The Profile management page in the admin panel with editable fields for Full Name, Short Name, Primary and Business Email, Phone numbers, City, Country, Full Address, and a Bio text area—all persisted to Firestore. The 'Save Profile' button commits changes that reflect across the public-facing portfolio sidebar and contact sections.",
  },
  6: {
    caption: "Admin Services Manager",
    details:
      "The Services management page showing all professional service offerings in an editable card grid. Each service card displays its title and description with edit (pencil) and delete (trash) action icons. The '+ Add Service' button enables creating new service entries that appear dynamically on the public services page.",
  },
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

    const ref = db.collection("projects").doc("9");
    const snap = await ref.get();

    if (!snap.exists) {
      console.error("❌ Project 9 (Developer Portfolio) not found!");
      process.exit(1);
    }

    const data = snap.data()!;
    const currentImages = data.images || [];

    console.log(`📷 Found ${currentImages.length} images\n`);

    if (currentImages.length !== desiredOrder.length) {
      console.error(
        `❌ Mismatch: ${currentImages.length} images in Firestore but ${desiredOrder.length} in desired order`
      );
      process.exit(1);
    }

    // Reorder and update captions
    const reorderedImages = desiredOrder.map((oldIdx, newIdx) => {
      const img = { ...currentImages[oldIdx] };
      const cap = captions[oldIdx];
      if (cap) {
        img.caption = cap.caption;
        img.details = cap.details;
      }
      console.log(`  ${newIdx + 1}. [was ${oldIdx}] ${cap?.caption || img.caption}`);
      return img;
    });

    await ref.update({ images: reorderedImages });

    console.log("\n═══════════════════════════════════════════════════");
    console.log("✅ Done! Developer Portfolio images reordered & captioned.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
