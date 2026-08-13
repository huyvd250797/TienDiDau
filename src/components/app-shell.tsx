"use client";

import { useEffect, useMemo, useState } from "react";

import { isFirebaseConfigured } from "@/lib/firebase/client";
import { startDirectSession } from "@/lib/firebase/bootstrap";
import { ChartIcon, HomeIcon, MoonIcon, PlusIcon, ReceiptIcon, SettingsIcon, SunIcon, WalletIcon } from "@/components/icons";

type View = "dashboard" | "wallets" | "transactions" | "reports" | "settings";
type BootState = "loading" | "ready" | "error";

const nav = [
  { id: "dashboard" as const, label: "Tổng quan", icon: HomeIcon },
  { id: "wallets" as const, label: "Ví", icon: WalletIcon },
  { id: "transactions" as const, label: "Giao dịch", icon: ReceiptIcon },
  { id: "reports" as const, label: "Báo cáo", icon: ChartIcon },
  { id: "settings" as const, label: "Cài đặt", icon: SettingsIcon },
];

function money(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

export function AppShell() {
  const [view, setView] = useState<View>("dashboard");
  const [boot, setBoot] = useState<BootState>("loading");
  const [workspaceId, setWorkspaceId] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("tiendidau-theme");
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    let active = true;

    async function bootApp() {
      if (!isFirebaseConfigured) {
        setError("Thiếu cấu hình Firebase trên Netlify.");
        setBoot("error");
        return;
      }
      try {
        const session = await startDirectSession();
        if (!active) return;
        setWorkspaceId(session.workspaceId);
        setBoot("ready");
      } catch (cause) {
        if (!active) return;
        const message = cause instanceof Error ? cause.message : "Không thể khởi tạo dữ liệu.";
        setError(message);
        setBoot("error");
      }
    }

    void bootApp();
    return () => { active = false; };
  }, []);

  const title = useMemo(() => nav.find((item) => item.id === view)?.label ?? "Tiền Đi Đâu", [view]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("tiendidau-theme", next);
  }

  if (boot === "loading") {
    return (
      <main className="grid min-h-dvh place-items-center bg-[var(--bg)] p-6 text-[var(--text)]">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--primary)] text-2xl font-black text-white shadow-[0_18px_50px_rgba(124,58,237,.28)]">₫</div>
          <h1 className="text-xl font-bold">Tiền Đi Đâu</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Đang chuẩn bị sổ thu chi…</p>
          <div className="mx-auto mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-[var(--panel-2)]"><div className="h-full w-1/2 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-[var(--primary)]" /></div>
        </div>
      </main>
    );
  }

  if (boot === "error") {
    return (
      <main className="grid min-h-dvh place-items-center bg-[var(--bg)] p-6 text-[var(--text)]">
        <section className="w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-500/15 text-xl">!</div>
          <h1 className="text-xl font-bold">Chưa thể mở ứng dụng</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{error}</p>
          <button className="mt-5 w-full rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white" onClick={() => window.location.reload()}>Thử lại</button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--border)] bg-[var(--panel)] p-5 lg:block">
        <Brand />
        <nav className="mt-8 space-y-1">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${view === id ? "bg-[var(--primary-soft)] text-[var(--primary-light)]" : "text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]"}`}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4 text-xs leading-5 text-[var(--muted)]">
          Không cần đăng nhập.<br/>Dữ liệu được tách theo thiết bị/trình duyệt.
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color:var(--bg-header)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden"><Brand compact /></div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--muted)]">Tiền Đi Đâu</p>
              <h1 className="text-lg font-bold">{title}</h1>
            </div>
            <button aria-label="Đổi giao diện" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] transition hover:text-[var(--text)]">
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
          {view === "dashboard" && <Dashboard />}
          {view === "wallets" && <EmptySection title="Ví của tôi" description="Bước tiếp theo sẽ thêm CRUD ví thật, số dư ban đầu và ví mặc định." icon="👛" />}
          {view === "transactions" && <EmptySection title="Giao dịch" description="Sau khi có ví, đây sẽ là nơi nhập Thu, Chi và Chuyển tiền." icon="🧾" />}
          {view === "reports" && <EmptySection title="Báo cáo" description="Biểu đồ và thống kê sẽ chỉ tải dữ liệu cần thiết theo tháng." icon="📊" />}
          {view === "settings" && <Settings workspaceId={workspaceId} />}
        </main>
      </div>

      <button className="fixed bottom-[4.15rem] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[var(--primary)] text-white shadow-[0_16px_44px_rgba(124,58,237,.45)] lg:bottom-8 lg:right-8" aria-label="Thêm giao dịch" onClick={() => setView("transactions")}>
        <PlusIcon className="h-7 w-7" />
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t border-[var(--border)] bg-[color:var(--nav-bg)] px-1 backdrop-blur-xl lg:hidden">
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setView(id)} className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${view === id ? "text-[var(--primary-light)]" : "text-[var(--muted)]"}`}>
            <Icon className="h-5 w-5" />
            <span>{label === "Giao dịch" ? "Giao dịch" : label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-2xl"} grid place-items-center bg-[var(--primary)] font-black text-white`}>₫</div>
      <div>
        <div className={`${compact ? "text-sm" : "text-base"} font-extrabold leading-none`}>Tiền Đi Đâu</div>
        {!compact && <div className="mt-1 text-[11px] text-[var(--muted)]">Ghi thu chi thật gọn</div>}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm text-[var(--muted)]">Tháng này</p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Tổng quan tài chính</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Bắt đầu bằng việc tạo ví đầu tiên.</p>
          </div>
          <span className="hidden rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-xs text-[var(--muted)] sm:block">V1.0 Lite</span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Tổng tài sản" value={0} accent="blue" />
        <Metric title="Thu nhập" value={0} accent="green" />
        <Metric title="Chi tiêu" value={0} accent="red" />
        <Metric title="Còn lại" value={0} accent="purple" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Dòng tiền tháng</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Sẽ hiển thị khi có giao dịch</p>
            </div>
            <span className="rounded-full bg-[var(--panel-2)] px-3 py-1 text-xs text-[var(--muted)]">0 giao dịch</span>
          </div>
          <div className="mt-7 flex h-40 items-end gap-2">
            {[28, 42, 34, 55, 48, 68, 52, 74, 60, 46, 66, 38].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-lg bg-[var(--chart-bar)]" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-[var(--muted)]"><span>01</span><span>08</span><span>15</span><span>22</span><span>30</span></div>
        </article>

        <article className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <p className="text-sm font-semibold">Bắt đầu nhanh</p>
          <div className="mt-4 grid gap-3">
            <QuickStep number="1" title="Tạo ví" description="Tiền mặt, ngân hàng hoặc ví điện tử" />
            <QuickStep number="2" title="Nhập giao dịch" description="Thu và chi trong vài chạm" />
            <QuickStep number="3" title="Xem báo cáo" description="Theo dõi tiền đang đi đâu" />
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Giao dịch gần đây</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Chưa có giao dịch nào</p>
          </div>
          <ReceiptIcon className="h-5 w-5 text-[var(--muted)]" />
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--panel-2)] p-7 text-center">
          <p className="text-sm font-semibold">Sổ đang trống</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--muted)]">Phiên bản nền tảng chỉ khởi tạo dữ liệu tối thiểu. CRUD ví và danh mục sẽ là bước tiếp theo.</p>
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, accent }: { title: string; value: number; accent: "blue" | "green" | "red" | "purple" }) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5">
      <div className={`mb-4 h-1.5 w-10 rounded-full metric-${accent}`} />
      <p className="text-xs font-medium text-[var(--muted)]">{title}</p>
      <p className="mt-2 text-xl font-extrabold tracking-tight">{money(value)}</p>
    </article>
  );
}

function QuickStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[var(--panel-2)] p-3.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary-light)]">{number}</div>
      <div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">{description}</p></div>
    </div>
  );
}

function EmptySection({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <section className="grid min-h-[60vh] place-items-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-[var(--border)] bg-[var(--panel)] text-2xl">{icon}</div>
        <h2 className="mt-5 text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

function Settings({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
        <h2 className="text-lg font-bold">Cài đặt</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Bản Lite không yêu cầu Google Login.</p>
        <div className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4">
          <SettingRow label="Tiền tệ" value="VND" />
          <SettingRow label="Chế độ truy cập" value="Trực tiếp" />
          <SettingRow label="Lưu dữ liệu" value="Cloud Firestore" />
          <SettingRow label="Workspace" value={workspaceId ? "Đã sẵn sàng" : "—"} />
        </div>
      </section>
      <section className="rounded-3xl border border-amber-400/20 bg-amber-400/8 p-5 text-sm leading-6 text-[var(--muted)]">
        Trước khi có Backup/Restore hoặc liên kết tài khoản, không nên xóa dữ liệu website của trình duyệt vì Anonymous Auth đang dùng phiên cục bộ để nhận diện workspace.
      </section>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 py-4"><span className="text-sm text-[var(--muted)]">{label}</span><span className="text-sm font-semibold">{value}</span></div>;
}
