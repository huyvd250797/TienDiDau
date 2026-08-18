export type CategoryType = "income" | "expense";
export type CategoryStatus = "active" | "hidden";

export type Category = {
  id: string;
  workspaceId: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  status: CategoryStatus;
  transactionCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  schemaVersion: 1;
};

export type CategoryInput = Pick<Category, "name" | "type" | "icon" | "color">;
