import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, ADMIN_EMAIL, isFirebaseConfigured, googleProvider } from "../lib/firebase/config";

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
 * Sign in with Google
 * Only allows the authorized admin email
 */
export const signInWithGoogle = async (): Promise<AuthUser> => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase is not configured");
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  if (user.email !== ADMIN_EMAIL) {
    await firebaseSignOut(auth);
    throw new Error("Unauthorized: Only the admin can access this page");
  }

  return {
    uid: user.uid,
    email: user.email,
    isAdmin: true,
  };
};

/**
 * Send password reset email
 * Only allows the authorized admin email to prevent email enumeration
 */
export const resetPassword = async (email: string): Promise<void> => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase is not configured");
  }

  if (email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized: Password reset is only available for the admin account");
  }

  await sendPasswordResetEmail(auth, email);
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
  signInWithGoogle,
  signOut,
  resetPassword,
  subscribeToAuthChanges,
  getCurrentUser,
  isAdmin,
};
