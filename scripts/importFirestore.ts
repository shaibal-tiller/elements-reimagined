/**
 * Import Script: Restore Firestore data from JSON backup
 *
 * Prerequisites:
 * 1. Replace serviceAccountKey.json with the NEW project's key
 * 2. Run with: npx tsx scripts/importFirestore.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, "serviceAccountKey.json");
const backupPath = join(__dirname, "firestore-backup.json");

if (!existsSync(serviceAccountPath)) {
  console.error("serviceAccountKey.json not found in scripts/ folder");
  process.exit(1);
}

if (!existsSync(backupPath)) {
  console.error("firestore-backup.json not found in scripts/ folder");
  process.exit(1);
}

const serviceAccount: ServiceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf-8")
);

const backupData = JSON.parse(readFileSync(backupPath, "utf-8"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function importAll() {
  // Import projects
  if (backupData.projects) {
    console.log("Importing projects...");
    for (const [docId, data] of Object.entries(backupData.projects)) {
      await db.collection("projects").doc(docId).set(data as Record<string, unknown>);
      console.log(`  Imported project: ${docId}`);
    }
  }

  // Import services
  if (backupData.services) {
    console.log("Importing services...");
    for (const [docId, data] of Object.entries(backupData.services)) {
      await db.collection("services").doc(docId).set(data as Record<string, unknown>);
      console.log(`  Imported service: ${docId}`);
    }
  }

  // Import profile
  if (backupData.profile) {
    console.log("Importing profile...");
    for (const [docId, data] of Object.entries(backupData.profile)) {
      await db.collection("profile").doc(docId).set(data as Record<string, unknown>);
      console.log(`  Imported profile doc: ${docId}`);
    }
  }

  // Import resume
  if (backupData.resume) {
    console.log("Importing resume...");
    for (const [docId, data] of Object.entries(backupData.resume)) {
      await db.collection("resume").doc(docId).set(data as Record<string, unknown>);
      console.log(`  Imported resume doc: ${docId}`);
    }
  }

  console.log("\nImport complete!");
}

importAll().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
