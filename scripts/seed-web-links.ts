/**
 * One-Time Script: Seed webLinks for existing projects
 *
 * Run with: npx tsx scripts/seed-web-links.ts
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

// Web links to seed per project ID
const projectWebLinks: Record<string, { label: string; url: string }[]> = {
  // PLIS-ACCNLDP
  "1": [
    { label: "Live Deployment", url: "http://118.179.197.118:84/" },
    { label: "GitHub Repository", url: "https://github.com/tiller-bd/ACCNLDP2" },
  ],
  // IUNSD
  "2": [
    { label: "Live Deployment", url: "https://sanboard.gov.bd/" },
  ],
  // TVET UMIMCC
  "4": [
    { label: "GitHub Repository", url: "https://github.com/tiller-bd/tvet-socio-economic-survey" },
  ],
  // INCLUDE Call for Ideas
  "3": [
    { label: "Grant Platform", url: "https://include-call-for-ideas.grantplatform.com" },
    { label: "Management App", url: "https://include-cfi.vercel.app/" },
    { label: "GitHub Repository", url: "https://github.com/shaibalsharif/csv-uploader-include-callForIdea" },
  ],
  // Tiller Official Website
  "6": [
    { label: "Frontend Repository", url: "https://github.com/tiller-bd/tiller-website-frontend" },
    { label: "Admin Portal Repository", url: "https://github.com/tiller-bd/tiller-web-admin" },
  ],
  // RGPST - Personal Project
  "7": [
    { label: "Project Website", url: "https://sites.google.com/diu.edu.bd/rgpst" },
    { label: "Final Defense", url: "https://sites.google.com/diu.edu.bd/rgpst/final-defense" },
  ],
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

    console.log("🔗 Seeding web links for projects...");
    for (const [id, webLinks] of Object.entries(projectWebLinks)) {
      const ref = db.collection("projects").doc(id);
      const snap = await ref.get();
      if (snap.exists) {
        await ref.update({ webLinks });
        console.log(`   ✓ ${snap.data()?.title} — ${webLinks.length} link(s)`);
      } else {
        console.log(`   ⚠ Project ${id} not found, skipping`);
      }
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log("✅ Done! Web links seeded.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
