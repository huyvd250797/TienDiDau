import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";
import type { NavigationIconName } from "@/types/navigation";

interface PhasePlaceholderProps {
  title: string;
  description: string;
  nextVersion: string;
  icon: NavigationIconName | "categories";
}

export function PhasePlaceholder({ title, description, nextVersion, icon }: PhasePlaceholderProps) {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/12 blur-3xl" />
      <div className="relative max-w-2xl">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Icon name={icon} className="size-6" />
        </span>
        <span className="mt-6 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Dự kiến {nextVersion}
        </span>
        <h2 className="mt-4 text-2xl font-bold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6 rounded-2xl border border-income/20 bg-income/8 p-4">
          <div className="flex items-start gap-3">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-income" />
            <p className="text-sm leading-6 text-foreground/90">
              Tài khoản, workspace và phân quyền đã hoạt động. Màn hình này hiện được bảo vệ và chỉ hiển thị sau khi đăng nhập.
            </p>
          </div>
        </div>
        <Link href="/" className="secondary-button mt-6">
          Về Dashboard
        </Link>
      </div>
    </Card>
  );
}
