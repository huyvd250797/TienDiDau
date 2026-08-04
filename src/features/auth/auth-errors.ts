import { FirebaseError } from "firebase/app";

import type { AppAuthError } from "@/types/auth";

const UNKNOWN_ERROR: AppAuthError = {
  code: "UNKNOWN_ERROR",
  message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại."
};

export function normalizeAuthError(error: unknown): AppAuthError {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/popup-blocked":
        return {
          code: "AUTH_POPUP_BLOCKED",
          message: "Trình duyệt đang chặn cửa sổ đăng nhập Google.",
          detail: "Hãy cho phép popup cho website này rồi thử lại."
        };
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return {
          code: "AUTH_POPUP_CLOSED",
          message: "Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất."
        };
      case "auth/unauthorized-domain":
        return {
          code: "AUTH_UNAUTHORIZED_DOMAIN",
          message: "Tên miền hiện tại chưa được cho phép đăng nhập Google.",
          detail: "Hãy thêm domain Netlify vào Firebase Authentication → Authorized domains."
        };
      case "auth/operation-not-allowed":
        return {
          code: "AUTH_PROVIDER_DISABLED",
          message: "Google Sign-In chưa được bật trong Firebase Authentication."
        };
      case "auth/network-request-failed":
        return {
          code: "AUTH_NETWORK_ERROR",
          message: "Không thể kết nối tới Firebase. Hãy kiểm tra mạng rồi thử lại."
        };
      case "auth/invalid-api-key":
      case "auth/app-not-authorized":
        return {
          code: "FIREBASE_CLIENT_NOT_CONFIGURED",
          message: "Cấu hình Firebase phía trình duyệt chưa chính xác."
        };
      default:
        return {
          code: "UNKNOWN_ERROR",
          message: "Không thể hoàn tất đăng nhập Google.",
          detail: error.code
        };
    }
  }

  if (error instanceof Error) {
    return {
      ...UNKNOWN_ERROR,
      detail: error.message
    };
  }

  return UNKNOWN_ERROR;
}
