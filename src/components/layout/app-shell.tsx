import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-background text-foreground">
        <Sidebar />
        <div className="min-h-dvh lg:pl-[280px]">
          <Topbar />
          <main className="mx-auto w-full max-w-[1440px] px-4 pt-5 pb-28 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
