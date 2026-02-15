import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase/config";
import { convertFirestoreProject } from "../lib/firebase/converters";
import { FirestoreProject, Project } from "../types/firebase";

const COLLECTION_NAME = "projects";

/**
 * Fetch all projects from Firestore, ordered by custom order field
 */
export const getProjects = async (): Promise<Project[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }

  const projectsRef = collection(db, COLLECTION_NAME);
  const q = query(projectsRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  const projects = snapshot.docs.map((doc) => {
    const data = { ...doc.data(), id: doc.id } as FirestoreProject;
    return convertFirestoreProject(data);
  });

  return projects;
};

/**
 * Fetch a single project by ID from Firestore
 */
export const getProject = async (id: string): Promise<Project | null> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }

  const projectRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = { ...snapshot.data(), id: snapshot.id } as FirestoreProject;
  return convertFirestoreProject(data);
};

/**
 * Create a new project in Firestore
 */
export const createProject = async (
  project: FirestoreProject
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const projectRef = doc(db, COLLECTION_NAME, project.id);
  await setDoc(projectRef, project);
};

/**
 * Update an existing project in Firestore
 * Uses setDoc to fully replace the document, ensuring fields like images: []
 * are written correctly (updateDoc shallow merge can leave stale array data).
 */
export const updateProject = async (
  id: string,
  updates: FirestoreProject
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const projectRef = doc(db, COLLECTION_NAME, id);
  await setDoc(projectRef, updates);
};

/**
 * Delete a project from Firestore
 */
export const deleteProject = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const projectRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(projectRef);
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
