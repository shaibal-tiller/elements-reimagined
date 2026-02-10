import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase/config";
import { convertFirestoreProfile, convertFirestoreLinks } from "../lib/firebase/converters";
import { FirestoreProfile, FirestoreLinks, Profile, Links } from "../types/firebase";

const COLLECTION_NAME = "profile";
const PROFILE_DOC_ID = "main";

/**
 * Fetch profile data from Firestore
 */
export const getProfile = async (): Promise<Profile> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }

  const profileRef = doc(db, COLLECTION_NAME, PROFILE_DOC_ID);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    throw new Error("Profile not found in database");
  }

  const data = snapshot.data() as FirestoreProfile;
  return convertFirestoreProfile(data);
};

/**
 * Fetch social links from Firestore
 */
export const getLinks = async (): Promise<Links> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }

  const linksRef = doc(db, COLLECTION_NAME, "links");
  const snapshot = await getDoc(linksRef);

  if (!snapshot.exists()) {
    throw new Error("Links not found in database");
  }

  const data = snapshot.data() as FirestoreLinks;
  return convertFirestoreLinks(data);
};

/**
 * Update profile data in Firestore
 */
export const updateProfile = async (
  updates: Partial<FirestoreProfile>
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const profileRef = doc(db, COLLECTION_NAME, PROFILE_DOC_ID);

  // Check if document exists
  const snapshot = await getDoc(profileRef);
  if (snapshot.exists()) {
    await updateDoc(profileRef, updates);
  } else {
    // Create if doesn't exist
    await setDoc(profileRef, updates);
  }
};

/**
 * Update social links in Firestore
 */
export const updateLinks = async (
  updates: Partial<FirestoreLinks>
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const linksRef = doc(db, COLLECTION_NAME, "links");

  // Check if document exists
  const snapshot = await getDoc(linksRef);
  if (snapshot.exists()) {
    await updateDoc(linksRef, updates);
  } else {
    // Create if doesn't exist
    await setDoc(linksRef, updates);
  }
};

export default {
  getProfile,
  getLinks,
  updateProfile,
  updateLinks,
};
