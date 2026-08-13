"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

const summary = [
  { label: "Tổng tài sản", value: "0 ₫", tone: "balance", note: "Chưa có ví" },
  { label: "Thu nhập", value: "0 ₫", tone: "income", note: "Tháng hiện tại" },
  { label: "Chi tiêu", value: "0 ₫", tone: "expense", note: "Tháng hiện tại" },
  { label: "Số dư", value: "0 ₫", tone: "primary", note: "Thu trừ Chi" }
] as const;

export function FinanceDashboard() {
  const { bootstrap } = useAuth();
  if (!bootstrap) return null;

  return (
    <div className="space-y-5 sm:space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Tháng hiện tại</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Tiền của bạn đang ở đâu?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            App đã sẵn sàng để dùng trực tiếp. Bước tiếp theo là tạo ví đầu tiên rồi bắt đầu ghi Thu và Chi.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-income/25 bg-income/10 px-3 py-2 text-xs font-semibold text-income">
          <span className="size-2 rounded-full bg-income" />
          Firebase đã kết nối
        </span>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {summary.map((item) => (
          <Card key={item.label} className={`summary-card summary-${item.tone}`}>
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">{item.label}</p>
            <p className="mt-3 text-base font-bold tracking-tight sm:text-xl">{item.value}</p>
            <p className="mt-2 text-[11px] text-muted-foreground sm:text-xs">{item.note}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Icon name="wallet" className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="section-title">Tạo ví đầu tiên</h3>
              <p className="section-description">
                Tiền mặt, tài khoản ngân hàng hoặc ví điện tử. Đây là dữ liệu nền để bắt đầu ghi giao dịch.
              </p>
            </div>
          </div>
          <Link href="/wallets" className="primary-button mt-6 w-full sm:w-auto">
            Đi tới Ví
            <Icon name="chevron" className="size-4" />
          </Link>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="section-title">Danh mục đã sẵn sàng</h3>
          <p className="section-description">Tạo tự động lần đầu, không cần thiết lập thủ công.</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-muted/55 p-4 text-center">
              <p className="text-2xl font-bold">{bootstrap.categories.total}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Tổng</p>
            </div>
            <div className="rounded-2xl bg-income/10 p-4 text-center">
              <p className="text-2xl font-bold text-income">{bootstrap.categories.income}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Thu</p>
            </div>
            <div className="rounded-2xl bg-expense/10 p-4 text-center">
              <p className="text-2xl font-bold text-expense">{bootstrap.categories.expense}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Chi</p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-balance/12 text-balance">
            <Icon name="shield" className="size-5" />
          </span>
          <div>
            <h3 className="section-title">Không cần đăng nhập</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Firebase tạo một định danh ẩn danh tự động để dữ liệu vẫn có quyền truy cập riêng. Sau này có thể liên kết Google mà không cần đổi cấu trúc dữ liệu.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
