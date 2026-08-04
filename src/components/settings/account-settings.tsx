"use client";

import { Avatar } from "@/components/auth/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

export function AccountSettings() {
  const { bootstrap } = useAuth();
  if (!bootstrap) return null;

  const { user, workspace, settings, categories } = bootstrap;

  return (
    <div className="space-y-5 sm:space-y-7">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tài khoản và cài đặt</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Thông tin đang được đọc từ hồ sơ đã bootstrap. Chỉnh sửa sẽ được mở ở V1.6.0.
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={user.displayName} imageUrl={user.avatarUrl} size="lg" />
            <h3 className="mt-4 text-xl font-bold">{user.displayName}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-income/10 px-3 py-1.5 text-xs font-semibold text-income">
              <Icon name="shield" className="size-3.5" />
              Owner · Google
            </span>
          </div>
          <div className="mt-6 border-t border-border/70 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">User ID</p>
            <p className="mt-2 break-all rounded-xl bg-muted/60 p-3 font-mono text-[11px] text-foreground/85">{user.id}</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Icon name="workspace" className="size-5" />
            </span>
            <div>
              <h3 className="section-title">Workspace cá nhân</h3>
              <p className="section-description">Phạm vi dữ liệu và phân quyền</p>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-border/70">
            {[
              ["Tên workspace", workspace.name],
              ["Vai trò", "Owner"],
              ["Trạng thái", "Đang hoạt động"],
              ["Tiền tệ cơ sở", workspace.baseCurrency],
              ["Schema version", String(workspace.schemaVersion)]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="max-w-[58%] truncate text-right text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="section-title">Định dạng mặc định</h3>
          <p className="section-description">Được tạo trong lần đăng nhập đầu tiên.</p>
          <dl className="mt-5 space-y-3">
            {[
              ["Giao diện", settings.theme === "dark" ? "Dark" : settings.theme],
              ["Ngôn ngữ", settings.locale],
              ["Múi giờ", settings.timezone],
              ["Ngày tháng", settings.dateFormat],
              ["Ngày đầu tuần", "Thứ Hai"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="section-title">Dữ liệu bootstrap</h3>
          <p className="section-description">Các tài liệu mặc định đã được tạo.</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-primary/10 p-4 text-center">
              <p className="text-2xl font-bold text-primary">1</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Workspace</p>
            </div>
            <div className="rounded-2xl bg-income/10 p-4 text-center">
              <p className="text-2xl font-bold text-income">{categories.income}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Danh mục Thu</p>
            </div>
            <div className="rounded-2xl bg-expense/10 p-4 text-center">
              <p className="text-2xl font-bold text-expense">{categories.expense}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Danh mục Chi</p>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-income/20 bg-income/8 p-4">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-income" />
            <p className="text-sm leading-6 text-foreground/90">
              API bootstrap có thể gọi lặp lại mà không tạo trùng user, workspace, member, settings hoặc danh mục.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
