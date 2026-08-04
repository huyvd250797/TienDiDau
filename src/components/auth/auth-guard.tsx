"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { AuthErrorScreen } from "@/components/auth/auth-error-screen";
import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "authenticated") {
    return children;
  }

  if (status === "error") {
    return <AuthErrorScreen />;
  }

  if (status === "bootstrapping") {
    return <AuthLoadingScreen message="Đang chuẩn bị tài khoản của bạn…" />;
  }

  if (status === "authenticating") {
    return <AuthLoadingScreen message="Đang đăng nhập với Google…" />;
  }

  return <AuthLoadingScreen />;
}
