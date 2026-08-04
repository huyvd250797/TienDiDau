import { NextResponse, type NextRequest } from "next/server";

import { getBearerToken } from "@/lib/auth/bearer-token";
import { bootstrapUserAccount } from "@/lib/auth/bootstrap-user";
import {
  getFirebaseAdminAuth,
  isFirebaseAdminConfigured
} from "@/lib/firebase/admin";
import type { AppAuthError, AuthBootstrapResponse } from "@/types/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: AppAuthError, status: number) {
  const body: AuthBootstrapResponse = {
    success: false,
    error
  };

  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function normalizeDisplayName(name: string | undefined, email: string) {
  const trimmedName = name?.trim();
  if (trimmedName) return trimmedName.slice(0, 120);

  const fallback = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return fallback ? fallback.slice(0, 120) : "Người dùng";
}

function getFirebaseAuthErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  const code = Reflect.get(error, "code");
  return typeof code === "string" && code.startsWith("auth/") ? code : null;
}

export async function POST(request: NextRequest) {
  if (!isFirebaseAdminConfigured) {
    return errorResponse(
      {
        code: "FIREBASE_ADMIN_NOT_CONFIGURED",
        message: "Firebase Admin chưa được cấu hình trên máy chủ.",
        detail:
          "Hãy thêm FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL và FIREBASE_ADMIN_PRIVATE_KEY trong Netlify."
      },
      503
    );
  }

  const idToken = getBearerToken(request);
  if (!idToken) {
    return errorResponse(
      {
        code: "AUTH_TOKEN_MISSING",
        message: "Yêu cầu đăng nhập không chứa Firebase ID Token."
      },
      401
    );
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
    const email = decoded.email?.trim().toLowerCase();

    if (!email) {
      return errorResponse(
        {
          code: "AUTH_EMAIL_MISSING",
          message: "Tài khoản Google không cung cấp địa chỉ email hợp lệ."
        },
        422
      );
    }

    const data = await bootstrapUserAccount({
      uid: decoded.uid,
      email,
      displayName: normalizeDisplayName(decoded.name, email),
      avatarUrl: decoded.picture?.trim() || null
    });

    const body: AuthBootstrapResponse = {
      success: true,
      data
    };

    return NextResponse.json(body, {
      status: data.isFirstLogin ? 201 : 200,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const firebaseAuthCode = getFirebaseAuthErrorCode(error);
    if (firebaseAuthCode) {
      return errorResponse(
        {
          code: "AUTH_TOKEN_INVALID",
          message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ.",
          detail: firebaseAuthCode
        },
        401
      );
    }

    console.error("[AuthBootstrap]", error);
    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error ? error.message : null;
    return errorResponse(
      {
        code: "BOOTSTRAP_FAILED",
        message: "Không thể tạo hoặc đồng bộ hồ sơ tài khoản.",
        ...(detail ? { detail } : {})
      },
      500
    );
  }
}
