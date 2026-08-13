"use client";

import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
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
import { bootstrapLightweightUser } from "@/features/auth/bootstrap-lite";
import { getFirebaseClient } from "@/lib/firebase/client";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import type { AppAuthError, AuthBootstrapData, AuthStatus } from "@/types/auth";

interface AuthContextValue {
  status: AuthStatus;
  firebaseUser: User | null;
  bootstrap: AuthBootstrapData | null;
  error: AppAuthError | null;
  retryAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [bootstrap, setBootstrap] = useState<AuthBootstrapData | null>(null);
  const [error, setError] = useState<AppAuthError | null>(null);
  const mounted = useRef(true);
  const bootstrappingUid = useRef<string | null>(null);

  const runBootstrap = useCallback(async (user: User) => {
    if (bootstrappingUid.current === user.uid) return;
    bootstrappingUid.current = user.uid;
    setStatus("bootstrapping");
    setError(null);

    try {
      const data = await bootstrapLightweightUser(user);
      if (!mounted.current) return;
      setFirebaseUser(user);
      setBootstrap(data);
      setStatus("authenticated");
    } catch (unknownError) {
      if (!mounted.current) return;
      setError(normalizeAuthError(unknownError));
      setStatus("error");
    } finally {
      bootstrappingUid.current = null;
    }
  }, []);

  const startAccess = useCallback(async () => {
    if (!isFirebaseClientConfigured) {
      setError({
        code: "FIREBASE_CLIENT_NOT_CONFIGURED",
        message: "Firebase chưa được cấu hình cho website này.",
        detail: "Hãy thêm các biến NEXT_PUBLIC_FIREBASE_* trong Netlify rồi deploy lại."
      });
      setStatus("error");
      return;
    }

    try {
      const { auth } = getFirebaseClient();
      await setPersistence(auth, browserLocalPersistence);
      if (auth.currentUser) {
        await runBootstrap(auth.currentUser);
        return;
      }
      setStatus("initializing");
      await signInAnonymously(auth);
    } catch (unknownError) {
      if (!mounted.current) return;
      setError(normalizeAuthError(unknownError));
      setStatus("error");
    }
  }, [runBootstrap]);

  useEffect(() => {
    mounted.current = true;
    if (!isFirebaseClientConfigured) {
      void startAccess();
      return () => {
        mounted.current = false;
      };
    }

    let unsubscribe: () => void = () => undefined;
    let disposed = false;

    void (async () => {
      try {
        const { auth } = getFirebaseClient();
        await setPersistence(auth, browserLocalPersistence);

        const stopListening = onAuthStateChanged(auth, (user: User | null) => {
          if (!mounted.current || disposed) return;
          if (user) {
            setFirebaseUser(user);
            void runBootstrap(user);
            return;
          }
          void signInAnonymously(auth).catch((unknownError: unknown) => {
            if (!mounted.current || disposed) return;
            setError(normalizeAuthError(unknownError));
            setStatus("error");
          });
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
      bootstrappingUid.current = null;
      unsubscribe();
    };
  }, [runBootstrap, startAccess]);

  const retryAccess = useCallback(async () => {
    setError(null);
    setBootstrap(null);
    await startAccess();
  }, [startAccess]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, firebaseUser, bootstrap, error, retryAccess }),
    [status, firebaseUser, bootstrap, error, retryAccess]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return context;
}
