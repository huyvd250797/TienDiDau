"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthErrorScreen } from "@/components/auth/auth-error-screen";
import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/components/providers/auth-provider";
import { Icon } from "@/components/ui/icons";

export function LoginScreen() {
  const { status, error, firebaseUser, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  if (status === "initializing") {
    return <AuthLoadingScreen />;
  }

  if (status === "bootstrapping") {
    return <AuthLoadingScreen message="Đang chuẩn bị tài khoản của bạn…" />;
  }

  if (status === "authenticated") {
    return <AuthLoadingScreen message="Đang mở Dashboard…" />;
  }

  if (status === "error" && firebaseUser) {
    return <AuthErrorScreen />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-[-14rem] size-[34rem] -translate-x-1/2 rounded-full bg-primary/16 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl items-center justify-center">
        <section className="surface-card grid w-full max-w-4xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[590px] overflow-hidden border-r border-border bg-linear-to-br from-primary/18 via-card to-card p-10 lg:block">
            <div className="absolute -right-28 -top-20 size-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative">
              <Brand />
              <p className="mt-20 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Tài chính rõ ràng hơn mỗi ngày
              </p>
              <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight tracking-[-0.035em]">
                Biết tiền đi đâu, chủ động cho tương lai.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Quản lý nhiều ví, theo dõi thu chi và đồng bộ dữ liệu an toàn trên mọi thiết bị.
              </p>
              <div className="mt-12 grid gap-3">
                {[
                  "Dữ liệu tách riêng theo tài khoản Google",
                  "Dark Mode hiện đại, tối ưu cho điện thoại",
                  "Sẵn nền tảng mở rộng quản lý gia đình"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur">
                    <span className="grid size-8 place-items-center rounded-xl bg-income/12 text-income">
                      <Icon name="check" className="size-4" />
                    </span>
                    <p className="text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-[560px] flex-col justify-center p-6 sm:p-10">
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="mt-12 lg:mt-0">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                V1.1.2 · AuthBootstrap
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight">Chào mừng trở lại</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Đăng nhập để đồng bộ ví, danh mục và giao dịch của riêng bạn.
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-expense/25 bg-expense/8 p-4" role="alert">
                <div className="flex items-start gap-3">
                  <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-expense" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{error.message}</p>
                    {error.detail ? (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{error.detail}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    aria-label="Đóng thông báo"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <GoogleSignInButton />
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-muted/70 p-4">
              <Icon name="shield" className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                Tiền Đi Đâu chỉ sử dụng họ tên, email và ảnh đại diện để tạo hồ sơ. Ứng dụng không đọc mật khẩu Google của bạn.
              </p>
            </div>

            <p className="mt-8 text-center text-[11px] leading-5 text-muted-foreground">
              Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư của Tiền Đi Đâu.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
