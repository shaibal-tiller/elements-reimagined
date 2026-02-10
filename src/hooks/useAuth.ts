import { useState, useEffect, useCallback } from "react";
import {
  AuthUser,
  signIn as authSignIn,
  signOut as authSignOut,
  subscribeToAuthChanges,
} from "../services/authService";

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook for managing authentication state
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    signIn,
    signOut,
    clearError,
  };
}

export default useAuth;
