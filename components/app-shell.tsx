"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CategoriesView } from "@/components/categories/categories-view";
import { ChartIcon, HomeIcon, MoonIcon, PlusIcon, ReceiptIcon, SettingsIcon, SunIcon, WalletIcon } from "@/components/icons";
import { Toast } from "@/components/ui/modal";
import { OnboardingWallet, WalletsView } from "@/components/wallets/wallets-view";
import {
  defaultSettings,
  loadCategories,
  loadSettings,
  loadWallets,
  type DataMode,
} from "@/features/data/repository";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { startCloudSession } from "@/lib/firebase/session";
import type { Category } from "@/types/category";
import type { WorkspaceSettings } from "@/types/settings";
import type { Wallet } from "@/types/wallet";

type View = "dashboard" | "wallets" | "categories" | "transactions" | "reports" | "settings";
type SyncState = "connecting" | "cloud" | "local";
type ToastState = { message: string; tone: "success" | "danger" | "warning" } | null;

const nav = [
  { id: "dashboard" as const, label: "Tổng quan", icon: HomeIcon },
  { id: "wallets" as const, label: "Ví", icon: WalletIcon },
  { id: "transactions" as const, label: "Giao dịch", icon: ReceiptIcon },
  { id: "reports" as const, label: "Báo cáo", icon: ChartIcon },
  { id: "settings" as const, label: "Cài đặt", icon: SettingsIcon },
];

function money(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function getLocalWorkspaceId() {
  const key = "tiendidau-local-workspace";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = `local-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, id);
  return id;
}

export function AppShell() {
  const [view, setView] = useState<View>("dashboard");
  const [workspaceId, setWorkspaceId] = useState("");
  const [syncState, setSyncState] = useState<SyncState>(isFirebaseConfigured ? "connecting" : "local");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<WorkspaceSettings>(() => defaultSettings());
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

  const dataMode: DataMode = syncState === "cloud" ? "cloud" : "local";

  useEffect(() => {
    const saved = window.localStorage.getItem("tiendidau-theme");
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    setWorkspaceId(getLocalWorkspaceId());
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let active = true;
    void startCloudSession()
      .then((session) => {
        if (!active) return;
        setWorkspaceId(session.workspaceId);
        setSyncState("cloud");
      })
      .catch((error: unknown) => {
        console.warn("Firebase unavailable; continuing in local mode.", error);
        if (!active) return;
        setSyncState("local");
      });
    return () => { active = false; };
  }, []);

  const refreshData = useCallback(async () => {
    if (!workspaceId || syncState === "connecting") return;
    setDataLoading(true);
    try {
      const [nextWallets, nextCategories, nextSettings] = await Promise.all([
        loadWallets(dataMode, workspaceId),
        loadCategories(dataMode, workspaceId),
        loadSettings(dataMode, workspaceId),
      ]);
      setWallets(nextWallets);
      setCategories(nextCategories);
      setSettings(nextSettings);
    } catch (error) {
      console.warn("Unable to load workspace data.", error);
      notify("Không thể tải dữ liệu. Hãy thử lại hoặc kiểm tra kết nối.", "danger");
    } finally {
      setDataLoading(false);
    }
  }, [dataMode, syncState, workspaceId]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const title = useMemo(() => {
    if (view === "categories") return "Danh mục";
    return nav.find((item) => item.id === view)?.label ?? "Tiền Đi Đâu";
  }, [view]);

  const activeWallets = wallets.filter((item) => item.status === "active" && !item.isDeleted);
  const hasWallet = activeWallets.length > 0;

  function notify(message: string, tone: "success" | "danger" | "warning" = "success") {
    setToast({ message, tone });
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("tiendidau-theme", next);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <Brand />
        <nav className="side-nav">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-btn ${view === id || (id === "wallets" && view === "categories") ? "active" : ""}`} onClick={() => setView(id)}>
              <Icon />
              {label}
            </button>
          ))}
        </nav>
        <div className="side-note">
          V1.1.0 • Wallets & Categories<br />
          {syncState === "cloud" ? "Firebase đang đồng bộ." : syncState === "connecting" ? "Đang kết nối Firebase…" : "Local Mode đang hoạt động."}
        </div>
      </aside>

      <div className="content-shell">
        <header className="header">
          <div className="header-inner">
            <div className="mobile-brand"><Brand compact /></div>
            <div className="desktop-title">
              <p className="eyebrow">Tiền Đi Đâu</p>
              <h1 className="page-title">{title}</h1>
            </div>
            <div className="header-actions">
              <SyncPill state={syncState} />
              <button className="icon-btn" aria-label="Đổi giao diện" onClick={toggleTheme}>
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </header>

        <main className="main">
          {view === "dashboard" && !dataLoading && !hasWallet && workspaceId && syncState !== "connecting" ? (
            <OnboardingWallet workspaceId={workspaceId} mode={dataMode} settings={settings} onNotify={notify} onSaved={async () => { await refreshData(); setView("dashboard"); }} />
          ) : view === "dashboard" ? (
            <Dashboard wallets={wallets} syncState={syncState} loading={dataLoading} onGoWallets={() => setView("wallets")} onGoCategories={() => setView("categories")} />
          ) : view === "wallets" ? (
            <WalletsView wallets={wallets} settings={settings} workspaceId={workspaceId} mode={dataMode} loading={dataLoading} onRefresh={refreshData} onOpenCategories={() => setView("categories")} onNotify={notify} />
          ) : view === "categories" ? (
            <CategoriesView categories={categories} workspaceId={workspaceId} mode={dataMode} loading={dataLoading} onRefresh={refreshData} onBack={() => setView("wallets")} onNotify={notify} />
          ) : view === "transactions" ? (
            <EmptySection title="Giao dịch" description={hasWallet ? "Ví và danh mục đã sẵn sàng. Thu, Chi và Chuyển tiền sẽ được triển khai ở V1.2.0." : "Hãy tạo ví trước khi nhập giao dịch."} icon="🧾" action={!hasWallet ? { label: "Tạo ví", onClick: () => setView("wallets") } : undefined} />
          ) : view === "reports" ? (
            <EmptySection title="Báo cáo" description="Báo cáo sẽ sử dụng dữ liệu giao dịch thật từ các phiên bản tiếp theo." icon="📊" />
          ) : (
            <Settings workspaceId={workspaceId} syncState={syncState} settings={settings} wallets={wallets} categories={categories} onOpenCategories={() => setView("categories")} />
          )}
        </main>
      </div>

      <button className="fab" aria-label={hasWallet ? "Thêm giao dịch" : "Thêm ví"} onClick={() => setView(hasWallet ? "transactions" : "wallets")}>
        <PlusIcon />
      </button>

      <nav className="bottom-nav">
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`bottom-btn ${view === id || (id === "wallets" && view === "categories") ? "active" : ""}`} onClick={() => setView(id)}>
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {toast && <Toast message={toast.message} tone={toast.tone} />}
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "compact" : ""}`}>
      <div className="brand-mark">₫</div>
      <div>
        <div className="brand-name">Tiền Đi Đâu</div>
        {!compact && <div className="brand-sub">Ghi thu chi thật gọn</div>}
      </div>
    </div>
  );
}

function Dashboard({ wallets, syncState, loading, onGoWallets, onGoCategories }: {
  wallets: Wallet[];
  syncState: SyncState;
  loading: boolean;
  onGoWallets: () => void;
  onGoCategories: () => void;
}) {
  const activeWallets = wallets.filter((item) => item.status === "active");
  const total = activeWallets.reduce((sum, item) => sum + item.currentBalance, 0);
  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="hero-label">Tháng này</p>
          <h2>Tổng quan tài chính</h2>
          <p className="hero-text">{activeWallets.length ? `${activeWallets.length} ví đang sử dụng.` : "Bắt đầu bằng việc tạo ví đầu tiên."}</p>
        </div>
        <div className="version-pill">V1.1.0</div>
      </section>

      <section className="metrics">
        <Metric title="Tổng tài sản" value={total} accent="info" />
        <Metric title="Thu nhập" value={0} accent="success" />
        <Metric title="Chi tiêu" value={0} accent="danger" />
        <Metric title="Còn lại" value={0} accent="primary" />
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-head">
            <div><p className="card-title">Ví đang sử dụng</p><p className="card-sub">Số dư nền để chuẩn bị nhập giao dịch</p></div>
            <SyncPill state={syncState} />
          </div>
          {loading ? <p className="card-sub top-gap">Đang tải…</p> : activeWallets.length === 0 ? (
            <div className="empty-box"><strong>Chưa có ví</strong><p>Tạo ví để bắt đầu.</p></div>
          ) : (
            <div className="dashboard-wallets">
              {activeWallets.slice(0, 4).map((wallet) => (
                <div key={wallet.id} className="dashboard-wallet-row">
                  <span className="dashboard-wallet-icon" style={{ background: `${wallet.color}22` }}>{wallet.icon}</span>
                  <div><b>{wallet.name}</b><small>{wallet.isDefault ? "Ví mặc định" : "Đang sử dụng"}</small></div>
                  <strong>{money(wallet.currentBalance)}</strong>
                </div>
              ))}
              <button className="text-btn top-gap-small" type="button" onClick={onGoWallets}>Quản lý tất cả ví →</button>
            </div>
          )}
        </article>

        <article className="card">
          <p className="card-title">Sẵn sàng cho giao dịch</p>
          <div className="quick-list">
            <QuickStep number="1" title="Ví" description={activeWallets.length ? `${activeWallets.length} ví đã sẵn sàng` : "Tạo ví đầu tiên"} onClick={onGoWallets} />
            <QuickStep number="2" title="Danh mục" description="Thu/Chi mặc định + tùy chỉnh" onClick={onGoCategories} />
            <QuickStep number="3" title="Giao dịch" description="Sẽ mở ở V1.2.0" />
          </div>
        </article>
      </section>

      <section className="card">
        <div className="card-head"><div><p className="card-title">Giao dịch gần đây</p><p className="card-sub">Chưa có giao dịch nào</p></div><ReceiptIcon /></div>
        <div className="empty-box"><strong>Nền dữ liệu đã sẵn sàng</strong><p>V1.1.0 tập trung hoàn thiện ví, danh mục và onboarding. Thu/Chi sẽ được thêm đúng roadmap ở V1.2.0.</p></div>
      </section>
    </div>
  );
}

function SyncPill({ state }: { state: SyncState }) {
  const label = state === "cloud" ? "Firebase" : state === "connecting" ? "Đang kết nối" : "Local";
  return <span className="status-pill"><span className={`dot ${state}`} />{label}</span>;
}

function Metric({ title, value, accent }: { title: string; value: number; accent: "info" | "success" | "danger" | "primary" }) {
  return <article className="card"><div className={`metric-bar ${accent}`} /><p className="metric-label">{title}</p><p className="metric-value">{money(value)}</p></article>;
}

function QuickStep({ number, title, description, onClick }: { number: string; title: string; description: string; onClick?: () => void }) {
  const content = <><div className="quick-num">{number}</div><div><p className="quick-title">{title}</p><p className="quick-desc">{description}</p></div></>;
  if (onClick) return <button type="button" className="quick-item quick-button" onClick={onClick}>{content}</button>;
  return <div className="quick-item">{content}</div>;
}

function EmptySection({ title, description, icon, action }: { title: string; description: string; icon: string; action?: { label: string; onClick: () => void } }) {
  return <section className="empty-page"><div><div className="empty-icon">{icon}</div><h2>{title}</h2><p>{description}</p>{action && <button className="btn primary top-gap" type="button" onClick={action.onClick}>{action.label}</button>}</div></section>;
}

function Settings({ workspaceId, syncState, settings, wallets, categories, onOpenCategories }: {
  workspaceId: string;
  syncState: SyncState;
  settings: WorkspaceSettings;
  wallets: Wallet[];
  categories: Category[];
  onOpenCategories: () => void;
}) {
  const defaultWallet = wallets.find((item) => item.id === settings.defaultWalletId);
  return (
    <div className="stack">
      <section className="card">
        <h2 className="page-title">Cài đặt</h2>
        <p className="card-sub">Cấu hình nền của workspace hiện tại.</p>
        <div className="settings-list">
          <SettingRow label="Tiền tệ" value="VND" />
          <SettingRow label="Truy cập" value="Trực tiếp" />
          <SettingRow label="Dữ liệu" value={syncState === "cloud" ? "Firebase" : syncState === "connecting" ? "Đang kết nối" : "Local"} />
          <SettingRow label="Ví mặc định" value={defaultWallet?.name ?? "Chưa có"} />
          <SettingRow label="Danh mục" value={`${categories.filter((item) => item.status === "active").length} đang dùng`} />
          <SettingRow label="Workspace" value={workspaceId ? "Đã sẵn sàng" : "Đang tạo"} />
        </div>
      </section>
      <section className="card">
        <div className="card-head"><div><p className="card-title">Danh mục Thu & Chi</p><p className="card-sub">Thêm, sửa hoặc ẩn danh mục trước khi nhập giao dịch.</p></div><button className="btn secondary" type="button" onClick={onOpenCategories}>Quản lý</button></div>
      </section>
      <section className="card notice">Nếu mạng mất khi đang nhập form ví/danh mục, bản nháp vẫn được giữ trên thiết bị. Firebase là nguồn đồng bộ chính khi kết nối sẵn sàng.</section>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="setting-row"><span>{label}</span><span>{value}</span></div>;
}
