"use client";

import { Brand } from "@/components/layout/brand";
import { Icon } from "@/components/ui/icons";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthErrorScreen() {
  const { error, firebaseUser, retryBootstrap, signOutUser } = useAuth();

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-10 text-foreground">
      <section className="surface-card w-full max-w-lg p-6 sm:p-8">
        <Brand />
        <div className="mt-8 grid size-12 place-items-center rounded-2xl bg-expense/12 text-expense">
          <Icon name="alert" className="size-6" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-expense">
          Không thể khởi tạo tài khoản
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {error?.message ?? "Đã xảy ra lỗi xác thực"}
        </h1>
        {error?.detail ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{error.detail}</p>
        ) : null}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void retryBootstrap()}
            className="primary-button flex-1"
          >
            <Icon name="refresh" className="size-4" />
            Thử lại
          </button>
          {firebaseUser ? (
            <button
              type="button"
              onClick={() => void signOutUser()}
              className="secondary-button flex-1"
            >
              Đăng xuất
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
