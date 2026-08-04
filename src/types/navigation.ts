import type { Route } from "next";

export type NavigationIconName =
  | "dashboard"
  | "wallet"
  | "add"
  | "transactions"
  | "reports"
  | "settings";

export interface NavigationItem {
  label: string;
  href: Route;
  icon: NavigationIconName;
}
