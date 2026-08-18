"use client";

import { useEffect, useMemo, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  saveWallet,
  setDefaultWallet,
  setWalletVisibility,
  type DataMode,
} from "@/features/data/repository";
import type { WorkspaceSettings } from "@/types/settings";
import type { Wallet, WalletInput, WalletType } from "@/types/wallet";

const walletTypes: { value: WalletType; label: string }[] = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank", label: "Tài khoản ngân hàng" },
  { value: "e_wallet", label: "Ví điện tử" },
  { value: "credit_card", label: "Thẻ tín dụng" },
  { value: "other", label: "Khác" },
];

const icons = ["💵", "🏦", "💳", "📱", "👛", "💰", "🪙", "🧾"];
const colors = ["#7c3aed", "#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#f97316", "#ec4899", "#64748b"];

function money(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
}

function typeLabel(type: WalletType) {
  return walletTypes.find((item) => item.value === type)?.label ?? type;
}

export function WalletsView({
  wallets,
  settings,
  workspaceId,
  mode,
  loading,
  onRefresh,
  onOpenCategories,
  onNotify,
}: {
  wallets: Wallet[];
  settings: WorkspaceSettings;
  workspaceId: string;
  mode: DataMode;
  loading: boolean;
  onRefresh: () => Promise<void>;
  onOpenCategories: () => void;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const [editing, setEditing] = useState<Wallet | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [switching, setSwitching] = useState<Wallet | null>(null);
  const activeWallets = wallets.filter((item) => item.status === "active");
  const visibleBalance = activeWallets.reduce((sum, item) => sum + item.currentBalance, 0);

  async function handleVisibility(wallet: Wallet) {
    try {
      if (wallet.status === "hidden") {
        await setWalletVisibility(mode, workspaceId, wallet.id, "active");
        onNotify("Đã hiển thị lại ví.");
        await onRefresh();
        return;
      }

      if (wallet.isDefault) {
        const alternatives = activeWallets.filter((item) => item.id !== wallet.id);
        if (alternatives.length === 0) {
          onNotify("Cần ít nhất một ví đang sử dụng. Hãy tạo ví khác trước khi ẩn ví mặc định.", "warning");
          return;
        }
        setSwitching(wallet);
        return;
      }

      await setWalletVisibility(mode, workspaceId, wallet.id, "hidden");
      onNotify("Đã ẩn ví.");
      await onRefresh();
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Không thể cập nhật ví.", "danger");
    }
  }

  async function handleDefault(walletId: string) {
    try {
      await setDefaultWallet(mode, workspaceId, walletId);
      onNotify("Đã đổi ví mặc định.");
      await onRefresh();
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Không thể đổi ví mặc định.", "danger");
    }
  }

  return (
    <div className="stack">
      <section className="wallet-summary">
        <div>
          <p className="eyebrow">Ví của tôi</p>
          <h2>{money(visibleBalance)}</h2>
          <p>{activeWallets.length} ví đang sử dụng • {wallets.length - activeWallets.length} ví đang ẩn</p>
        </div>
        <div className="action-row">
          <button className="btn secondary" type="button" onClick={onOpenCategories}>Danh mục</button>
          <button className="btn primary" type="button" disabled={loading || !workspaceId} onClick={() => { setEditing(null); setFormOpen(true); }}>+ Thêm ví</button>
        </div>
      </section>

      {loading ? (
        <section className="card"><p className="card-sub">Đang tải dữ liệu ví…</p></section>
      ) : wallets.length === 0 ? (
        <section className="empty-box">
          <strong>Chưa có ví nào</strong>
          <p>Tạo ví đầu tiên để bắt đầu ghi nhận thu chi.</p>
          <button className="btn primary top-gap" type="button" disabled={loading || !workspaceId} onClick={() => setFormOpen(true)}>Tạo ví đầu tiên</button>
        </section>
      ) : (
        <section className="wallet-list">
          {wallets.map((wallet) => (
            <article key={wallet.id} className={`wallet-card ${wallet.status === "hidden" ? "muted-card" : ""}`}>
              <div className="wallet-main">
                <div className="wallet-icon" style={{ background: `${wallet.color}22`, color: wallet.color }}>{wallet.icon}</div>
                <div className="wallet-copy">
                  <div className="wallet-title-row">
                    <h3>{wallet.name}</h3>
                    {wallet.isDefault && <span className="mini-badge">Mặc định</span>}
                    {wallet.status === "hidden" && <span className="mini-badge neutral">Đang ẩn</span>}
                  </div>
                  <p>{typeLabel(wallet.type)}</p>
                </div>
                <div className="wallet-amount">{money(wallet.currentBalance)}</div>
              </div>
              <div className="wallet-actions">
                {wallet.status === "active" && !wallet.isDefault && (
                  <button className="text-btn" type="button" onClick={() => void handleDefault(wallet.id)}>Đặt mặc định</button>
                )}
                <button className="text-btn" type="button" onClick={() => { setEditing(wallet); setFormOpen(true); }}>Sửa</button>
                <button className="text-btn" type="button" onClick={() => void handleVisibility(wallet)}>{wallet.status === "active" ? "Ẩn" : "Hiện"}</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {formOpen && (
        <WalletForm
          wallet={editing}
          workspaceId={workspaceId}
          mode={mode}
          settings={settings}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={async () => {
            setFormOpen(false);
            setEditing(null);
            onNotify(editing ? "Đã cập nhật ví." : "Đã tạo ví.");
            await onRefresh();
          }}
          onNotify={onNotify}
        />
      )}

      {switching && (
        <DefaultSwitchModal
          wallet={switching}
          alternatives={activeWallets.filter((item) => item.id !== switching.id)}
          onClose={() => setSwitching(null)}
          onConfirm={async (replacementId) => {
            try {
              await setWalletVisibility(mode, workspaceId, switching.id, "hidden", replacementId);
              setSwitching(null);
              onNotify("Đã ẩn ví và chuyển ví mặc định.");
              await onRefresh();
            } catch (error) {
              onNotify(error instanceof Error ? error.message : "Không thể ẩn ví.", "danger");
            }
          }}
        />
      )}
    </div>
  );
}

export function WalletForm({
  wallet,
  workspaceId,
  mode,
  settings,
  onboarding = false,
  onClose,
  onSaved,
  onNotify,
}: {
  wallet?: Wallet | null;
  workspaceId: string;
  mode: DataMode;
  settings: WorkspaceSettings;
  onboarding?: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const draftKey = `tiendidau:wallet-draft:${wallet?.id ?? "new"}`;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [name, setName] = useState(wallet?.name ?? "");
  const [type, setType] = useState<WalletType>(wallet?.type ?? "cash");
  const [icon, setIcon] = useState(wallet?.icon ?? "💵");
  const [color, setColor] = useState(wallet?.color ?? colors[0]);
  const [balanceText, setBalanceText] = useState(wallet ? String(wallet.initialBalance) : "0");
  const [startDate, setStartDate] = useState(wallet?.startDate ?? today);
  const [makeDefault, setMakeDefault] = useState(wallet?.isDefault ?? !settings.defaultWalletId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (wallet) return;
    const saved = window.localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as Partial<WalletInput> & { balanceText?: string };
      setName(draft.name ?? "");
      setType(draft.type ?? "cash");
      setIcon(draft.icon ?? "💵");
      setColor(draft.color ?? colors[0]);
      setBalanceText(draft.balanceText ?? "0");
      setStartDate(draft.startDate ?? today);
      setMakeDefault(draft.isDefault ?? !settings.defaultWalletId);
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [draftKey, settings.defaultWalletId, today, wallet]);

  useEffect(() => {
    if (wallet) return;
    window.localStorage.setItem(draftKey, JSON.stringify({ name, type, icon, color, balanceText, startDate, isDefault: makeDefault }));
  }, [balanceText, color, draftKey, icon, makeDefault, name, startDate, type, wallet]);

  const initialBalance = Number(balanceText.replace(/[^0-9-]/g, ""));
  const canSave = name.trim().length >= 1 && name.trim().length <= 50 && icon.trim().length >= 1 && icon.length <= 16 && Number.isSafeInteger(initialBalance) && startDate.length === 10;
  const balanceLocked = Boolean(wallet && wallet.transactionCount > 0);

  async function submit() {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await saveWallet(mode, workspaceId, {
        name: name.trim(),
        type,
        icon,
        color,
        initialBalance,
        startDate,
        isDefault: makeDefault,
      }, wallet ?? undefined);
      window.localStorage.removeItem(draftKey);
      await onSaved();
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Không thể lưu ví. Dữ liệu form vẫn được giữ.", "danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={onboarding ? "Tạo ví đầu tiên" : wallet ? "Sửa ví" : "Thêm ví mới"}
      description={onboarding ? "Chỉ cần một ví để bắt đầu. Bạn có thể thêm ví khác sau." : "Thông tin ví được lưu trong workspace hiện tại."}
      onClose={onClose}
    >
      <div className="form-grid">
        <label className="field full"><span>Tên ví</span><input autoFocus value={name} maxLength={50} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Tiền mặt" /></label>
        <label className="field"><span>Loại ví</span><select value={type} onChange={(e) => setType(e.target.value as WalletType)}>{walletTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="field"><span>Ngày bắt đầu</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
        <label className="field full"><span>Số dư ban đầu</span><div className="money-input"><input inputMode="numeric" disabled={balanceLocked} value={balanceText} onChange={(e) => setBalanceText(e.target.value)} /><b>₫</b></div>{balanceLocked && <small>Số dư ban đầu bị khóa vì ví đã có giao dịch.</small>}</label>
        <EmojiPicker value={icon} presets={icons} onChange={setIcon} label="Icon / Emoji" />
        <div className="field full"><span>Màu sắc</span><div className="choice-row">{colors.map((item) => <button key={item} type="button" className={`color-dot ${color === item ? "selected" : ""}`} style={{ background: item }} aria-label={item} onClick={() => setColor(item)} />)}</div></div>
        <label className="check-row full"><input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} /><span>Dùng làm ví mặc định</span></label>
      </div>
      <div className="modal-actions">
        {!onboarding && <button className="btn secondary" type="button" onClick={onClose}>Hủy</button>}
        <button className="btn primary grow" type="button" disabled={!canSave || saving} onClick={() => void submit()}>{saving ? "Đang lưu…" : wallet ? "Lưu thay đổi" : "Tạo ví"}</button>
      </div>
    </Modal>
  );
}

function DefaultSwitchModal({ wallet, alternatives, onClose, onConfirm }: {
  wallet: Wallet;
  alternatives: Wallet[];
  onClose: () => void;
  onConfirm: (walletId: string) => Promise<void>;
}) {
  const [selected, setSelected] = useState(alternatives[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  return (
    <Modal title="Chọn ví mặc định khác" description={`“${wallet.name}” đang là ví mặc định. Chọn ví thay thế trước khi ẩn.`} onClose={onClose}>
      <div className="radio-list">
        {alternatives.map((item) => (
          <label key={item.id} className={`radio-card ${selected === item.id ? "selected" : ""}`}>
            <input type="radio" name="defaultWallet" value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)} />
            <span>{item.icon}</span><b>{item.name}</b><em>{money(item.currentBalance)}</em>
          </label>
        ))}
      </div>
      <div className="modal-actions">
        <button className="btn secondary" type="button" onClick={onClose}>Hủy</button>
        <button className="btn primary grow" type="button" disabled={!selected || saving} onClick={async () => { setSaving(true); await onConfirm(selected); setSaving(false); }}>{saving ? "Đang xử lý…" : "Đổi mặc định & Ẩn"}</button>
      </div>
    </Modal>
  );
}

export function OnboardingWallet({ workspaceId, mode, settings, onSaved, onNotify }: {
  workspaceId: string;
  mode: DataMode;
  settings: WorkspaceSettings;
  onSaved: () => Promise<void>;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-visual">👛</div>
        <span className="mini-badge">Bước đầu tiên</span>
        <h2>Tạo ví đầu tiên</h2>
        <p>Ví là nơi lưu số dư và là nền tảng để nhập Thu, Chi và Chuyển tiền ngay trong V1.2.0.</p>
        <div className="onboarding-points">
          <span>✓ Không cần đăng nhập</span>
          <span>✓ Có thể tạo nhiều ví</span>
          <span>✓ Dữ liệu được lưu ngay</span>
        </div>
        <button className="btn primary onboarding-btn" type="button" onClick={() => setOpen(true)}>Tạo ví ngay</button>
      </div>
      {open && <WalletForm onboarding workspaceId={workspaceId} mode={mode} settings={settings} onClose={() => setOpen(false)} onNotify={onNotify} onSaved={async () => { setOpen(false); onNotify("Ví đầu tiên đã sẵn sàng."); await onSaved(); }} />}
    </section>
  );
}
