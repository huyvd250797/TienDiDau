export type WorkspaceSettings = {
  id: "general";
  theme: "dark" | "light" | "system";
  currency: "VND";
  locale: "vi-VN";
  timezone: string;
  dateFormat: "dd/MM/yyyy";
  defaultWalletId: string | null;
  onboardingCompleted: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  schemaVersion: 1;
};
