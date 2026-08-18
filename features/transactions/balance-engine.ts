import type { Transaction, TransactionInput } from "@/types/transaction";

export type TransactionImpact = Pick<
  Transaction,
  "type" | "amount" | "walletId" | "categoryId" | "sourceWalletId" | "destinationWalletId"
>;

export type WalletDelta = { balance: number; count: number };
export type CategoryDelta = { count: number };

function bumpWallet(map: Map<string, WalletDelta>, id: string | null, balance: number, count: number) {
  if (!id) return;
  const current = map.get(id) ?? { balance: 0, count: 0 };
  map.set(id, { balance: current.balance + balance, count: current.count + count });
}

function bumpCategory(map: Map<string, CategoryDelta>, id: string | null, count: number) {
  if (!id) return;
  const current = map.get(id) ?? { count: 0 };
  map.set(id, { count: current.count + count });
}

function applyImpact(
  item: TransactionImpact,
  direction: 1 | -1,
  walletDeltas: Map<string, WalletDelta>,
  categoryDeltas: Map<string, CategoryDelta>,
) {
  if (item.type === "income") {
    bumpWallet(walletDeltas, item.walletId, direction * item.amount, direction);
    bumpCategory(categoryDeltas, item.categoryId, direction);
    return;
  }
  if (item.type === "expense") {
    bumpWallet(walletDeltas, item.walletId, -direction * item.amount, direction);
    bumpCategory(categoryDeltas, item.categoryId, direction);
    return;
  }
  bumpWallet(walletDeltas, item.sourceWalletId, -direction * item.amount, direction);
  bumpWallet(walletDeltas, item.destinationWalletId, direction * item.amount, direction);
}

export function inputAsImpact(input: TransactionInput): TransactionImpact {
  return {
    type: input.type,
    amount: input.amount,
    walletId: input.type === "transfer" ? null : input.walletId,
    categoryId: input.type === "transfer" ? null : input.categoryId,
    sourceWalletId: input.type === "transfer" ? input.sourceWalletId : null,
    destinationWalletId: input.type === "transfer" ? input.destinationWalletId : null,
  };
}

export function calculateTransactionDeltas(oldItem: TransactionImpact | null, newItem: TransactionImpact | null) {
  const walletDeltas = new Map<string, WalletDelta>();
  const categoryDeltas = new Map<string, CategoryDelta>();
  if (oldItem) applyImpact(oldItem, -1, walletDeltas, categoryDeltas);
  if (newItem) applyImpact(newItem, 1, walletDeltas, categoryDeltas);
  return { walletDeltas, categoryDeltas };
}
