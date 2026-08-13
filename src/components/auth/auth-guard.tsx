"use client";

import type { ReactNode } from "react";

import { AuthErrorScreen } from "@/components/auth/auth-error-screen";
import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const { status } = useAuth();

  if (status === "authenticated") return children;
  if (status === "error") return <AuthErrorScreen />;
  if (status === "bootstrapping") {
    return <AuthLoadingScreen message="Đang chuẩn bị dữ liệu lần đầu…" />;
  }
  return <AuthLoadingScreen />;
}
