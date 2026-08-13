"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/layout/brand";
import { useTheme } from "@/components/providers/theme-provider";
import { Icon } from "@/components/ui/icons";

export function Topbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const title =
    pathname === "/wallets"
      ? "Ví của tôi"
      : pathname === "/transactions"
        ? "Giao dịch"
        : pathname === "/reports"
          ? "Báo cáo"
          : pathname === "/settings"
            ? "Cài đặt"
            : "Tổng quan tài chính";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="sm:hidden"><Brand compact /></div>
        <div className="hidden sm:block lg:hidden"><Brand /></div>
        <div className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            TienDiDau · V1.1.3
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-income/20 bg-income/8 px-3 py-2 text-xs font-semibold text-income sm:inline-flex">
            <span className="size-2 rounded-full bg-income" />
            Đã đồng bộ
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-button"
            aria-label={resolvedTheme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          >
            <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} className="size-5" />
          </button>
          <Link href="/settings" className="icon-button" aria-label="Cài đặt">
            <Icon name="settings" className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
