import { FieldValue } from "firebase-admin/firestore";

import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COUNTS
} from "@/features/auth/default-categories";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import type { AuthBootstrapData } from "@/types/auth";

interface BootstrapIdentity {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

const DEFAULT_LOCALE = "vi-VN" as const;
const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";
const SCHEMA_VERSION = 1;

function getWorkspaceName(displayName: string) {
  const firstName = displayName.trim().split(/\s+/).at(-1) ?? displayName;
  return `Tài chính của ${firstName}`;
}

export async function bootstrapUserAccount(identity: BootstrapIdentity): Promise<AuthBootstrapData> {
  const db = getFirebaseAdminDb();
  const workspaceId = `personal-${identity.uid}`;

  const userRef = db.collection("users").doc(identity.uid);
  const workspaceRef = db.collection("workspaces").doc(workspaceId);
  const memberRef = workspaceRef.collection("members").doc(identity.uid);
  const settingsRef = workspaceRef.collection("settings").doc("general");
  const categoryRefs = DEFAULT_CATEGORIES.map((category) =>
    workspaceRef.collection("categories").doc(category.id)
  );

  let isFirstLogin = false;
  let onboardingCompleted = false;
  let workspaceName = getWorkspaceName(identity.displayName);
  let workspaceSchemaVersion = SCHEMA_VERSION;
  let userTimezone = DEFAULT_TIMEZONE;
  let settingsTheme: "dark" | "light" | "system" = "dark";
  let settingsTimezone = DEFAULT_TIMEZONE;
  let settingsSchemaVersion = SCHEMA_VERSION;

  await db.runTransaction(async (transaction) => {
    const allRefs = [userRef, workspaceRef, memberRef, settingsRef, ...categoryRefs] as const;
    const snapshots = await transaction.getAll(...allRefs);
    const [userSnapshot, workspaceSnapshot, memberSnapshot, settingsSnapshot, ...categorySnapshots] = snapshots;

    if (!userSnapshot || !workspaceSnapshot || !memberSnapshot || !settingsSnapshot) {
      throw new Error("Không thể đọc dữ liệu bootstrap bắt buộc.");
    }

    const now = FieldValue.serverTimestamp();
    isFirstLogin = !userSnapshot.exists;

    if (!userSnapshot.exists) {
      transaction.create(userRef, {
        id: identity.uid,
        displayName: identity.displayName,
        email: identity.email,
        avatarUrl: identity.avatarUrl,
        provider: "google",
        personalWorkspaceId: workspaceId,
        locale: DEFAULT_LOCALE,
        timezone: DEFAULT_TIMEZONE,
        onboardingCompleted: false,
        lastLoginAt: now,
        createdAt: now,
        createdBy: identity.uid,
        updatedAt: now,
        updatedBy: identity.uid,
        isDeleted: false
      });
    } else {
      const userData = userSnapshot.data();
      if (userData?.isDeleted === true) {
        throw new Error("Tài khoản đã bị vô hiệu hóa.");
      }
      onboardingCompleted = userData?.onboardingCompleted === true;
      userTimezone =
        typeof userData?.timezone === "string" && userData.timezone.trim()
          ? userData.timezone
          : DEFAULT_TIMEZONE;
      transaction.set(
        userRef,
        {
          displayName: identity.displayName,
          email: identity.email,
          avatarUrl: identity.avatarUrl,
          provider: "google",
          personalWorkspaceId: workspaceId,
          locale: userData?.locale ?? DEFAULT_LOCALE,
          timezone: userTimezone,
          lastLoginAt: now,
          updatedAt: now,
          updatedBy: identity.uid
        },
        { merge: true }
      );
    }

    if (!workspaceSnapshot.exists) {
      transaction.create(workspaceRef, {
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
      if (workspaceData?.isDeleted === true || workspaceData?.status !== "active") {
        throw new Error("Workspace cá nhân đã bị vô hiệu hóa.");
      }
      if (workspaceData?.ownerId !== identity.uid || workspaceData?.type !== "personal") {
        throw new Error("Workspace cá nhân không có quyền sở hữu hợp lệ.");
      }
      if (typeof workspaceData?.name === "string" && workspaceData.name.trim()) {
        workspaceName = workspaceData.name;
      }
      if (
        typeof workspaceData?.schemaVersion === "number" &&
        Number.isInteger(workspaceData.schemaVersion) &&
        workspaceData.schemaVersion > 0
      ) {
        workspaceSchemaVersion = workspaceData.schemaVersion;
      }
    }

    if (!memberSnapshot.exists) {
      transaction.create(memberRef, {
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
    } else {
      const memberData = memberSnapshot.data();
      if (
        memberData?.isDeleted === true ||
        memberData?.status !== "active" ||
        memberData?.uid !== identity.uid ||
        memberData?.role !== "owner"
      ) {
        throw new Error("Quyền truy cập workspace đã bị vô hiệu hóa.");
      }
    }

    if (!settingsSnapshot.exists) {
      transaction.create(settingsRef, {
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
      if (settingsData?.isDeleted === true) {
        throw new Error("Cài đặt workspace đã bị vô hiệu hóa.");
      }
      if (
        settingsData?.theme === "dark" ||
        settingsData?.theme === "light" ||
        settingsData?.theme === "system"
      ) {
        settingsTheme = settingsData.theme;
      }
      if (typeof settingsData?.timezone === "string" && settingsData.timezone.trim()) {
        settingsTimezone = settingsData.timezone;
      }
      if (
        typeof settingsData?.schemaVersion === "number" &&
        Number.isInteger(settingsData.schemaVersion) &&
        settingsData.schemaVersion > 0
      ) {
        settingsSchemaVersion = settingsData.schemaVersion;
      }
    }

    categorySnapshots.forEach((snapshot, index) => {
      if (snapshot.exists) return;
      const category = DEFAULT_CATEGORIES[index];
      const categoryRef = categoryRefs[index];
      if (!category || !categoryRef) return;

      transaction.create(categoryRef, {
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

  return {
    isFirstLogin,
    user: {
      id: identity.uid,
      displayName: identity.displayName,
      email: identity.email,
      avatarUrl: identity.avatarUrl,
      provider: "google",
      personalWorkspaceId: workspaceId,
      locale: DEFAULT_LOCALE,
      timezone: userTimezone,
      onboardingCompleted
    },
    workspace: {
      id: workspaceId,
      name: workspaceName,
      type: "personal",
      ownerId: identity.uid,
      baseCurrency: "VND",
      status: "active",
      schemaVersion: workspaceSchemaVersion
    },
    settings: {
      id: "general",
      theme: settingsTheme,
      currency: "VND",
      locale: DEFAULT_LOCALE,
      timezone: settingsTimezone,
      dateFormat: "dd/MM/yyyy",
      firstDayOfWeek: 1,
      onboardingStep: "create-wallet",
      schemaVersion: settingsSchemaVersion
    },
    categories: DEFAULT_CATEGORY_COUNTS,
    nextStep: "create-wallet"
  };
}
