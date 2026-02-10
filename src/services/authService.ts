import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, ADMIN_EMAIL, isFirebaseConfigured } from "../lib/firebase/config";

export interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

/**
 * Check if a user is the authorized admin
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.email === ADMIN_EMAIL;
};

/**
 * Sign in with email and password
 * Only allows the authorized admin email
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase is not configured");
  }

  // Check if email is the authorized admin
  if (email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized: Only the admin can access this page");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  return {
    uid: user.uid,
    email: user.email,
    isAdmin: isAdmin(user),
  };
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  if (!auth) {
    throw new Error("Firebase is not configured");
  }

  await firebaseSignOut(auth);
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: AuthUser | null) => void
): (() => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user && isAdmin(user)) {
      callback({
        uid: user.uid,
        email: user.email,
        isAdmin: true,
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Get current user
 */
export const getCurrentUser = (): AuthUser | null => {
  if (!auth?.currentUser) {
    return null;
  }

  const user = auth.currentUser;
  if (!isAdmin(user)) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    isAdmin: true,
  };
};

export default {
  signIn,
  signOut,
  subscribeToAuthChanges,
  getCurrentUser,
  isAdmin,
};
