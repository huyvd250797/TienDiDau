import type { NavigationItem } from "@/types/navigation";

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Ví", href: "/wallets", icon: "wallet" },
  { label: "Giao dịch", href: "/transactions", icon: "transactions" },
  { label: "Báo cáo", href: "/reports", icon: "reports" }
] as const;

export const secondaryNavigation: readonly NavigationItem[] = [
  { label: "Cài đặt", href: "/settings", icon: "settings" }
] as const;
