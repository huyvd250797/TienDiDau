import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.GCLOUD_PROJECT ?? "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "";

export const isFirebaseAdminConfigured = Boolean(
  projectId && ((clientEmail && privateKey) || process.env.GOOGLE_APPLICATION_CREDENTIALS)
);

function createAdminApp() {
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
