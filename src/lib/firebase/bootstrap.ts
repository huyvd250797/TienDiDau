import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  type Firestore,
} from "firebase/firestore";

import { DEFAULT_CATEGORIES } from "@/data/default-categories";
import { getFirebaseClient } from "@/lib/firebase/client";

async function ensureWorkspace(db: Firestore, user: User) {
  const uid = user.uid;
  const workspaceId = `personal-${uid}`;
  const workspaceRef = doc(db, "workspaces", workspaceId);
  const snapshot = await getDoc(workspaceRef);

  if (snapshot.exists()) return workspaceId;

  const batch = writeBatch(db);
  const now = serverTimestamp();

  batch.set(doc(db, "users", uid), {
    id: uid,
    personalWorkspaceId: workspaceId,
    accountType: "anonymous",
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  });

  batch.set(workspaceRef, {
    id: workspaceId,
    type: "personal",
    ownerId: uid,
    name: "Tài chính của tôi",
    baseCurrency: "VND",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  });

  batch.set(doc(db, "workspaces", workspaceId, "settings", "general"), {
    id: "general",
    theme: "dark",
    currency: "VND",
    locale: "vi-VN",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
    dateFormat: "dd/MM/yyyy",
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  });

  for (const category of DEFAULT_CATEGORIES) {
    batch.set(doc(collection(db, "workspaces", workspaceId, "categories"), category.id), {
      ...category,
      workspaceId,
      isDefault: true,
      status: "active",
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    });
  }

  await batch.commit();
  return workspaceId;
}

export async function startDirectSession(): Promise<{ user: User; workspaceId: string }> {
  const { auth, db } = getFirebaseClient();
  await setPersistence(auth, browserLocalPersistence);

  const user = await new Promise<User>((resolve, reject) => {
    let unsubscribe = () => undefined;
    unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        unsubscribe();
        try {
          if (currentUser) {
            resolve(currentUser);
            return;
          }
          const result = await signInAnonymously(auth);
          resolve(result.user);
        } catch (error) {
          reject(error);
        }
      },
      reject,
    );
  });

  const workspaceId = await ensureWorkspace(db, user);
  return { user, workspaceId };
}
