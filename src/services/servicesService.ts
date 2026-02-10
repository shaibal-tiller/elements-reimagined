import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase/config";
import { convertFirestoreService } from "../lib/firebase/converters";
import { FirestoreService, Service } from "../types/firebase";

const COLLECTION_NAME = "services";

/**
 * Fetch all services from Firestore, ordered by custom order field
 */
export const getServices = async (): Promise<Service[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }

  const servicesRef = collection(db, COLLECTION_NAME);
  const q = query(servicesRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  const services = snapshot.docs.map((doc) => {
    const data = { ...doc.data(), id: doc.id } as FirestoreService;
    return convertFirestoreService(data);
  });

  return services;
};

/**
 * Create a new service in Firestore
 */
export const createService = async (
  service: FirestoreService
): Promise<string> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const id = service.id || `service-${Date.now()}`;
  const serviceRef = doc(db, COLLECTION_NAME, id);
  await setDoc(serviceRef, { ...service, id });
  return id;
};

/**
 * Update an existing service in Firestore
 */
export const updateService = async (
  id: string,
  updates: Partial<FirestoreService>
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const serviceRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(serviceRef, updates);
};

/**
 * Delete a service from Firestore
 */
export const deleteService = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }

  const serviceRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(serviceRef);
};

export default {
  getServices,
  createService,
  updateService,
  deleteService,
};
