import { FirebaseError } from "firebase/app";

import type { AppAuthError } from "@/types/auth";

const UNKNOWN_ERROR: AppAuthError = {
  code: "UNKNOWN_ERROR",
  message: "Không thể mở dữ liệu. Vui lòng thử lại."
};

export function normalizeAuthError(error: unknown): AppAuthError {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/operation-not-allowed":
        return {
          code: "AUTH_ANONYMOUS_DISABLED",
          message: "Firebase Anonymous chưa được bật.",
          detail: "Vào Firebase Authentication → Sign-in method → Anonymous → Enable."
        };
      case "auth/network-request-failed":
      case "unavailable":
        return {
          code: "AUTH_NETWORK_ERROR",
          message: "Không thể đồng bộ Firebase lúc này.",
          detail: "Kiểm tra kết nối mạng rồi thử lại."
        };
      case "permission-denied":
        return {
          code: "PERMISSION_DENIED",
          message: "Firestore Rules chưa cho phép truy cập dữ liệu.",
          detail: "Publish file firestore.rules của phiên bản hiện tại rồi thử lại."
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
          message: "Không thể khởi tạo phiên sử dụng.",
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
