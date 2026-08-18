import { signInAnonymously, type User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
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
  const settingsRef = doc(db, "workspaces", workspaceId, "settings", "general");
  const [workspace, settings, categories] = await Promise.all([
    getDoc(workspaceRef),
    getDoc(settingsRef),
    getDocs(collection(db, "workspaces", workspaceId, "categories")),
  ]);

  const existingCategoryIds = new Set(categories.docs.map((item) => item.id));
  const missingCategories = DEFAULT_CATEGORIES.filter((item) => !existingCategoryIds.has(item.id));
  const batch = writeBatch(db);
  const now = serverTimestamp();
  let hasWrites = false;

  if (!workspace.exists()) {
    batch.set(doc(db, "users", uid), {
      id: uid,
      personalWorkspaceId: workspaceId,
      accountType: "anonymous",
      createdAt: now,
      updatedAt: now,
      createdBy: uid,
      updatedBy: uid,
      isDeleted: false,
      schemaVersion: 1,
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
      createdBy: uid,
      updatedBy: uid,
      isDeleted: false,
    });
    hasWrites = true;
  }

  if (!settings.exists()) {
    batch.set(settingsRef, {
      id: "general",
      theme: "dark",
      currency: "VND",
      locale: "vi-VN",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
      dateFormat: "dd/MM/yyyy",
      defaultWalletId: null,
      onboardingCompleted: false,
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: uid,
      updatedBy: uid,
      isDeleted: false,
    });
    hasWrites = true;
  } else if (settings.data().defaultWalletId === undefined || settings.data().onboardingCompleted === undefined) {
    batch.set(settingsRef, {
      defaultWalletId: settings.data().defaultWalletId ?? null,
      onboardingCompleted: settings.data().onboardingCompleted ?? false,
      updatedAt: now,
      updatedBy: uid,
      schemaVersion: 1,
    }, { merge: true });
    hasWrites = true;
  }

  for (const category of missingCategories) {
    batch.set(doc(db, "workspaces", workspaceId, "categories", category.id), {
      ...category,
      workspaceId,
      isDefault: true,
      status: "active",
      transactionCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: uid,
      updatedBy: uid,
      isDeleted: false,
      schemaVersion: 1,
    });
    hasWrites = true;
  }

  for (const categoryDoc of categories.docs) {
    const data = categoryDoc.data();
    if (data.transactionCount === undefined || data.schemaVersion === undefined || data.createdBy === undefined) {
      batch.set(categoryDoc.ref, {
        transactionCount: data.transactionCount ?? 0,
        schemaVersion: data.schemaVersion ?? 1,
        createdBy: data.createdBy ?? uid,
        updatedBy: uid,
        updatedAt: now,
      }, { merge: true });
      hasWrites = true;
    }
  }

  if (hasWrites) await batch.commit();
  return workspaceId;
}

export async function startCloudSession(): Promise<{ user: User; workspaceId: string }> {
  const { auth, db } = getFirebaseClient();
  await auth.authStateReady();

  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  const workspaceId = await ensureWorkspace(db, user);

  return { user, workspaceId };
}
