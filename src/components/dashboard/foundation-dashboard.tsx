import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

const summaryCards = [
  { label: "Tổng tài sản", value: "16.500.000 ₫", tone: "balance", note: "+8,4% tháng này" },
  { label: "Thu nhập", value: "35.000.000 ₫", tone: "income", note: "03 nguồn thu" },
  { label: "Chi tiêu", value: "18.500.000 ₫", tone: "expense", note: "27 giao dịch" },
  { label: "Số dư", value: "16.500.000 ₫", tone: "primary", note: "47,1% thu nhập" }
] as const;

const recentTransactions = [
  { title: "Ăn sáng", meta: "Tiền mặt · Ăn uống", amount: "-35.000 ₫", tone: "expense" },
  { title: "Lương tháng 8", meta: "VPBank · Lương", amount: "+30.000.000 ₫", tone: "income" },
  { title: "Chuyển tiền", meta: "VPBank → MoMo", amount: "-2.000.000 ₫", tone: "transfer" },
  { title: "Điện tháng 7", meta: "VPBank · Hóa đơn", amount: "-350.000 ₫", tone: "expense" },
  { title: "Cafe", meta: "Tiền mặt · Ăn uống", amount: "-50.000 ₫", tone: "expense" }
] as const;

const dailyBars = [32, 56, 42, 76, 48, 68, 90, 55, 72, 45, 82, 64, 96, 61, 70, 88, 53, 79];

export function FoundationDashboard() {
  return (
    <div className="space-y-5 sm:space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Xin chào,</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Anh Tuấn 👋</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Đây là giao diện nền tảng để kiểm tra design system và responsive trước khi phát triển nghiệp vụ.
          </p>
        </div>
        <button className="secondary-button w-full sm:w-auto" type="button">
          Tháng 08/2026
          <Icon name="chevron" className="size-4 rotate-90" />
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {summaryCards.map((item) => (
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

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <Card className="overflow-hidden p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="section-title">Thu & Chi theo ngày</h3>
              <p className="section-description">Dữ liệu mẫu tháng 08/2026</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-income" />Thu</span>
              <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-expense" />Chi</span>
            </div>
          </div>

          <div className="mt-8 flex h-52 items-end gap-1.5 border-b border-border/80 pb-2 sm:gap-2">
            {dailyBars.map((height, index) => (
              <div key={`${height}-${index}`} className="flex h-full flex-1 items-end justify-center gap-[2px]">
                <span className="w-1/2 min-w-[3px] rounded-t-full bg-income/90" style={{ height: `${height}%` }} />
                <span
                  className="w-1/2 min-w-[3px] rounded-t-full bg-expense/90"
                  style={{ height: `${Math.max(18, height - 21 + ((index * 7) % 18))}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground sm:text-xs">
            <span>01</span><span>05</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="section-title">Chi tiêu theo danh mục</h3>
              <p className="section-description">Tổng chi 18.500.000 ₫</p>
            </div>
            <button className="text-xs font-semibold text-primary" type="button">Chi tiết</button>
          </div>

          <div className="mt-7 grid items-center gap-7 sm:grid-cols-[170px_1fr] xl:grid-cols-1 2xl:grid-cols-[170px_1fr]">
            <div className="relative mx-auto size-40 rounded-full bg-[conic-gradient(var(--chart-1)_0_40%,var(--chart-2)_40%_60%,var(--chart-3)_60%_75%,var(--chart-4)_75%_90%,var(--chart-5)_90%_100%)]">
              <div className="absolute inset-7 grid place-items-center rounded-full bg-card text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Tổng chi</p>
                  <p className="mt-1 text-sm font-bold">18,5 triệu</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Ăn uống", "40%", "var(--chart-1)"],
                ["Mua sắm", "20%", "var(--chart-2)"],
                ["Xăng xe", "15%", "var(--chart-3)"],
                ["Nhà cửa", "15%", "var(--chart-4)"],
                ["Khác", "10%", "var(--chart-5)"]
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <i className="size-2.5 rounded-full" style={{ background: color }} />{label}
                  </span>
                  <strong className="font-semibold text-foreground">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="section-title">Giao dịch gần nhất</h3>
              <p className="section-description">5 giao dịch mới cập nhật</p>
            </div>
            <button type="button" className="text-xs font-semibold text-primary">Xem tất cả</button>
          </div>

          <div className="mt-5 divide-y divide-border/70">
            {recentTransactions.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                <span className={`transaction-icon transaction-${item.tone}`}>
                  <Icon name={item.tone === "transfer" ? "transactions" : "wallet"} className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.meta}</p>
                </div>
                <p className={`whitespace-nowrap text-sm font-bold amount-${item.tone}`}>{item.amount}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative overflow-hidden border-primary/20 bg-linear-to-br from-primary/16 via-card to-card p-6">
          <div className="absolute -right-12 -top-12 size-44 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Giai đoạn 1 hoàn tất
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight">Nền tảng sẵn sàng mở rộng</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Layout responsive, Dark/Light/System theme, design tokens, Firebase Client/Admin và bộ quy tắc khởi đầu đã được thiết lập.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/90">
              {[
                "Next.js App Router + TypeScript Strict",
                "Tailwind CSS 4 CSS-first",
                "Alias @/* và lint/format",
                "Responsive Desktop · Tablet · Mobile"
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-income/15 text-income">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
