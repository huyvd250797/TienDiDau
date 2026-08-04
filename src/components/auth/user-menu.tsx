"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/auth/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Icon } from "@/components/ui/icons";

export function UserMenu() {
  const { bootstrap, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = bootstrap?.user;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setConfirming(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!confirming) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [confirming]);

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-1 flex items-center gap-3 rounded-2xl border border-border bg-card px-2 py-1.5 text-left transition hover:border-primary/40"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.displayName} imageUrl={user.avatarUrl} size="sm" />
        <span className="hidden max-w-44 pr-1 sm:block">
          <span className="block truncate text-sm font-semibold text-foreground">{user.displayName}</span>
          <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
        </span>
        <Icon name="chevron" className={`hidden size-4 text-muted-foreground transition sm:block ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border/70 p-3">
            <Avatar name={user.displayName} imageUrl={user.avatarUrl} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{user.displayName}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="p-1.5">
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <Icon name="user" className="size-4 text-muted-foreground" />
              Hồ sơ và cài đặt
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setConfirming(true);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-expense transition hover:bg-expense/8"
            >
              <Icon name="logout" className="size-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      ) : null}

      {confirming ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#020611]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="surface-card w-full max-w-sm p-6">
            <div className="grid size-11 place-items-center rounded-2xl bg-expense/10 text-expense">
              <Icon name="logout" className="size-5" />
            </div>
            <h2 id="logout-title" className="mt-5 text-xl font-bold">Đăng xuất khỏi Tiền Đi Đâu?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Dữ liệu trên Firestore vẫn được giữ nguyên và sẽ đồng bộ lại khi bạn đăng nhập.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="secondary-button" onClick={() => setConfirming(false)}>
                Hủy
              </button>
              <button
                type="button"
                className="flex min-h-11 items-center justify-center rounded-xl bg-expense px-4 text-sm font-semibold text-white"
                onClick={() => void signOutUser()}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
