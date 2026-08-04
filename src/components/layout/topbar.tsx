"use client";

import { usePathname } from "next/navigation";

import { UserMenu } from "@/components/auth/user-menu";
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
        <div className="sm:hidden">
          <Brand compact />
        </div>
        <div className="hidden sm:block lg:hidden">
          <Brand />
        </div>

        <div className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            TienDiDau · V1.1.0
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-button"
            aria-label={resolvedTheme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          >
            <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} className="size-5" />
          </button>
          <button type="button" className="icon-button" aria-label="Thông báo" disabled title="Thông báo sẽ có ở phase sau">
            <Icon name="bell" className="size-5" />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
