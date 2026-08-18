"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CategoriesView } from "@/components/categories/categories-view";
import { ChartIcon, HomeIcon, MoonIcon, PlusIcon, ReceiptIcon, SettingsIcon, SunIcon, WalletIcon } from "@/components/icons";
import { TransactionQuickMenu, TransactionsView } from "@/components/transactions/transactions-view";
import { Toast } from "@/components/ui/modal";
import { OnboardingWallet, WalletsView } from "@/components/wallets/wallets-view";
import {
  defaultSettings,
  loadCategories,
  loadSettings,
  loadWallets,
  type DataMode,
} from "@/features/data/repository";
import { loadTransactions } from "@/features/transactions/repository";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { startCloudSession } from "@/lib/firebase/session";
import type { Category } from "@/types/category";
import type { WorkspaceSettings } from "@/types/settings";
import type { Transaction, TransactionType } from "@/types/transaction";
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<WorkspaceSettings>(() => defaultSettings());
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [quickTransactionType, setQuickTransactionType] = useState<TransactionType | null>(null);

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

  const notify = useCallback((message: string, tone: "success" | "danger" | "warning" = "success") => {
    setToast({ message, tone });
  }, []);

  const refreshData = useCallback(async () => {
    if (!workspaceId || syncState === "connecting") return;
    setDataLoading(true);
    try {
      const [nextWallets, nextCategories, nextSettings, nextTransactions] = await Promise.all([
        loadWallets(dataMode, workspaceId),
        loadCategories(dataMode, workspaceId),
        loadSettings(dataMode, workspaceId),
        loadTransactions(dataMode, workspaceId),
      ]);
      setWallets(nextWallets);
      setCategories(nextCategories);
      setSettings(nextSettings);
      setTransactions(nextTransactions);
    } catch (error) {
      console.warn("Unable to load workspace data.", error);
      notify("Không thể tải dữ liệu. Hãy thử lại hoặc kiểm tra kết nối.", "danger");
    } finally {
      setDataLoading(false);
    }
  }, [dataMode, notify, syncState, workspaceId]);

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

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("tiendidau-theme", next);
  }

  function openQuickTransaction(type: TransactionType) {
    setQuickMenuOpen(false);
    setQuickTransactionType(type);
    setView("transactions");
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
          V1.2.0 • Transactions Core<br />
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
            <Dashboard
              wallets={wallets}
              transactions={transactions}
              syncState={syncState}
              loading={dataLoading}
              onGoWallets={() => setView("wallets")}
              onGoCategories={() => setView("categories")}
              onGoTransactions={() => setView("transactions")}
            />
          ) : view === "wallets" ? (
            <WalletsView wallets={wallets} settings={settings} workspaceId={workspaceId} mode={dataMode} loading={dataLoading} onRefresh={refreshData} onOpenCategories={() => setView("categories")} onNotify={notify} />
          ) : view === "categories" ? (
            <CategoriesView categories={categories} workspaceId={workspaceId} mode={dataMode} loading={dataLoading} onRefresh={refreshData} onBack={() => setView("wallets")} onNotify={notify} />
          ) : view === "transactions" ? (
            <TransactionsView
              transactions={transactions}
              wallets={wallets}
              categories={categories}
              settings={settings}
              workspaceId={workspaceId}
              mode={dataMode}
              loading={dataLoading}
              requestedType={quickTransactionType}
              onRequestHandled={() => setQuickTransactionType(null)}
              onRefresh={refreshData}
              onGoWallets={() => setView("wallets")}
              onGoCategories={() => setView("categories")}
              onNotify={notify}
            />
          ) : view === "reports" ? (
            <EmptySection title="Báo cáo" description="Transactions Core đã có dữ liệu thật. Biểu đồ, Top danh mục và so sánh tháng sẽ được hoàn thiện ở V1.4.0." icon="📊" />
          ) : (
            <Settings workspaceId={workspaceId} syncState={syncState} settings={settings} wallets={wallets} categories={categories} transactions={transactions} onOpenCategories={() => setView("categories")} />
          )}
        </main>
      </div>

      <button
        className="fab"
        aria-label={hasWallet ? "Thêm giao dịch" : "Thêm ví"}
        onClick={() => hasWallet ? setQuickMenuOpen(true) : setView("wallets")}
      >
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

      {quickMenuOpen && <TransactionQuickMenu onClose={() => setQuickMenuOpen(false)} onSelect={openQuickTransaction} />}
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

function Dashboard({ wallets, transactions, syncState, loading, onGoWallets, onGoCategories, onGoTransactions }: {
  wallets: Wallet[];
  transactions: Transaction[];
  syncState: SyncState;
  loading: boolean;
  onGoWallets: () => void;
  onGoCategories: () => void;
  onGoTransactions: () => void;
}) {
  const activeWallets = wallets.filter((item) => item.status === "active");
  const total = activeWallets.reduce((sum, item) => sum + item.currentBalance, 0);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTransactions = transactions.filter((item) => item.dateKey.startsWith(monthKey));
  const income = monthTransactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = monthTransactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="hero-label">Tháng này</p>
          <h2>Tổng quan tài chính</h2>
          <p className="hero-text">{activeWallets.length ? `${activeWallets.length} ví • ${monthTransactions.length} giao dịch trong tháng.` : "Bắt đầu bằng việc tạo ví đầu tiên."}</p>
        </div>
        <div className="version-pill">V1.2.0</div>
      </section>

      <section className="metrics">
        <Metric title="Tổng tài sản" value={total} accent="info" />
        <Metric title="Thu nhập" value={income} accent="success" />
        <Metric title="Chi tiêu" value={expense} accent="danger" />
        <Metric title="Còn lại" value={income - expense} accent="primary" />
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-head">
            <div><p className="card-title">Ví đang sử dụng</p><p className="card-sub">Số dư đã phản ánh Thu, Chi và Chuyển tiền</p></div>
            <SyncPill state={syncState} />
          </div>
          {loading ? <p className="card-sub top-gap">Đang tải…</p> : activeWallets.length === 0 ? (
            <div className="empty-box"><strong>Chưa có ví</strong><p>Tạo ví để bắt đầu.</p></div>
          ) : (
            <div className="dashboard-wallets">
              {activeWallets.slice(0, 4).map((wallet) => (
                <div key={wallet.id} className="dashboard-wallet-row">
                  <span className="dashboard-wallet-icon" style={{ background: `${wallet.color}22` }}>{wallet.icon}</span>
                  <div><b>{wallet.name}</b><small>{wallet.isDefault ? "Ví mặc định" : `${wallet.transactionCount} giao dịch`}</small></div>
                  <strong>{money(wallet.currentBalance)}</strong>
                </div>
              ))}
              <button className="text-btn top-gap-small" type="button" onClick={onGoWallets}>Quản lý tất cả ví →</button>
            </div>
          )}
        </article>

        <article className="card">
          <p className="card-title">Transactions Core</p>
          <div className="quick-list">
            <QuickStep number="1" title="Ví" description={activeWallets.length ? `${activeWallets.length} ví đã sẵn sàng` : "Tạo ví đầu tiên"} onClick={onGoWallets} />
            <QuickStep number="2" title="Danh mục" description="Có thể dùng Emoji tùy chỉnh" onClick={onGoCategories} />
            <QuickStep number="3" title="Giao dịch" description={`${transactions.length} giao dịch • sửa/xóa an toàn`} onClick={onGoTransactions} />
          </div>
        </article>
      </section>

      <section className="card">
        <div className="card-head"><div><p className="card-title">Giao dịch gần đây</p><p className="card-sub">Tối đa 5 khoản mới nhất • lịch sử nâng cao ở V1.3.0</p></div><ReceiptIcon /></div>
        {transactions.length === 0 ? (
          <div className="empty-box"><strong>Chưa có giao dịch</strong><p>Nhấn nút + để ghi Thu, Chi hoặc Chuyển tiền.</p></div>
        ) : (
          <div className="mini-transaction-list">
            {transactions.slice(0, 5).map((item) => (
              <button key={item.id} type="button" className="mini-transaction-row" onClick={onGoTransactions}>
                <span>{item.type === "transfer" ? "↔️" : item.categoryIcon || "⭕"}</span>
                <div><b>{item.type === "transfer" ? "Chuyển tiền" : item.categoryName || "Giao dịch"}</b><small>{item.dateKey}</small></div>
                <strong className={item.type}>{item.type === "income" ? "+" : item.type === "expense" ? "−" : ""}{money(item.amount)}</strong>
              </button>
            ))}
          </div>
        )}
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

function Settings({ workspaceId, syncState, settings, wallets, categories, transactions, onOpenCategories }: {
  workspaceId: string;
  syncState: SyncState;
  settings: WorkspaceSettings;
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
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
          <SettingRow label="Giao dịch" value={`${transactions.length} khoản`} />
          <SettingRow label="Workspace" value={workspaceId ? "Đã sẵn sàng" : "Đang tạo"} />
        </div>
      </section>
      <section className="card">
        <div className="card-head"><div><p className="card-title">Danh mục Thu & Chi</p><p className="card-sub">Icon mặc định hoặc Emoji tùy chỉnh từ bàn phím điện thoại.</p></div><button className="btn secondary" type="button" onClick={onOpenCategories}>Quản lý</button></div>
      </section>
      <section className="card notice">Khi sửa hoặc xóa giao dịch, Balance Engine hoàn tác tác động cũ rồi áp dụng dữ liệu mới. Chuyển tiền không tính vào Thu/Chi và không làm đổi tổng tài sản.</section>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="setting-row"><span>{label}</span><span>{value}</span></div>;
}
