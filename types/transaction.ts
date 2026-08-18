export type TransactionType = "income" | "expense" | "transfer";

export type Transaction = {
  id: string;
  workspaceId: string;
  type: TransactionType;
  amount: number;
  dateKey: string;
  timezone: string;
  note: string;

  walletId: string | null;
  categoryId: string | null;
  sourceWalletId: string | null;
  destinationWalletId: string | null;

  walletName: string | null;
  walletIcon: string | null;
  walletColor: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
  sourceWalletName: string | null;
  sourceWalletIcon: string | null;
  destinationWalletName: string | null;
  destinationWalletIcon: string | null;

  transactionAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  schemaVersion: 1;
};

export type TransactionInput = {
  type: TransactionType;
  amount: number;
  dateKey: string;
  note: string;
  walletId: string | null;
  categoryId: string | null;
  sourceWalletId: string | null;
  destinationWalletId: string | null;
};
