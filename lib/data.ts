import { FieldValue, Timestamp, type DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "@/lib/firebase-admin";
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, USER_ID } from "@/lib/constants";
import type { MoneyTransaction, TransactionType } from "@/types";

export const userRef = () => db().collection("users").doc(USER_ID);
export const accountsRef = () => userRef().collection("accounts");
export const categoriesRef = () => userRef().collection("categories");
export const transactionsRef = () => userRef().collection("transactions");
export const budgetsRef = () => userRef().collection("budgets");

export async function ensureDefaults() {
  const [accountSnap, categorySnap] = await Promise.all([
    accountsRef().limit(1).get(),
    categoriesRef().limit(1).get(),
  ]);
  const batch = db().batch();
  let changed = false;
  if (accountSnap.empty) {
    batch.set(accountsRef().doc("cash"), {
      name: "Tiền mặt", type: "cash", icon: "💵", initialBalance: 0, balance: 0,
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
    changed = true;
  }
  if (categorySnap.empty) {
    let order = 0;
    for (const [id, name, icon, color] of DEFAULT_EXPENSE_CATEGORIES) {
      batch.set(categoriesRef().doc(id), { name, icon, color, type: "expense", order: order++ });
    }
    order = 0;
    for (const [id, name, icon, color] of DEFAULT_INCOME_CATEGORIES) {
      batch.set(categoriesRef().doc(id), { name, icon, color, type: "income", order: order++ });
    }
    changed = true;
  }
  if (changed) await batch.commit();
  await userRef().set({ displayName: USER_ID, currency: "VND", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export function serializeDoc(doc: DocumentSnapshot) {
  const data = doc.data() || {};
  const serialized: Record<string, unknown> = { id: doc.id };
  for (const [key, value] of Object.entries(data)) {
    serialized[key] = value instanceof Timestamp ? value.toDate().toISOString() : value;
  }
  return serialized;
}

export async function getMeta() {
  await ensureDefaults();
  const [accounts, categories] = await Promise.all([
    accountsRef().orderBy("createdAt", "asc").get(),
    categoriesRef().get(),
  ]);
  return {
    accounts: accounts.docs.map(serializeDoc),
    categories: categories.docs.map(serializeDoc).sort((a: any, b: any) => a.type.localeCompare(b.type) || a.order - b.order),
  };
}

function accountDeltas(t: Omit<MoneyTransaction, "id"> | MoneyTransaction, direction = 1) {
  const deltas = new Map<string, number>();
  const add = (id: string | undefined, value: number) => { if (id) deltas.set(id, (deltas.get(id) || 0) + value * direction); };
  if (t.type === "expense") add(t.accountId, -t.amount);
  if (t.type === "income") add(t.accountId, t.amount);
  if (t.type === "transfer") { add(t.accountId, -t.amount); add(t.toAccountId, t.amount); }
  return deltas;
}

function mergeDeltas(target: Map<string, number>, source: Map<string, number>) {
  for (const [id, value] of source) target.set(id, (target.get(id) || 0) + value);
}

export function validateTransaction(input: any) {
  const type = input.type as TransactionType;
  const amount = Math.round(Number(input.amount));
  const dateKey = String(input.dateKey || "");
  const accountId = String(input.accountId || "");
  if (!["expense", "income", "transfer"].includes(type)) throw new Error("Loại giao dịch không hợp lệ");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Số tiền phải lớn hơn 0");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) throw new Error("Ngày không hợp lệ");
  if (!accountId) throw new Error("Vui lòng chọn ví");
  if (type === "transfer" && (!input.toAccountId || input.toAccountId === accountId)) throw new Error("Ví nhận phải khác ví gửi");
  if (type !== "transfer" && !input.categoryId) throw new Error("Vui lòng chọn danh mục");
  return {
    type, amount, dateKey, accountId,
    categoryId: type === "transfer" ? "" : String(input.categoryId),
    toAccountId: type === "transfer" ? String(input.toAccountId) : "",
    note: String(input.note || "").trim().slice(0, 300),
  };
}

export async function createTransaction(input: any) {
  const payload = validateTransaction(input);
  const ref = transactionsRef().doc();
  await db().runTransaction(async tx => {
    const deltas = accountDeltas(payload);
    for (const [accountId] of deltas) {
      const snap = await tx.get(accountsRef().doc(accountId));
      if (!snap.exists) throw new Error("Ví không tồn tại");
    }
    tx.set(ref, { ...payload, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    for (const [accountId, delta] of deltas) tx.update(accountsRef().doc(accountId), { balance: FieldValue.increment(delta), updatedAt: FieldValue.serverTimestamp() });
  });
  return ref.id;
}

export async function updateTransaction(id: string, input: any) {
  const payload = validateTransaction(input);
  const ref = transactionsRef().doc(id);
  await db().runTransaction(async tx => {
    const oldSnap = await tx.get(ref);
    if (!oldSnap.exists) throw new Error("Giao dịch không tồn tại");
    const old = { id, ...(oldSnap.data() as any) } as MoneyTransaction;
    const deltas = new Map<string, number>();
    mergeDeltas(deltas, accountDeltas(old, -1));
    mergeDeltas(deltas, accountDeltas(payload, 1));
    for (const [accountId] of deltas) {
      const snap = await tx.get(accountsRef().doc(accountId));
      if (!snap.exists) throw new Error("Ví không tồn tại");
    }
    tx.update(ref, { ...payload, updatedAt: FieldValue.serverTimestamp() });
    for (const [accountId, delta] of deltas) if (delta) tx.update(accountsRef().doc(accountId), { balance: FieldValue.increment(delta), updatedAt: FieldValue.serverTimestamp() });
  });
}

export async function deleteTransaction(id: string) {
  const ref = transactionsRef().doc(id);
  await db().runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("Giao dịch không tồn tại");
    const old = { id, ...(snap.data() as any) } as MoneyTransaction;
    const deltas = accountDeltas(old, -1);
    tx.delete(ref);
    for (const [accountId, delta] of deltas) tx.update(accountsRef().doc(accountId), { balance: FieldValue.increment(delta), updatedAt: FieldValue.serverTimestamp() });
  });
}
