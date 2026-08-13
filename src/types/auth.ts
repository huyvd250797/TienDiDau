export type AuthStatus = "initializing" | "bootstrapping" | "authenticated" | "error";

export type AppAuthErrorCode =
  | "FIREBASE_CLIENT_NOT_CONFIGURED"
  | "AUTH_ANONYMOUS_DISABLED"
  | "AUTH_NETWORK_ERROR"
  | "BOOTSTRAP_FAILED"
  | "PERMISSION_DENIED"
  | "UNKNOWN_ERROR";

export interface AppAuthError {
  code: AppAuthErrorCode;
  message: string;
  detail?: string;
}

export interface AuthUserProfile {
  id: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  provider: "anonymous" | "google";
  personalWorkspaceId: string;
  locale: "vi-VN";
  timezone: string;
  onboardingCompleted: boolean;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  type: "personal";
  ownerId: string;
  baseCurrency: "VND";
  status: "active";
  schemaVersion: number;
}

export interface WorkspaceSettingsSummary {
  id: "general";
  theme: "dark" | "light" | "system";
  currency: "VND";
  locale: "vi-VN";
  timezone: string;
  dateFormat: "dd/MM/yyyy";
  firstDayOfWeek: 1;
  onboardingStep: "create-wallet";
  schemaVersion: number;
}

export interface CategoryBootstrapSummary {
  total: number;
  income: number;
  expense: number;
}

export interface AuthBootstrapData {
  isFirstLogin: boolean;
  user: AuthUserProfile;
  workspace: WorkspaceSummary;
  settings: WorkspaceSettingsSummary;
  categories: CategoryBootstrapSummary;
  nextStep: "create-wallet";
}
