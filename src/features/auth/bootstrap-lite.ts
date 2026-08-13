import type { User } from "firebase/auth";
import {
  doc,
  runTransaction,
  serverTimestamp,
  type DocumentReference,
  type DocumentSnapshot,
  type Transaction
} from "firebase/firestore";

import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COUNTS
} from "@/features/auth/default-categories";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { AuthBootstrapData } from "@/types/auth";

const DEFAULT_LOCALE = "vi-VN" as const;
const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";
const SCHEMA_VERSION = 1;

function getIdentity(user: User) {
  const isAnonymous = user.isAnonymous;
  return {
    uid: user.uid,
    displayName: isAnonymous ? "Bạn" : user.displayName?.trim() || "Bạn",
    email: isAnonymous ? null : user.email,
    avatarUrl: isAnonymous ? null : user.photoURL,
    provider: isAnonymous ? ("anonymous" as const) : ("google" as const)
  };
}


function makeBootstrapData(
  user: User,
  isFirstLogin: boolean,
  overrides?: {
    workspaceName?: string;
    workspaceSchemaVersion?: number;
    userTimezone?: string;
    onboardingCompleted?: boolean;
    settingsTheme?: "dark" | "light" | "system";
    settingsTimezone?: string;
    settingsSchemaVersion?: number;
  }
): AuthBootstrapData {
  const identity = getIdentity(user);
  const workspaceId = `personal-${identity.uid}`;
  return {
    isFirstLogin,
    user: {
      id: identity.uid,
      displayName: identity.displayName,
      email: identity.email,
      avatarUrl: identity.avatarUrl,
      provider: identity.provider,
      personalWorkspaceId: workspaceId,
      locale: DEFAULT_LOCALE,
      timezone: overrides?.userTimezone ?? DEFAULT_TIMEZONE,
      onboardingCompleted: overrides?.onboardingCompleted ?? false
    },
    workspace: {
      id: workspaceId,
      name: overrides?.workspaceName ?? "Tài chính cá nhân",
      type: "personal",
      ownerId: identity.uid,
      baseCurrency: "VND",
      status: "active",
      schemaVersion: overrides?.workspaceSchemaVersion ?? SCHEMA_VERSION
    },
    settings: {
      id: "general",
      theme: overrides?.settingsTheme ?? "dark",
      currency: "VND",
      locale: DEFAULT_LOCALE,
      timezone: overrides?.settingsTimezone ?? DEFAULT_TIMEZONE,
      dateFormat: "dd/MM/yyyy",
      firstDayOfWeek: 1,
      onboardingStep: "create-wallet",
      schemaVersion: overrides?.settingsSchemaVersion ?? SCHEMA_VERSION
    },
    categories: DEFAULT_CATEGORY_COUNTS,
    nextStep: "create-wallet"
  };
}

async function getAllInTransaction(
  transaction: Transaction,
  refs: readonly DocumentReference[]
): Promise<DocumentSnapshot[]> {
  return Promise.all(refs.map((ref) => transaction.get(ref)));
}

export async function bootstrapLightweightUser(user: User): Promise<AuthBootstrapData> {
  const identity = getIdentity(user);
  const cacheKey = `tiendidau-bootstrap-v1:${identity.uid}`;
  if (typeof window !== "undefined" && window.localStorage.getItem(cacheKey) === "1") {
    return makeBootstrapData(user, false);
  }

  const { db } = getFirebaseClient();
  const workspaceId = `personal-${identity.uid}`;

  const userRef = doc(db, "users", identity.uid);
  const workspaceRef = doc(db, "workspaces", workspaceId);
  const memberRef = doc(db, "workspaces", workspaceId, "members", identity.uid);
  const settingsRef = doc(db, "workspaces", workspaceId, "settings", "general");
  const categoryRefs = DEFAULT_CATEGORIES.map((category) =>
    doc(db, "workspaces", workspaceId, "categories", category.id)
  );

  let isFirstLogin = false;
  let onboardingCompleted = false;
  let workspaceName = "Tài chính cá nhân";
  let workspaceSchemaVersion = SCHEMA_VERSION;
  let userTimezone = DEFAULT_TIMEZONE;
  let settingsTheme: "dark" | "light" | "system" = "dark";
  let settingsTimezone = DEFAULT_TIMEZONE;
  let settingsSchemaVersion = SCHEMA_VERSION;

  await runTransaction(db, async (transaction: Transaction) => {
    const refs = [userRef, workspaceRef, memberRef, settingsRef, ...categoryRefs] as const;
    const [userSnapshot, workspaceSnapshot, memberSnapshot, settingsSnapshot, ...categorySnapshots] =
      await getAllInTransaction(transaction, refs);

    isFirstLogin = !userSnapshot?.exists();
    const now = serverTimestamp();

    if (!userSnapshot?.exists()) {
      transaction.set(userRef, {
        id: identity.uid,
        displayName: identity.displayName,
        email: identity.email,
        avatarUrl: identity.avatarUrl,
        provider: identity.provider,
        personalWorkspaceId: workspaceId,
        locale: DEFAULT_LOCALE,
        timezone: DEFAULT_TIMEZONE,
        onboardingCompleted: false,
        lastSeenAt: now,
        createdAt: now,
        createdBy: identity.uid,
        updatedAt: now,
        updatedBy: identity.uid,
        isDeleted: false
      });
    } else {
      const userData = userSnapshot.data();
      onboardingCompleted = userData.onboardingCompleted === true;
      userTimezone =
        typeof userData.timezone === "string" && userData.timezone.trim()
          ? userData.timezone
          : DEFAULT_TIMEZONE;
      transaction.set(
        userRef,
        {
          displayName: identity.displayName,
          email: identity.email,
          avatarUrl: identity.avatarUrl,
          provider: identity.provider,
          lastSeenAt: now,
          updatedAt: now,
          updatedBy: identity.uid
        },
        { merge: true }
      );
    }

    if (!workspaceSnapshot?.exists()) {
      transaction.set(workspaceRef, {
        id: workspaceId,
        name: workspaceName,
        type: "personal",
        ownerId: identity.uid,
        baseCurrency: "VND",
        status: "active",
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        createdBy: identity.uid,
        updatedAt: now,
        updatedBy: identity.uid,
        isDeleted: false
      });
    } else {
      const workspaceData = workspaceSnapshot.data();
      workspaceName =
        typeof workspaceData.name === "string" && workspaceData.name.trim()
          ? workspaceData.name
          : workspaceName;
      workspaceSchemaVersion =
        typeof workspaceData.schemaVersion === "number"
          ? workspaceData.schemaVersion
          : SCHEMA_VERSION;
    }

    if (!memberSnapshot?.exists()) {
      transaction.set(memberRef, {
        id: identity.uid,
        uid: identity.uid,
        role: "owner",
        status: "active",
        joinedAt: now,
        createdAt: now,
        createdBy: identity.uid,
        updatedAt: now,
        updatedBy: identity.uid,
        isDeleted: false
      });
    }

    if (!settingsSnapshot?.exists()) {
      transaction.set(settingsRef, {
        id: "general",
        theme: "dark",
        currency: "VND",
        locale: DEFAULT_LOCALE,
        timezone: DEFAULT_TIMEZONE,
        dateFormat: "dd/MM/yyyy",
        firstDayOfWeek: 1,
        onboardingStep: "create-wallet",
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        createdBy: identity.uid,
        updatedAt: now,
        updatedBy: identity.uid,
        isDeleted: false
      });
    } else {
      const settingsData = settingsSnapshot.data();
      if (["dark", "light", "system"].includes(settingsData.theme)) {
        settingsTheme = settingsData.theme as "dark" | "light" | "system";
      }
      settingsTimezone =
        typeof settingsData.timezone === "string" && settingsData.timezone.trim()
          ? settingsData.timezone
          : DEFAULT_TIMEZONE;
      settingsSchemaVersion =
        typeof settingsData.schemaVersion === "number"
          ? settingsData.schemaVersion
          : SCHEMA_VERSION;
    }

    categorySnapshots.forEach((snapshot: DocumentSnapshot, index: number) => {
      if (snapshot?.exists()) return;
      const category = DEFAULT_CATEGORIES[index];
      const categoryRef = categoryRefs[index];
      if (!category || !categoryRef) return;

      transaction.set(categoryRef, {
        id: category.id,
        workspaceId,
        systemKey: category.systemKey,
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
        sortOrder: category.sortOrder,
        isDefault: true,
        status: "active",
        createdAt: now,
        createdBy: identity.uid,
        updatedAt: now,
        updatedBy: identity.uid,
        isDeleted: false
      });
    });
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(cacheKey, "1");
  }

  return makeBootstrapData(user, isFirstLogin, {
    workspaceName,
    workspaceSchemaVersion,
    userTimezone,
    onboardingCompleted,
    settingsTheme,
    settingsTimezone,
    settingsSchemaVersion
  });
}
