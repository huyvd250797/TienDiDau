"use client";

import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/components/providers/auth-provider";
import { Icon } from "@/components/ui/icons";

export function AuthErrorScreen() {
  const { error, retryAccess } = useAuth();

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-10 text-foreground">
      <section className="surface-card w-full max-w-lg p-6 sm:p-8">
        <Brand />
        <div className="mt-8 grid size-12 place-items-center rounded-2xl bg-expense/12 text-expense">
          <Icon name="alert" className="size-6" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-expense">
          Chưa thể mở dữ liệu
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {error?.message ?? "Đã xảy ra lỗi kết nối"}
        </h1>
        {error?.detail ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{error.detail}</p>
        ) : null}
        <button type="button" onClick={() => void retryAccess()} className="primary-button mt-7 w-full">
          <Icon name="refresh" className="size-4" />
          Thử lại
        </button>
      </section>
    </main>
  );
}
