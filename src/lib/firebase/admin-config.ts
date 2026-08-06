const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.GCLOUD_PROJECT ?? "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "";

export const firebaseAdminConfig = {
  projectId,
  clientEmail,
  privateKey
} as const;

export const isFirebaseAdminConfigured = Boolean(
  projectId && ((clientEmail && privateKey) || process.env.GOOGLE_APPLICATION_CREDENTIALS)
);
