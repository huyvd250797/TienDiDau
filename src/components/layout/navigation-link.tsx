"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/ui/icons";
import type { NavigationItem } from "@/types/navigation";

interface NavigationLinkProps {
  item: NavigationItem;
  variant: "sidebar" | "mobile";
}

export function NavigationLink({ item, variant }: NavigationLinkProps) {
  const pathname = usePathname();
  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  if (variant === "mobile") {
    return (
      <Link href={item.href} className={active ? "mobile-nav-active" : "mobile-nav-item"}>
        <Icon name={item.icon} className="size-5" />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Link href={item.href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
      <Icon name={item.icon} className="size-5" />
      <span>{item.label}</span>
    </Link>
  );
}
