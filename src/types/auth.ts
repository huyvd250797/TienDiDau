export type AuthStatus =
  | "initializing"
  | "unauthenticated"
  | "authenticating"
  | "bootstrapping"
  | "authenticated"
  | "error";

export type AppAuthErrorCode =
  | "FIREBASE_CLIENT_NOT_CONFIGURED"
  | "FIREBASE_ADMIN_NOT_CONFIGURED"
  | "AUTH_POPUP_BLOCKED"
  | "AUTH_POPUP_CLOSED"
  | "AUTH_UNAUTHORIZED_DOMAIN"
  | "AUTH_PROVIDER_DISABLED"
  | "AUTH_NETWORK_ERROR"
  | "AUTH_TOKEN_MISSING"
  | "AUTH_TOKEN_INVALID"
  | "AUTH_EMAIL_MISSING"
  | "BOOTSTRAP_FAILED"
  | "UNKNOWN_ERROR";

export interface AppAuthError {
  code: AppAuthErrorCode;
  message: string;
  detail?: string;
}

export interface AuthUserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  provider: "google";
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

export interface AuthSuccessResponse {
  success: true;
  data: AuthBootstrapData;
}

export interface AuthErrorResponse {
  success: false;
  error: AppAuthError;
}

export type AuthBootstrapResponse = AuthSuccessResponse | AuthErrorResponse;
