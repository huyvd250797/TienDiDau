"use client";

import Link from "next/link";

import { Avatar } from "@/components/auth/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

const emptySummary = [
  { label: "Tổng tài sản", value: "0 ₫", tone: "balance", note: "Chưa có ví" },
  { label: "Thu nhập", value: "0 ₫", tone: "income", note: "Tháng hiện tại" },
  { label: "Chi tiêu", value: "0 ₫", tone: "expense", note: "Tháng hiện tại" },
  { label: "Số dư", value: "0 ₫", tone: "primary", note: "Thu trừ Chi" }
] as const;

export function AuthBootstrapDashboard() {
  const { bootstrap } = useAuth();
  if (!bootstrap) return null;

  const { user, workspace, categories, isFirstLogin } = bootstrap;

  return (
    <div className="space-y-5 sm:space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Xin chào,</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {user.displayName} 👋
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {isFirstLogin
              ? "Tài khoản đã được khởi tạo thành công. Bước tiếp theo là tạo chiếc ví đầu tiên."
              : "Tài khoản và dữ liệu nền tảng đã được đồng bộ an toàn."}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-income/25 bg-income/10 px-3 py-2 text-xs font-semibold text-income">
          <span className="size-2 rounded-full bg-income" />
          Đã đăng nhập và đồng bộ
        </span>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {emptySummary.map((item) => (
          <Card key={item.label} className={`summary-card summary-${item.tone}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">{item.label}</p>
              <span className="size-2 rounded-full bg-current opacity-80" />
            </div>
            <p className="mt-3 text-base font-bold tracking-tight sm:text-xl">{item.value}</p>
            <p className="mt-2 text-[11px] text-muted-foreground sm:text-xs">{item.note}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Card className="relative overflow-hidden border-primary/20 bg-linear-to-br from-primary/16 via-card to-card p-6 sm:p-7">
          <div className="absolute -right-16 -top-16 size-52 rounded-full bg-primary/18 blur-3xl" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Bước tiếp theo
            </span>
            <h3 className="mt-5 text-2xl font-bold tracking-tight">Tạo ví đầu tiên của bạn</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Ví sẽ là nơi lưu số dư tiền mặt, tài khoản ngân hàng, ví điện tử hoặc thẻ tín dụng. Chức năng tạo ví được triển khai ở V1.2.0.
            </p>
            <Link href="/wallets" className="primary-button mt-6 w-full sm:w-auto">
              <Icon name="wallet" className="size-4" />
              Xem màn hình Ví
            </Link>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Avatar name={user.displayName} imageUrl={user.avatarUrl} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-foreground">{user.displayName}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-income/10 px-2.5 py-1 text-[11px] font-semibold text-income">
                Owner
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t border-border/70 pt-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Workspace</span>
              <strong className="max-w-[60%] truncate text-right">{workspace.name}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Tiền tệ</span>
              <strong>{workspace.baseCurrency}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Múi giờ</span>
              <strong>{user.timezone}</strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-income/12 text-income">
              <Icon name="check" className="size-5" />
            </span>
            <div>
              <h3 className="section-title">Tài khoản</h3>
              <p className="section-description">Google Login hoạt động</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-bold text-income">Sẵn sàng</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Phiên đăng nhập được ghi nhớ và tự khôi phục khi mở lại ứng dụng.
          </p>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Icon name="shield" className="size-5" />
            </span>
            <div>
              <h3 className="section-title">Phân quyền</h3>
              <p className="section-description">Workspace cá nhân</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-bold text-primary">Owner</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Dữ liệu chỉ được đọc bởi thành viên đang hoạt động trong workspace.
          </p>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-balance/12 text-balance">
              <Icon name="categories" className="size-5" />
            </span>
            <div>
              <h3 className="section-title">Danh mục mặc định</h3>
              <p className="section-description">Đã tạo trên Firestore</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-bold text-balance">{categories.total}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {categories.income} danh mục Thu · {categories.expense} danh mục Chi.
          </p>
        </Card>
      </section>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="section-title">Trạng thái V1.1.2 AuthBootstrap</h3>
            <p className="section-description">Các thành phần nền tảng tài khoản đã hoàn tất.</p>
          </div>
          <Link href="/settings" className="secondary-button w-full sm:w-auto">
            Xem hồ sơ
            <Icon name="chevron" className="size-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "Google Authentication",
            "User Profile",
            "Personal Workspace",
            "Settings & Categories"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/45 p-3.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-income/12 text-income">
                <Icon name="check" className="size-3.5" />
              </span>
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
