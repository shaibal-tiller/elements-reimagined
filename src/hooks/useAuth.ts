import { useState, useEffect, useCallback } from "react";
import {
  AuthUser,
  signIn as authSignIn,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  resetPassword as authResetPassword,
  subscribeToAuthChanges,
} from "../services/authService";

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook for managing authentication state
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const authUser = await authSignIn(email, password);
      setUser(authUser);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const authUser = await authSignInWithGoogle();
      setUser(authUser);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authSignOut();
      setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign out";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authResetPassword(email);
      setSuccessMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    successMessage,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearError,
  };
}

export default useAuth;
