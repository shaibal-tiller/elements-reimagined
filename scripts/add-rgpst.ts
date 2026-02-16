/**
 * One-Time Script: Add Realtime GPS Tracker (RGPST) Project
 *
 * Run with: npx tsx scripts/add-rgpst.ts
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

const rgpstProject = {
  id: "7",
  slug: "realtime-gps-tracker",
  title: "Realtime GPS Tracker",
  subtitle: "IoT-Based Real-Time GPS Tracking System",
  category: "Personal Project",
  year: "2019 - 2020",
  company: "Daffodil International University",
  bannerIconName: "Map",
  theme: {
    primary: "green",
    secondary: "emerald",
    bgMain: "bg-[#14532d]",
    bgGradient: "from-green-400 to-emerald-400",
    accentBlur: "bg-green-500",
    textMain: "text-[#14532d]",
    pillBg: "bg-green-500/10",
    pillBorder: "border-green-500/20",
    pillText: "text-green-400",
  },
  headerInfo: [
    {
      label: "University",
      text: "Daffodil International University",
      iconName: "Landmark",
    },
    {
      label: "Type",
      text: "BSc Final Year Project",
      iconName: "Award",
    },
    {
      label: "Supervisor",
      text: "Mr. Fahad Faisal, Sr. Lecturer",
      iconName: "UserCheck",
    },
  ],
  overview: `An IoT-based real-time GPS tracking system developed as a BSc final year project at Daffodil International University. The system uses an Arduino microcontroller paired with GPS, GSM/GPRS, SIM, and solar recharging modules to capture and transmit live location data to a centralized MySQL database.

An Android client application built with Java receives and visualizes the tracked coordinates on an interactive map, enabling remote real-time monitoring of people, vehicles, or assets. The solar-powered hardware module ensures continuous operation without frequent manual recharging.

The project addresses practical needs in rental and delivery service security, parental oversight for child safety, and general asset monitoring — providing an affordable, portable, and self-sustaining GPS tracking solution.`,
  features: [
    {
      title: "Real-Time GPS Tracking",
      desc: "Live location capture and transmission via GPS and GSM/GPRS modules with continuous data streaming.",
      iconName: "Map",
    },
    {
      title: "Android Client App",
      desc: "Java-based Android application for viewing and analyzing received location data on an interactive map.",
      iconName: "LayoutDashboard",
    },
    {
      title: "Solar-Powered Hardware",
      desc: "Onboard solar recharging module for self-sustaining, maintenance-free operation in the field.",
      iconName: "Activity",
    },
    {
      title: "Remote Location Monitoring",
      desc: "GPRS-based tracking system that remotely sends location of the attached device to the server.",
      iconName: "Globe2",
    },
    {
      title: "Arduino Microcontroller",
      desc: "Embedded system integrating GPS, GSM, SIM, and solar modules on a compact portable board.",
      iconName: "Cpu",
    },
    {
      title: "MySQL Data Storage",
      desc: "Centralized database storing all GPS coordinates and tracking history for analysis and playback.",
      iconName: "Database",
    },
  ],
  images: [],
  contributions: [
    {
      title: "Hardware Design & Assembly",
      desc: "Designed and assembled the Arduino-based hardware module with GPS, GSM, SIM, and solar components.",
    },
    {
      title: "Android Application Development",
      desc: "Built the Java-based Android client for real-time map visualization of tracked locations.",
    },
    {
      title: "Backend & Database Architecture",
      desc: "Set up the MySQL database and server-side logic for receiving and storing GPS data from the hardware module.",
    },
  ],
  techStack: {
    frontend: ["Java (Android)", "Google Maps API", "Real-Time UI"],
    backend: ["MySQL", "GPRS Data Server", "REST API"],
    devops: ["Arduino", "GPS Module", "GSM/SIM Module", "Solar Module"],
  },
  marqueeIconNames: [
    "Map",
    "Cpu",
    "Database",
    "Globe2",
    "Activity",
    "LayoutDashboard",
    "Server",
    "Settings",
    "Layers",
    "Terminal",
  ],
  challenge: {
    title: "Reliable Real-Time Data Transmission",
    desc: "Ensuring consistent GPS data transmission over GSM/GPRS networks while maintaining low power consumption on a solar-powered portable device.",
  },
  coverMedia: [],
  order: 6,
};

async function main() {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");

  if (!existsSync(serviceAccountPath)) {
    console.error("\n❌ Service account key not found!");
    console.error(`   Expected path: ${serviceAccountPath}`);
    console.error("   Download from Firebase Console > Project Settings > Service accounts\n");
    process.exit(1);
  }

  try {
    const serviceAccountJson = readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore();
    console.log("✅ Firebase Admin initialized\n");

    console.log("📁 Adding Realtime GPS Tracker project...");
    await db.collection("projects").doc(rgpstProject.id).set(rgpstProject);
    console.log("   ✓ Added: Realtime GPS Tracker (RGPST)\n");

    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Done! RGPST project added to Firestore.");
    console.log("═══════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

main();
