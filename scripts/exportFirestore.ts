/**
 * Export Script: Download all Firestore data to JSON
 *
 * Run with: npx tsx scripts/exportFirestore.ts
 *
 * This exports all collections (projects, services, profile)
 * so you can re-import them into a new Firebase project.
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

if (!existsSync(serviceAccountPath)) {
  console.error("serviceAccountKey.json not found in scripts/ folder");
  process.exit(1);
}

const serviceAccount: ServiceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf-8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function exportAll() {
  const exportData: Record<string, Record<string, unknown>> = {};

  // Export projects
  console.log("Exporting projects...");
  const projectsSnap = await db.collection("projects").get();
  exportData.projects = {};
  projectsSnap.forEach((doc) => {
    exportData.projects[doc.id] = doc.data();
  });
  console.log(`  Found ${projectsSnap.size} projects`);

  // Export services
  console.log("Exporting services...");
  const servicesSnap = await db.collection("services").get();
  exportData.services = {};
  servicesSnap.forEach((doc) => {
    exportData.services[doc.id] = doc.data();
  });
  console.log(`  Found ${servicesSnap.size} services`);

  // Export profile
  console.log("Exporting profile...");
  const profileSnap = await db.collection("profile").get();
  exportData.profile = {};
  profileSnap.forEach((doc) => {
    exportData.profile[doc.id] = doc.data();
  });
  console.log(`  Found ${profileSnap.size} profile documents`);

  // Export resume
  console.log("Exporting resume...");
  const resumeSnap = await db.collection("resume").get();
  exportData.resume = {};
  resumeSnap.forEach((doc) => {
    exportData.resume[doc.id] = doc.data();
  });
  console.log(`  Found ${resumeSnap.size} resume documents`);

  // Save to file
  const outputPath = join(__dirname, "firestore-backup.json");
  writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  console.log(`\nExported to: ${outputPath}`);
  console.log("Done!");
}

exportAll().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
