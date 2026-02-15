import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Authorized admin email
export const ADMIN_EMAIL = "shaibal.tiller@gmail.com";

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "your_api_key_here"
  );
};

// Initialize Firebase only if not already initialized
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  const isNewApp = getApps().length === 0;
  app = isNewApp ? initializeApp(firebaseConfig) : getApps()[0];

  // initializeFirestore can only be called once per app — use getFirestore on subsequent calls (HMR)
  if (isNewApp) {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } else {
    db = getFirestore(app);
  }

  auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
export default db;
