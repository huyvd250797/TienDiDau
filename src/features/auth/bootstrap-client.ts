import type { User } from "firebase/auth";
import { z } from "zod";

import type { AppAuthError, AuthBootstrapData, AuthBootstrapResponse } from "@/types/auth";

const authErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  detail: z.string().optional()
});

const bootstrapResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.object({
      isFirstLogin: z.boolean(),
      user: z.object({
        id: z.string(),
        displayName: z.string(),
        email: z.string(),
        avatarUrl: z.string().nullable(),
        provider: z.literal("google"),
        personalWorkspaceId: z.string(),
        locale: z.literal("vi-VN"),
        timezone: z.string(),
        onboardingCompleted: z.boolean()
      }),
      workspace: z.object({
        id: z.string(),
        name: z.string(),
        type: z.literal("personal"),
        ownerId: z.string(),
        baseCurrency: z.literal("VND"),
        status: z.literal("active"),
        schemaVersion: z.number()
      }),
      settings: z.object({
        id: z.literal("general"),
        theme: z.enum(["dark", "light", "system"]),
        currency: z.literal("VND"),
        locale: z.literal("vi-VN"),
        timezone: z.string(),
        dateFormat: z.literal("dd/MM/yyyy"),
        firstDayOfWeek: z.literal(1),
        onboardingStep: z.literal("create-wallet"),
        schemaVersion: z.number()
      }),
      categories: z.object({
        total: z.number(),
        income: z.number(),
        expense: z.number()
      }),
      nextStep: z.literal("create-wallet")
    })
  }),
  z.object({
    success: z.literal(false),
    error: authErrorSchema
  })
]);

class BootstrapRequestError extends Error {
  readonly authError: AppAuthError;
  readonly status: number;

  constructor(authError: AppAuthError, status: number) {
    super(authError.message);
    this.name = "BootstrapRequestError";
    this.authError = authError;
    this.status = status;
  }
}

async function requestBootstrap(idToken: string): Promise<AuthBootstrapResponse> {
  let response: Response;
  try {
    response = await fetch("/api/auth/bootstrap", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });
  } catch {
    throw new BootstrapRequestError(
      {
        code: "AUTH_NETWORK_ERROR",
        message: "Không thể kết nối tới máy chủ để đồng bộ tài khoản."
      },
      0
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new BootstrapRequestError(
      {
        code: "BOOTSTRAP_FAILED",
        message: "Máy chủ trả về dữ liệu không hợp lệ."
      },
      response.status
    );
  }

  const parsed = bootstrapResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new BootstrapRequestError(
      {
        code: "BOOTSTRAP_FAILED",
        message: "Không thể xác thực cấu trúc dữ liệu tài khoản."
      },
      response.status
    );
  }

  return parsed.data as AuthBootstrapResponse;
}

export async function bootstrapAuthenticatedUser(
  user: User,
  forceRefresh = false
): Promise<AuthBootstrapData> {
  let idToken = await user.getIdToken(forceRefresh);
  let result = await requestBootstrap(idToken);

  if (!result.success && result.error.code === "AUTH_TOKEN_INVALID" && !forceRefresh) {
    idToken = await user.getIdToken(true);
    result = await requestBootstrap(idToken);
  }

  if (!result.success) {
    throw new BootstrapRequestError(result.error, 400);
  }

  return result.data;
}

export function getBootstrapAuthError(error: unknown): AppAuthError | null {
  return error instanceof BootstrapRequestError ? error.authError : null;
}
