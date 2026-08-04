"use client";

import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type User
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import { normalizeAuthError } from "@/features/auth/auth-errors";
import {
  bootstrapAuthenticatedUser,
  getBootstrapAuthError
} from "@/features/auth/bootstrap-client";
import { getFirebaseClient } from "@/lib/firebase/client";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import type {
  AppAuthError,
  AuthBootstrapData,
  AuthStatus
} from "@/types/auth";

interface AuthContextValue {
  status: AuthStatus;
  firebaseUser: User | null;
  bootstrap: AuthBootstrapData | null;
  error: AppAuthError | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  retryBootstrap: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [bootstrap, setBootstrap] = useState<AuthBootstrapData | null>(null);
  const [error, setError] = useState<AppAuthError | null>(null);
  const activeBootstrap = useRef<{ uid: string; promise: Promise<void> } | null>(null);
  const bootstrapSequence = useRef(0);
  const mounted = useRef(true);

  const runBootstrap = useCallback(async (user: User, forceRefresh = false) => {
    const active = activeBootstrap.current;
    if (active && active.uid === user.uid && !forceRefresh) {
      return active.promise;
    }

    const sequence = ++bootstrapSequence.current;
    const task = (async () => {
      setStatus("bootstrapping");
      setError(null);

      try {
        const data = await bootstrapAuthenticatedUser(user, forceRefresh);
        if (!mounted.current || sequence !== bootstrapSequence.current) return;
        setFirebaseUser(user);
        setBootstrap(data);
        setStatus("authenticated");
      } catch (unknownError) {
        if (!mounted.current || sequence !== bootstrapSequence.current) return;
        const bootstrapError = getBootstrapAuthError(unknownError);
        setError(bootstrapError ?? normalizeAuthError(unknownError));
        setStatus("error");
      }
    })();

    activeBootstrap.current = { uid: user.uid, promise: task };

    try {
      await task;
    } finally {
      if (activeBootstrap.current?.promise === task) {
        activeBootstrap.current = null;
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (!isFirebaseClientConfigured) {
      setError({
        code: "FIREBASE_CLIENT_NOT_CONFIGURED",
        message: "Firebase chưa được cấu hình cho website này.",
        detail: "Hãy thêm các biến NEXT_PUBLIC_FIREBASE_* trong Netlify rồi deploy lại."
      });
      setStatus("error");
      return () => {
        mounted.current = false;
        bootstrapSequence.current += 1;
        activeBootstrap.current = null;
      };
    }

    let unsubscribe: () => void = () => undefined;
    let disposed = false;

    void (async () => {
      try {
        const { auth } = getFirebaseClient();
        await setPersistence(auth, browserLocalPersistence);

        const stopListening = onAuthStateChanged(auth, (user) => {
          if (!mounted.current || disposed) return;

          if (!user) {
            bootstrapSequence.current += 1;
            activeBootstrap.current = null;
            setFirebaseUser(null);
            setBootstrap(null);
            setError(null);
            setStatus("unauthenticated");
            return;
          }

          setFirebaseUser(user);
          void runBootstrap(user);
        });

        if (disposed) {
          stopListening();
          return;
        }

        unsubscribe = stopListening;
      } catch (unknownError) {
        if (!mounted.current || disposed) return;
        setError(normalizeAuthError(unknownError));
        setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      mounted.current = false;
      bootstrapSequence.current += 1;
      activeBootstrap.current = null;
      unsubscribe();
    };
  }, [runBootstrap]);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseClientConfigured) {
      setError({
        code: "FIREBASE_CLIENT_NOT_CONFIGURED",
        message: "Firebase chưa được cấu hình cho website này."
      });
      setStatus("error");
      return;
    }

    setStatus("authenticating");
    setError(null);

    try {
      const { auth } = getFirebaseClient();
      const credential = await signInWithPopup(auth, provider);
      setFirebaseUser(credential.user);
      await runBootstrap(credential.user);
    } catch (unknownError) {
      const authError = normalizeAuthError(unknownError);
      setError(authError);
      setStatus(authError.code === "FIREBASE_CLIENT_NOT_CONFIGURED" ? "error" : "unauthenticated");
    }
  }, [runBootstrap]);

  const signOutUser = useCallback(async () => {
    try {
      if (isFirebaseClientConfigured) {
        const { auth } = getFirebaseClient();
        await signOut(auth);
      }
    } finally {
      bootstrapSequence.current += 1;
      activeBootstrap.current = null;
      setFirebaseUser(null);
      setBootstrap(null);
      setError(null);
      setStatus("unauthenticated");
    }
  }, []);

  const retryBootstrap = useCallback(async () => {
    if (!firebaseUser) {
      setError(null);
      setStatus("unauthenticated");
      return;
    }

    await runBootstrap(firebaseUser, true);
  }, [firebaseUser, runBootstrap]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      firebaseUser,
      bootstrap,
      error,
      signInWithGoogle,
      signOutUser,
      retryBootstrap,
      clearError
    }),
    [
      status,
      firebaseUser,
      bootstrap,
      error,
      signInWithGoogle,
      signOutUser,
      retryBootstrap,
      clearError
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }

  return context;
}
