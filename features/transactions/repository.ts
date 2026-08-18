import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type DocumentReference,
  type Transaction as FirestoreTransaction,
} from "firebase/firestore";

import { categoryIconGlyph } from "@/data/default-categories";
import { calculateTransactionDeltas, inputAsImpact, type CategoryDelta, type WalletDelta } from "@/features/transactions/balance-engine";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { Category } from "@/types/category";
import type { Transaction as MoneyTransaction, TransactionInput, TransactionType } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";
import type { DataMode } from "@/features/data/repository";

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

async function currentUid() {
  const { auth } = getFirebaseClient();
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("Phiên Firebase chưa sẵn sàng.");
  return auth.currentUser.uid;
}

function isDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

function validateInput(input: TransactionInput) {
  if (!Number.isSafeInteger(input.amount) || input.amount <= 0) throw new Error("Số tiền phải là số nguyên lớn hơn 0.");
  if (!isDateKey(input.dateKey)) throw new Error("Ngày giao dịch không hợp lệ.");
  if (input.note.trim().length > 300) throw new Error("Ghi chú tối đa 300 ký tự.");

  if (input.type === "transfer") {
    if (!input.sourceWalletId || !input.destinationWalletId) throw new Error("Hãy chọn ví nguồn và ví đích.");
    if (input.sourceWalletId === input.destinationWalletId) throw new Error("Ví nguồn và ví đích phải khác nhau.");
    return;
  }

  if (!input.walletId) throw new Error("Hãy chọn ví.");
  if (!input.categoryId) throw new Error("Hãy chọn danh mục.");
}

function transactionUsesWallet(item: MoneyTransaction | null | undefined, walletId: string) {
  if (!item) return false;
  return item.walletId === walletId || item.sourceWalletId === walletId || item.destinationWalletId === walletId;
}

function transactionUsesCategory(item: MoneyTransaction | null | undefined, categoryId: string) {
  return Boolean(item && item.categoryId === categoryId);
}

function localTransactionDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toISOString();
}

function snapshotTransaction(
  id: string,
  workspaceId: string,
  input: TransactionInput,
  wallets: Map<string, Wallet>,
  categories: Map<string, Category>,
  actorId: string,
  createdAt?: unknown,
): MoneyTransaction {
  const wallet = input.walletId ? wallets.get(input.walletId) ?? null : null;
  const category = input.categoryId ? categories.get(input.categoryId) ?? null : null;
  const source = input.sourceWalletId ? wallets.get(input.sourceWalletId) ?? null : null;
  const destination = input.destinationWalletId ? wallets.get(input.destinationWalletId) ?? null : null;
  const stamp = nowIso();

  return {
    id,
    workspaceId,
    type: input.type,
    amount: input.amount,
    dateKey: input.dateKey,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
    note: input.note.trim(),
    walletId: input.type === "transfer" ? null : input.walletId,
    categoryId: input.type === "transfer" ? null : input.categoryId,
    sourceWalletId: input.type === "transfer" ? input.sourceWalletId : null,
    destinationWalletId: input.type === "transfer" ? input.destinationWalletId : null,
    walletName: wallet?.name ?? null,
    walletIcon: wallet?.icon ?? null,
    walletColor: wallet?.color ?? null,
    categoryName: category?.name ?? null,
    categoryIcon: category ? categoryIconGlyph(category.icon) : null,
    categoryColor: category?.color ?? null,
    sourceWalletName: source?.name ?? null,
    sourceWalletIcon: source?.icon ?? null,
    destinationWalletName: destination?.name ?? null,
    destinationWalletIcon: destination?.icon ?? null,
    transactionAt: localTransactionDate(input.dateKey),
    createdAt: createdAt ?? stamp,
    updatedAt: stamp,
    createdBy: actorId,
    updatedBy: actorId,
    isDeleted: false,
    schemaVersion: 1,
  };
}

function timestampValue(value: unknown) {
  if (typeof value === "string") return Date.parse(value) || 0;
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}

function sortTransactions(items: MoneyTransaction[]) {
  return [...items].sort((a, b) => {
    const byDate = b.dateKey.localeCompare(a.dateKey);
    if (byDate !== 0) return byDate;
    return timestampValue(b.updatedAt ?? b.createdAt) - timestampValue(a.updatedAt ?? a.createdAt);
  });
}

export async function loadTransactions(mode: DataMode, workspaceId: string): Promise<MoneyTransaction[]> {
  if (mode === "local") {
    return sortTransactions(readLocal<MoneyTransaction[]>(workspaceId, "transactions", []).filter((item) => !item.isDeleted));
  }
  const { db } = getFirebaseClient();
  const snapshot = await getDocs(collection(db, "workspaces", workspaceId, "transactions"));
  return sortTransactions(snapshot.docs.map((item) => item.data() as MoneyTransaction).filter((item) => !item.isDeleted));
}

function validateLocalSelection(input: TransactionInput, old: MoneyTransaction | null, wallets: Wallet[], categories: Category[]) {
  const walletMap = new Map(wallets.map((item) => [item.id, item]));
  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const walletIds = input.type === "transfer" ? [input.sourceWalletId, input.destinationWalletId] : [input.walletId];
  for (const walletId of walletIds) {
    if (!walletId) continue;
    const wallet = walletMap.get(walletId);
    if (!wallet || wallet.isDeleted) throw new Error("Ví được chọn không còn tồn tại.");
    if (wallet.status !== "active" && !transactionUsesWallet(old, walletId)) throw new Error("Ví được chọn đang bị ẩn.");
  }
  if (input.categoryId) {
    const category = categoryMap.get(input.categoryId);
    if (!category || category.isDeleted) throw new Error("Danh mục được chọn không còn tồn tại.");
    if (category.status !== "active" && !transactionUsesCategory(old, input.categoryId)) throw new Error("Danh mục được chọn đang bị ẩn.");
    if (category.type !== input.type) throw new Error("Danh mục không đúng loại giao dịch.");
  }
  return { walletMap, categoryMap };
}

function safeWalletUpdate(wallet: Wallet, delta: WalletDelta) {
  const currentBalance = wallet.currentBalance + delta.balance;
  const transactionCount = wallet.transactionCount + delta.count;
  if (!Number.isSafeInteger(currentBalance)) throw new Error("Số dư ví vượt giới hạn an toàn.");
  if (!Number.isSafeInteger(transactionCount) || transactionCount < 0) throw new Error("Số lượng giao dịch của ví không nhất quán.");
  return { ...wallet, currentBalance, transactionCount, updatedAt: nowIso() };
}

function safeCategoryUpdate(category: Category, delta: CategoryDelta) {
  const transactionCount = category.transactionCount + delta.count;
  if (!Number.isSafeInteger(transactionCount) || transactionCount < 0) throw new Error("Số lượng giao dịch của danh mục không nhất quán.");
  return { ...category, transactionCount, updatedAt: nowIso() };
}

async function saveLocalTransaction(workspaceId: string, input: TransactionInput, existing?: MoneyTransaction) {
  const transactions = readLocal<MoneyTransaction[]>(workspaceId, "transactions", []);
  const wallets = readLocal<Wallet[]>(workspaceId, "wallets", []);
  const categories = readLocal<Category[]>(workspaceId, "categories", []);
  const old = existing ? transactions.find((item) => item.id === existing.id && !item.isDeleted) ?? null : null;
  if (existing && !old) throw new Error("Giao dịch đã thay đổi hoặc không còn tồn tại.");
  const { walletMap, categoryMap } = validateLocalSelection(input, old, wallets, categories);

  const { walletDeltas, categoryDeltas } = calculateTransactionDeltas(old, inputAsImpact(input));

  const nextWallets = wallets.map((wallet) => walletDeltas.has(wallet.id) ? safeWalletUpdate(wallet, walletDeltas.get(wallet.id)!) : wallet);
  const nextCategories = categories.map((category) => categoryDeltas.has(category.id) ? safeCategoryUpdate(category, categoryDeltas.get(category.id)!) : category);
  const nextWalletMap = new Map(nextWallets.map((item) => [item.id, item]));
  const nextCategoryMap = new Map(nextCategories.map((item) => [item.id, item]));
  const id = old?.id ?? crypto.randomUUID();
  const actorId = localUserId(workspaceId);
  const nextTransaction = snapshotTransaction(id, workspaceId, input, nextWalletMap, nextCategoryMap, actorId, old?.createdAt);
  const nextTransactions = transactions.map((item) => item.id === id ? nextTransaction : item);
  if (!old) nextTransactions.push(nextTransaction);

  const backup = { wallets, categories, transactions };
  try {
    writeLocal(workspaceId, "wallets", nextWallets);
    writeLocal(workspaceId, "categories", nextCategories);
    writeLocal(workspaceId, "transactions", nextTransactions);
  } catch (error) {
    try {
      writeLocal(workspaceId, "wallets", backup.wallets);
      writeLocal(workspaceId, "categories", backup.categories);
      writeLocal(workspaceId, "transactions", backup.transactions);
    } catch {
      // Best effort rollback for localStorage quota/browser failures.
    }
    throw error;
  }
  return nextTransaction;
}

function getWalletRefs(workspaceId: string, ids: Set<string>) {
  const { db } = getFirebaseClient();
  return new Map([...ids].map((id) => [id, doc(db, "workspaces", workspaceId, "wallets", id)]));
}

function getCategoryRefs(workspaceId: string, ids: Set<string>) {
  const { db } = getFirebaseClient();
  return new Map([...ids].map((id) => [id, doc(db, "workspaces", workspaceId, "categories", id)]));
}

async function readRefs<T extends DocumentData>(
  transaction: FirestoreTransaction,
  refs: Map<string, DocumentReference<DocumentData, DocumentData>>,
) {
  const result = new Map<string, T>();
  for (const [id, ref] of refs) {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error("Dữ liệu tham chiếu không còn tồn tại.");
    result.set(id, snap.data() as T);
  }
  return result;
}

async function saveCloudTransaction(workspaceId: string, input: TransactionInput, existing?: MoneyTransaction) {
  const { db } = getFirebaseClient();
  const uid = await currentUid();
  const transactionRef = existing
    ? doc(db, "workspaces", workspaceId, "transactions", existing.id)
    : doc(collection(db, "workspaces", workspaceId, "transactions"));

  return runTransaction(db, async (fireTx) => {
    let old: MoneyTransaction | null = null;
    if (existing) {
      const oldSnap = await fireTx.get(transactionRef);
      if (!oldSnap.exists()) throw new Error("Giao dịch đã thay đổi hoặc không còn tồn tại.");
      old = oldSnap.data() as MoneyTransaction;
      if (old.isDeleted) throw new Error("Giao dịch này đã bị xóa.");
    }

    const walletIds = new Set<string>();
    const categoryIds = new Set<string>();
    const collect = (item: Pick<MoneyTransaction, "walletId" | "categoryId" | "sourceWalletId" | "destinationWalletId"> | null) => {
      if (!item) return;
      if (item.walletId) walletIds.add(item.walletId);
      if (item.sourceWalletId) walletIds.add(item.sourceWalletId);
      if (item.destinationWalletId) walletIds.add(item.destinationWalletId);
      if (item.categoryId) categoryIds.add(item.categoryId);
    };
    collect(old);
    collect(inputAsImpact(input));

    const walletRefs = getWalletRefs(workspaceId, walletIds);
    const categoryRefs = getCategoryRefs(workspaceId, categoryIds);
    const wallets = await readRefs<Wallet>(fireTx, walletRefs);
    const categories = await readRefs<Category>(fireTx, categoryRefs);

    const selectedWalletIds = input.type === "transfer" ? [input.sourceWalletId, input.destinationWalletId] : [input.walletId];
    for (const walletId of selectedWalletIds) {
      if (!walletId) continue;
      const wallet = wallets.get(walletId);
      if (!wallet || wallet.isDeleted) throw new Error("Ví được chọn không còn tồn tại.");
      if (wallet.status !== "active" && !transactionUsesWallet(old, walletId)) throw new Error("Ví được chọn đang bị ẩn.");
    }
    if (input.categoryId) {
      const category = categories.get(input.categoryId);
      if (!category || category.isDeleted) throw new Error("Danh mục được chọn không còn tồn tại.");
      if (category.status !== "active" && !transactionUsesCategory(old, input.categoryId)) throw new Error("Danh mục được chọn đang bị ẩn.");
      if (category.type !== input.type) throw new Error("Danh mục không đúng loại giao dịch.");
    }

    const { walletDeltas, categoryDeltas } = calculateTransactionDeltas(old, inputAsImpact(input));

    for (const [id, delta] of walletDeltas) {
      const wallet = wallets.get(id);
      const ref = walletRefs.get(id);
      if (!wallet || !ref) throw new Error("Không tìm thấy ví liên quan.");
      const currentBalance = wallet.currentBalance + delta.balance;
      const transactionCount = wallet.transactionCount + delta.count;
      if (!Number.isSafeInteger(currentBalance)) throw new Error("Số dư ví vượt giới hạn an toàn.");
      if (!Number.isSafeInteger(transactionCount) || transactionCount < 0) throw new Error("Số lượng giao dịch của ví không nhất quán.");
      fireTx.update(ref, { currentBalance, transactionCount, updatedAt: serverTimestamp(), updatedBy: uid });
      wallets.set(id, { ...wallet, currentBalance, transactionCount });
    }

    for (const [id, delta] of categoryDeltas) {
      const category = categories.get(id);
      const ref = categoryRefs.get(id);
      if (!category || !ref) throw new Error("Không tìm thấy danh mục liên quan.");
      const transactionCount = category.transactionCount + delta.count;
      if (!Number.isSafeInteger(transactionCount) || transactionCount < 0) throw new Error("Số lượng giao dịch của danh mục không nhất quán.");
      fireTx.update(ref, { transactionCount, updatedAt: serverTimestamp(), updatedBy: uid });
      categories.set(id, { ...category, transactionCount });
    }

    const base = snapshotTransaction(transactionRef.id, workspaceId, input, wallets, categories, uid, old?.createdAt);
    const transactionAt = Timestamp.fromDate(new Date(`${input.dateKey}T12:00:00`));
    const data = {
      ...base,
      transactionAt,
      createdAt: old?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: old?.createdBy ?? uid,
      updatedBy: uid,
    };
    fireTx.set(transactionRef, data);
    return { ...base, transactionAt };
  });
}

export async function saveTransaction(
  mode: DataMode,
  workspaceId: string,
  input: TransactionInput,
  existing?: MoneyTransaction,
) {
  validateInput(input);
  if (mode === "local") return saveLocalTransaction(workspaceId, input, existing);
  return saveCloudTransaction(workspaceId, input, existing);
}

async function deleteLocalTransaction(workspaceId: string, transactionId: string) {
  const transactions = readLocal<MoneyTransaction[]>(workspaceId, "transactions", []);
  const wallets = readLocal<Wallet[]>(workspaceId, "wallets", []);
  const categories = readLocal<Category[]>(workspaceId, "categories", []);
  const old = transactions.find((item) => item.id === transactionId && !item.isDeleted);
  if (!old) throw new Error("Giao dịch không còn tồn tại.");

  const { walletDeltas, categoryDeltas } = calculateTransactionDeltas(old, null);
  const nextWallets = wallets.map((wallet) => walletDeltas.has(wallet.id) ? safeWalletUpdate(wallet, walletDeltas.get(wallet.id)!) : wallet);
  const nextCategories = categories.map((category) => categoryDeltas.has(category.id) ? safeCategoryUpdate(category, categoryDeltas.get(category.id)!) : category);
  const stamp = nowIso();
  const nextTransactions = transactions.map((item) => item.id === transactionId ? { ...item, isDeleted: true, updatedAt: stamp, updatedBy: localUserId(workspaceId) } : item);

  const backup = { wallets, categories, transactions };
  try {
    writeLocal(workspaceId, "wallets", nextWallets);
    writeLocal(workspaceId, "categories", nextCategories);
    writeLocal(workspaceId, "transactions", nextTransactions);
  } catch (error) {
    try {
      writeLocal(workspaceId, "wallets", backup.wallets);
      writeLocal(workspaceId, "categories", backup.categories);
      writeLocal(workspaceId, "transactions", backup.transactions);
    } catch {
      // Best effort rollback.
    }
    throw error;
  }
}

async function deleteCloudTransaction(workspaceId: string, transactionId: string) {
  const { db } = getFirebaseClient();
  const uid = await currentUid();
  const transactionRef = doc(db, "workspaces", workspaceId, "transactions", transactionId);

  await runTransaction(db, async (fireTx) => {
    const oldSnap = await fireTx.get(transactionRef);
    if (!oldSnap.exists()) throw new Error("Giao dịch không còn tồn tại.");
    const old = oldSnap.data() as MoneyTransaction;
    if (old.isDeleted) throw new Error("Giao dịch này đã bị xóa.");

    const walletIds = new Set<string>();
    if (old.walletId) walletIds.add(old.walletId);
    if (old.sourceWalletId) walletIds.add(old.sourceWalletId);
    if (old.destinationWalletId) walletIds.add(old.destinationWalletId);
    const categoryIds = new Set<string>();
    if (old.categoryId) categoryIds.add(old.categoryId);

    const walletRefs = getWalletRefs(workspaceId, walletIds);
    const categoryRefs = getCategoryRefs(workspaceId, categoryIds);
    const wallets = await readRefs<Wallet>(fireTx, walletRefs);
    const categories = await readRefs<Category>(fireTx, categoryRefs);
    const { walletDeltas, categoryDeltas } = calculateTransactionDeltas(old, null);

    for (const [id, delta] of walletDeltas) {
      const wallet = wallets.get(id);
      const ref = walletRefs.get(id);
      if (!wallet || !ref) throw new Error("Không tìm thấy ví liên quan.");
      const currentBalance = wallet.currentBalance + delta.balance;
      const transactionCount = wallet.transactionCount + delta.count;
      if (!Number.isSafeInteger(currentBalance) || transactionCount < 0) throw new Error("Dữ liệu ví không nhất quán.");
      fireTx.update(ref, { currentBalance, transactionCount, updatedAt: serverTimestamp(), updatedBy: uid });
    }
    for (const [id, delta] of categoryDeltas) {
      const category = categories.get(id);
      const ref = categoryRefs.get(id);
      if (!category || !ref) throw new Error("Không tìm thấy danh mục liên quan.");
      const transactionCount = category.transactionCount + delta.count;
      if (transactionCount < 0) throw new Error("Dữ liệu danh mục không nhất quán.");
      fireTx.update(ref, { transactionCount, updatedAt: serverTimestamp(), updatedBy: uid });
    }
    fireTx.update(transactionRef, { isDeleted: true, updatedAt: serverTimestamp(), updatedBy: uid });
  });
}

export async function deleteTransaction(mode: DataMode, workspaceId: string, transactionId: string) {
  if (mode === "local") return deleteLocalTransaction(workspaceId, transactionId);
  return deleteCloudTransaction(workspaceId, transactionId);
}

export function transactionTypeLabel(type: TransactionType) {
  if (type === "income") return "Thu nhập";
  if (type === "expense") return "Chi tiêu";
  return "Chuyển tiền";
}
