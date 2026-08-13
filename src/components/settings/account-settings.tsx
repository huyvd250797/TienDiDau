"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

export function AccountSettings() {
  const { bootstrap } = useAuth();
  const { preference, setPreference } = useTheme();
  if (!bootstrap) return null;

  const shortId = `${bootstrap.user.id.slice(0, 8)}…${bootstrap.user.id.slice(-4)}`;

  return (
    <div className="space-y-5 sm:space-y-7">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tối giản cho nhu cầu ghi chép thu chi. Không yêu cầu tài khoản Google.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-income/12 text-income">
              <Icon name="shield" className="size-5" />
            </span>
            <div>
              <h3 className="section-title">Dữ liệu cá nhân</h3>
              <p className="section-description">Định danh Firebase tự động</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3">
            <div className="rounded-xl bg-muted/50 px-4 py-3">
              <dt className="text-xs text-muted-foreground">Chế độ</dt>
              <dd className="mt-1 text-sm font-semibold">
                {bootstrap.user.provider === "anonymous" ? "Dùng trực tiếp · Ẩn danh" : "Tài khoản đã liên kết"}
              </dd>
            </div>
            <div className="rounded-xl bg-muted/50 px-4 py-3">
              <dt className="text-xs text-muted-foreground">Mã dữ liệu</dt>
              <dd className="mt-1 font-mono text-xs font-semibold">{shortId}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Không xóa dữ liệu website trên trình duyệt trước khi Phase Backup/Restore hoàn thành, vì phiên ẩn danh có thể bị mất nếu dữ liệu trình duyệt bị xóa.
          </p>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="section-title">Giao diện</h3>
          <p className="section-description">Dark Mode vẫn là mặc định.</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {(["dark", "light", "system"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPreference(item)}
                className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition ${
                  preference === item ? "border-primary bg-primary/12 text-primary" : "border-border bg-muted/40"
                }`}
              >
                {item === "dark" ? "Dark" : item === "light" ? "Light" : "System"}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-5 sm:p-6">
        <h3 className="section-title">Dữ liệu nền</h3>
        <p className="section-description">
          Workspace cá nhân và {bootstrap.categories.total} danh mục mặc định đã sẵn sàng cho V1.2.0 Wallets & Categories.
        </p>
      </Card>
    </div>
  );
}
