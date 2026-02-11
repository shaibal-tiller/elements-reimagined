import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase/config";
import { FirestoreResume } from "../types/firebase";

const COLLECTION_NAME = "resume";
const RESUME_DOC_ID = "main";

/**
 * Fetch resume data from Firestore
 */
export const getResume = async (): Promise<FirestoreResume> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }

  const resumeRef = doc(db, COLLECTION_NAME, RESUME_DOC_ID);
  const snapshot = await getDoc(resumeRef);

  if (!snapshot.exists()) {
    throw new Error("Resume not found in database");
  }

  return snapshot.data() as FirestoreResume;
};

/**
 * Update resume data in Firestore
 */
export const updateResume = async (
  updates: Partial<FirestoreResume>
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const resumeRef = doc(db, COLLECTION_NAME, RESUME_DOC_ID);

  const snapshot = await getDoc(resumeRef);
  if (snapshot.exists()) {
    await updateDoc(resumeRef, updates);
  } else {
    await setDoc(resumeRef, updates);
  }
};

export default {
  getResume,
  updateResume,
};
