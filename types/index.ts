export type TransactionType = "expense" | "income" | "transfer";
export type CategoryType = "expense" | "income";

export interface Account {
  id: string;
  name: string;
  type: string;
  icon: string;
  initialBalance: number;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  order: number;
}

export interface MoneyTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  dateKey: string;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  monthKey: string;
}

export interface MetaData {
  accounts: Account[];
  categories: Category[];
}
