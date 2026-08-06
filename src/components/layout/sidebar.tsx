import { Brand } from "@/components/layout/brand";
import { NavigationLink } from "@/components/layout/navigation-link";
import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-border/70 bg-sidebar/95 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="px-2">
        <Brand />
      </div>

      <nav aria-label="Điều hướng chính" className="mt-10 space-y-1.5">
        {primaryNavigation.map((item) => (
          <NavigationLink key={item.href} item={item} variant="sidebar" />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <nav aria-label="Điều hướng phụ" className="space-y-1.5">
          {secondaryNavigation.map((item) => (
            <NavigationLink key={item.href} item={item} variant="sidebar" />
          ))}
        </nav>

        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-foreground">V1.1.1 · AuthBootstrap</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Google Login, hồ sơ, workspace, phân quyền và danh mục mặc định đã sẵn sàng.
          </p>
        </div>
      </div>
    </aside>
  );
}
