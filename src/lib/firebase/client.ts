import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore
} from "firebase/firestore";

import {
  firebasePublicConfig,
  isFirebaseClientConfigured,
  useFirebaseEmulator
} from "@/lib/firebase/config";

interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let services: FirebaseClientServices | null = null;
let emulatorsConnected = false;

export function getFirebaseClient(): FirebaseClientServices {
  if (!isFirebaseClientConfigured) {
    throw new Error(
      "Firebase client chưa được cấu hình. Hãy điền các biến NEXT_PUBLIC_FIREBASE_* trong Netlify."
    );
  }

  if (services) return services;

  const app = getApps().length > 0 ? getApp() : initializeApp(firebasePublicConfig);
  const auth = getAuth(app);

  let db: Firestore;
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    db = getFirestore(app);
  }

  if (useFirebaseEmulator && !emulatorsConnected && typeof window !== "undefined") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    emulatorsConnected = true;
  }

  services = { app, auth, db };
  return services;
}
