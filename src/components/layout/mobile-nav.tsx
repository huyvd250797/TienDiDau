import { NavigationLink } from "@/components/layout/navigation-link";
import { Icon } from "@/components/ui/icons";
import type { NavigationItem } from "@/types/navigation";

const items = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Ví", href: "/wallets", icon: "wallet" },
  { label: "Giao dịch", href: "/transactions", icon: "transactions" },
  { label: "Báo cáo", href: "/reports", icon: "reports" }
] as const satisfies readonly NavigationItem[];

export function MobileNav() {
  return (
    <nav
      aria-label="Điều hướng trên điện thoại"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-navigation/95 px-[max(12px,env(safe-area-inset-left))] pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-2xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end">
        {items.slice(0, 2).map((item) => (
          <NavigationLink key={item.href} item={item} variant="mobile" />
        ))}

        <button type="button" className="mobile-add-button" aria-label="Thêm giao dịch">
          <Icon name="add" className="size-7" />
        </button>

        {items.slice(2).map((item) => (
          <NavigationLink key={item.href} item={item} variant="mobile" />
        ))}
      </div>
    </nav>
  );
}
