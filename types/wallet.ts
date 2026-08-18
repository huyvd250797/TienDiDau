export type WalletType = "cash" | "bank" | "e_wallet" | "credit_card" | "other";
export type WalletStatus = "active" | "hidden";

export type Wallet = {
  id: string;
  workspaceId: string;
  name: string;
  type: WalletType;
  icon: string;
  color: string;
  initialBalance: number;
  currentBalance: number;
  startDate: string;
  status: WalletStatus;
  isDefault: boolean;
  transactionCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  schemaVersion: 1;
};

export type WalletInput = Pick<
  Wallet,
  "name" | "type" | "icon" | "color" | "initialBalance" | "startDate" | "isDefault"
>;
