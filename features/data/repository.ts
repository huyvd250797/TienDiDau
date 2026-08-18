import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { DEFAULT_CATEGORIES } from "@/data/default-categories";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { Category, CategoryInput } from "@/types/category";
import type { WorkspaceSettings } from "@/types/settings";
import type { Wallet, WalletInput } from "@/types/wallet";

export type DataMode = "cloud" | "local";

const LOCAL_PREFIX = "tiendidau:v1.1";

function localKey(workspaceId: string, name: string) {
  return `${LOCAL_PREFIX}:${workspaceId}:${name}`;
}

function readLocal<T>(workspaceId: string, name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(localKey(workspaceId, name));
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(workspaceId: string, name: string, value: T) {
  window.localStorage.setItem(localKey(workspaceId, name), JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function localUserId(workspaceId: string) {
  return workspaceId.replace(/^local-/, "local-user-");
}

export function defaultSettings(): WorkspaceSettings {
  return {
    id: "general",
    theme: "dark",
    currency: "VND",
    locale: "vi-VN",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
    dateFormat: "dd/MM/yyyy",
    defaultWalletId: null,
    onboardingCompleted: false,
    isDeleted: false,
    schemaVersion: 1,
  };
}

function localDefaultCategories(workspaceId: string): Category[] {
  const uid = localUserId(workspaceId);
  const stamp = nowIso();
  return DEFAULT_CATEGORIES.map((item) => ({
    ...item,
    workspaceId,
    isDefault: true,
    status: "active" as const,
    transactionCount: 0,
    createdAt: stamp,
    updatedAt: stamp,
    createdBy: uid,
    updatedBy: uid,
    isDeleted: false,
    schemaVersion: 1 as const,
  }));
}

async function currentUid() {
  const { auth } = getFirebaseClient();
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("Phiên Firebase chưa sẵn sàng.");
  return auth.currentUser.uid;
}

export async function loadWallets(mode: DataMode, workspaceId: string): Promise<Wallet[]> {
  if (mode === "local") {
    return readLocal<Wallet[]>(workspaceId, "wallets", []).filter((item) => !item.isDeleted);
  }

  const { db } = getFirebaseClient();
  const snapshot = await getDocs(collection(db, "workspaces", workspaceId, "wallets"));
  return snapshot.docs
    .map((item) => item.data() as Wallet)
    .filter((item) => !item.isDeleted)
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.name.localeCompare(b.name, "vi"));
}

export async function loadCategories(mode: DataMode, workspaceId: string): Promise<Category[]> {
  if (mode === "local") {
    let items = readLocal<Category[]>(workspaceId, "categories", []);
    if (items.length === 0) {
      items = localDefaultCategories(workspaceId);
      writeLocal(workspaceId, "categories", items);
    }
    return items.filter((item) => !item.isDeleted).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const { db } = getFirebaseClient();
  const snapshot = await getDocs(collection(db, "workspaces", workspaceId, "categories"));
  return snapshot.docs
    .map((item) => item.data() as Category)
    .filter((item) => !item.isDeleted)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function loadSettings(mode: DataMode, workspaceId: string): Promise<WorkspaceSettings> {
  if (mode === "local") {
    const settings = readLocal<WorkspaceSettings | null>(workspaceId, "settings", null);
    if (settings) return settings;
    const next = defaultSettings();
    writeLocal(workspaceId, "settings", next);
    return next;
  }

  const { db } = getFirebaseClient();
  const ref = doc(db, "workspaces", workspaceId, "settings", "general");
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return snapshot.data() as WorkspaceSettings;

  const uid = await currentUid();
  const next = defaultSettings();
  await setDoc(ref, {
    ...next,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return next;
}

export async function saveWallet(
  mode: DataMode,
  workspaceId: string,
  input: WalletInput,
  existing?: Wallet,
): Promise<Wallet> {
  const wallets = await loadWallets(mode, workspaceId);
  const settings = await loadSettings(mode, workspaceId);
  const id = existing?.id ?? crypto.randomUUID();
  const firstWallet = wallets.filter((item) => item.status === "active" && item.id !== id).length === 0;
  const makeDefault = firstWallet || input.isDefault || settings.defaultWalletId === id || !settings.defaultWalletId;
  const initialBalance = Math.trunc(input.initialBalance);
  const stamp = nowIso();

  const base: Wallet = {
    id,
    workspaceId,
    name: input.name.trim(),
    type: input.type,
    icon: input.icon,
    color: input.color,
    initialBalance,
    currentBalance: existing && existing.transactionCount > 0 ? existing.currentBalance : initialBalance,
    startDate: input.startDate,
    status: existing?.status ?? "active",
    isDefault: makeDefault,
    transactionCount: existing?.transactionCount ?? 0,
    createdAt: existing?.createdAt ?? stamp,
    updatedAt: stamp,
    createdBy: existing?.createdBy ?? localUserId(workspaceId),
    updatedBy: localUserId(workspaceId),
    isDeleted: false,
    schemaVersion: 1,
  };

  if (mode === "local") {
    const next = wallets.map((item) => ({ ...item, isDefault: makeDefault && item.id !== id ? false : item.isDefault }));
    const index = next.findIndex((item) => item.id === id);
    if (index >= 0) next[index] = base;
    else next.push(base);
    writeLocal(workspaceId, "wallets", next);
    if (makeDefault) {
      writeLocal(workspaceId, "settings", {
        ...settings,
        defaultWalletId: id,
        onboardingCompleted: true,
        updatedAt: stamp,
      });
    } else if (firstWallet) {
      writeLocal(workspaceId, "settings", { ...settings, onboardingCompleted: true, updatedAt: stamp });
    }
    return base;
  }

  const { db } = getFirebaseClient();
  const uid = await currentUid();
  const batch = writeBatch(db);
  const walletRef = doc(db, "workspaces", workspaceId, "wallets", id);

  if (makeDefault) {
    for (const wallet of wallets) {
      if (wallet.id !== id && wallet.isDefault) {
        batch.update(doc(db, "workspaces", workspaceId, "wallets", wallet.id), {
          isDefault: false,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        });
      }
    }
  }

  batch.set(walletRef, {
    ...base,
    createdAt: existing?.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: existing?.createdBy ?? uid,
    updatedBy: uid,
  });

  if (makeDefault || firstWallet) {
    batch.set(
      doc(db, "workspaces", workspaceId, "settings", "general"),
      {
        defaultWalletId: makeDefault ? id : settings.defaultWalletId,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      },
      { merge: true },
    );
  }

  await batch.commit();
  return base;
}

export async function setDefaultWallet(mode: DataMode, workspaceId: string, walletId: string) {
  const wallets = await loadWallets(mode, workspaceId);
  const settings = await loadSettings(mode, workspaceId);
  const target = wallets.find((item) => item.id === walletId && item.status === "active");
  if (!target) throw new Error("Ví mặc định phải đang được sử dụng.");

  if (mode === "local") {
    writeLocal(
      workspaceId,
      "wallets",
      wallets.map((item) => ({ ...item, isDefault: item.id === walletId })),
    );
    writeLocal(workspaceId, "settings", { ...settings, defaultWalletId: walletId, updatedAt: nowIso() });
    return;
  }

  const { db } = getFirebaseClient();
  const uid = await currentUid();
  const batch = writeBatch(db);
  for (const wallet of wallets) {
    if (wallet.isDefault !== (wallet.id === walletId)) {
      batch.update(doc(db, "workspaces", workspaceId, "wallets", wallet.id), {
        isDefault: wallet.id === walletId,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      });
    }
  }
  batch.set(
    doc(db, "workspaces", workspaceId, "settings", "general"),
    { defaultWalletId: walletId, onboardingCompleted: true, updatedAt: serverTimestamp(), updatedBy: uid },
    { merge: true },
  );
  await batch.commit();
}

export async function setWalletVisibility(
  mode: DataMode,
  workspaceId: string,
  walletId: string,
  status: "active" | "hidden",
  replacementDefaultId?: string,
) {
  const wallets = await loadWallets(mode, workspaceId);
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) throw new Error("Không tìm thấy ví.");
  if (status === "hidden" && wallet.isDefault && !replacementDefaultId) {
    throw new Error("Hãy chọn một ví mặc định khác trước khi ẩn ví này.");
  }

  if (mode === "local") {
    let next = wallets.map((item) => item.id === walletId ? { ...item, status } : item);
    if (replacementDefaultId) next = next.map((item) => ({ ...item, isDefault: item.id === replacementDefaultId }));
    writeLocal(workspaceId, "wallets", next);
    const settings = await loadSettings(mode, workspaceId);
    if (replacementDefaultId) {
      writeLocal(workspaceId, "settings", { ...settings, defaultWalletId: replacementDefaultId, updatedAt: nowIso() });
    }
    return;
  }

  const { db } = getFirebaseClient();
  const uid = await currentUid();
  const batch = writeBatch(db);
  batch.update(doc(db, "workspaces", workspaceId, "wallets", walletId), {
    status,
    isDefault: replacementDefaultId ? false : wallet.isDefault,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });

  if (replacementDefaultId) {
    for (const item of wallets) {
      if (item.id !== walletId && item.isDefault !== (item.id === replacementDefaultId)) {
        batch.update(doc(db, "workspaces", workspaceId, "wallets", item.id), {
          isDefault: item.id === replacementDefaultId,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        });
      }
    }
    batch.set(
      doc(db, "workspaces", workspaceId, "settings", "general"),
      { defaultWalletId: replacementDefaultId, updatedAt: serverTimestamp(), updatedBy: uid },
      { merge: true },
    );
  }

  await batch.commit();
}

export async function saveCategory(
  mode: DataMode,
  workspaceId: string,
  input: CategoryInput,
  existing?: Category,
): Promise<Category> {
  const categories = await loadCategories(mode, workspaceId);
  const id = existing?.id ?? crypto.randomUUID();
  const sameType = categories.filter((item) => item.type === input.type && item.id !== id);
  const sortOrder = existing?.sortOrder ?? (Math.max(0, ...sameType.map((item) => item.sortOrder)) + 10);
  const stamp = nowIso();
  const category: Category = {
    id,
    workspaceId,
    name: input.name.trim(),
    type: existing && existing.transactionCount > 0 ? existing.type : input.type,
    icon: input.icon,
    color: input.color,
    sortOrder,
    isDefault: existing?.isDefault ?? false,
    status: existing?.status ?? "active",
    transactionCount: existing?.transactionCount ?? 0,
    createdAt: existing?.createdAt ?? stamp,
    updatedAt: stamp,
    createdBy: existing?.createdBy ?? localUserId(workspaceId),
    updatedBy: localUserId(workspaceId),
    isDeleted: false,
    schemaVersion: 1,
  };

  if (mode === "local") {
    const next = [...categories];
    const index = next.findIndex((item) => item.id === id);
    if (index >= 0) next[index] = category;
    else next.push(category);
    writeLocal(workspaceId, "categories", next);
    return category;
  }

  const { db } = getFirebaseClient();
  const uid = await currentUid();
  await setDoc(doc(db, "workspaces", workspaceId, "categories", id), {
    ...category,
    createdAt: existing?.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: existing?.createdBy ?? uid,
    updatedBy: uid,
  });
  return category;
}

export async function setCategoryVisibility(
  mode: DataMode,
  workspaceId: string,
  categoryId: string,
  status: "active" | "hidden",
) {
  const categories = await loadCategories(mode, workspaceId);
  const category = categories.find((item) => item.id === categoryId);
  if (!category) throw new Error("Không tìm thấy danh mục.");

  if (mode === "local") {
    writeLocal(
      workspaceId,
      "categories",
      categories.map((item) => item.id === categoryId ? { ...item, status, updatedAt: nowIso() } : item),
    );
    return;
  }

  const { db } = getFirebaseClient();
  const uid = await currentUid();
  await setDoc(
    doc(db, "workspaces", workspaceId, "categories", categoryId),
    { status, updatedAt: serverTimestamp(), updatedBy: uid },
    { merge: true },
  );
}
