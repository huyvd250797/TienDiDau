import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { firebaseAdminConfig, isFirebaseAdminConfigured } from "@/lib/firebase/admin-config";

export { isFirebaseAdminConfigured };

function createAdminApp() {
  const { projectId, clientEmail, privateKey } = firebaseAdminConfig;

  if (clientEmail && privateKey && projectId) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId
    });
  }

  if (projectId) {
    return initializeApp({
      credential: applicationDefault(),
      projectId
    });
  }

  throw new Error(
    "Firebase Admin chưa được cấu hình. Hãy thiết lập Application Default Credentials hoặc các biến FIREBASE_ADMIN_*"
  );
}

export function getFirebaseAdminApp() {
  return getApps().length > 0 ? getApp() : createAdminApp();
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}
