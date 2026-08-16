import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function credentials() {
  const packed = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (packed) {
    const parsed = JSON.parse(packed);
    return cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    });
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("FIREBASE_CONFIG_MISSING");
  return cert({ projectId, clientEmail, privateKey });
}

export function db() {
  const app = getApps()[0] ?? initializeApp({ credential: credentials() });
  return getFirestore(app);
}
