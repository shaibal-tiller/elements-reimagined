/**
 * Export current project images from Firestore
 * Run with: npx tsx scripts/export-images.ts
 */
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");
  if (!existsSync(serviceAccountPath)) { console.error("No key"); process.exit(1); }

  const sa = JSON.parse(readFileSync(serviceAccountPath, "utf-8")) as ServiceAccount;
  initializeApp({ credential: cert(sa) });
  const db = getFirestore();

  const snap = await db.collection("projects").orderBy("order", "asc").get();
  const result: Record<string, any> = {};

  snap.docs.forEach((doc) => {
    const data = doc.data();
    result[doc.id] = {
      title: data.title,
      imageCount: (data.images || []).length,
      images: (data.images || []).map((img: any, i: number) => ({
        index: i,
        src: img.src,
        caption: img.caption || "",
        details: img.details || "",
        type: img.type || "image",
      })),
    };
  });

  const outPath = join(__dirname, "images-export.json");
  writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`Exported to ${outPath}`);
  process.exit(0);
}
main();
