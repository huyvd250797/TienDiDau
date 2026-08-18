"use client";

import { useEffect, useMemo, useState } from "react";

import { categoryIconGlyph } from "@/data/default-categories";
import { deleteTransaction, saveTransaction, transactionTypeLabel } from "@/features/transactions/repository";
import type { DataMode } from "@/features/data/repository";
import type { Category } from "@/types/category";
import type { WorkspaceSettings } from "@/types/settings";
import type { Transaction, TransactionInput, TransactionType } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";
import { Modal } from "@/components/ui/modal";

function money(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " ₫";
}

function displayDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function parseAmount(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  const parsed = Number(digits);
  return Number.isSafeInteger(parsed) ? parsed : Number.NaN;
}

function transactionIcon(item: Transaction) {
  if (item.type === "transfer") return "↔️";
  return item.categoryIcon || "⭕";
}

function transactionTitle(item: Transaction) {
  if (item.type === "transfer") return "Chuyển tiền";
  return item.categoryName || transactionTypeLabel(item.type);
}

function transactionSubtitle(item: Transaction) {
  if (item.type === "transfer") {
    return `${item.sourceWalletIcon ?? "👛"} ${item.sourceWalletName ?? "Ví nguồn"} → ${item.destinationWalletIcon ?? "👛"} ${item.destinationWalletName ?? "Ví đích"}`;
  }
  return `${item.walletIcon ?? "👛"} ${item.walletName ?? "Ví"}`;
}

export function TransactionQuickMenu({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (type: TransactionType) => void;
}) {
  return (
    <Modal title="Thêm giao dịch" description="Chọn loại giao dịch bạn muốn ghi nhanh." onClose={onClose}>
      <div className="transaction-quick-grid">
        <button className="transaction-quick income" type="button" onClick={() => onSelect("income")}>
          <span>＋</span><div><b>Thu nhập</b><small>Tiền vào ví</small></div>
        </button>
        <button className="transaction-quick expense" type="button" onClick={() => onSelect("expense")}>
          <span>−</span><div><b>Chi tiêu</b><small>Tiền ra khỏi ví</small></div>
        </button>
        <button className="transaction-quick transfer" type="button" onClick={() => onSelect("transfer")}>
          <span>↔</span><div><b>Chuyển tiền</b><small>Giữa hai ví</small></div>
        </button>
      </div>
    </Modal>
  );
}

export function TransactionsView({
  transactions,
  wallets,
  categories,
  settings,
  workspaceId,
  mode,
  loading,
  requestedType,
  onRequestHandled,
  onRefresh,
  onGoWallets,
  onGoCategories,
  onNotify,
}: {
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
  settings: WorkspaceSettings;
  workspaceId: string;
  mode: DataMode;
  loading: boolean;
  requestedType: TransactionType | null;
  onRequestHandled: () => void;
  onRefresh: () => Promise<void>;
  onGoWallets: () => void;
  onGoCategories: () => void;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const [tab, setTab] = useState<"all" | TransactionType>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const activeWallets = wallets.filter((item) => item.status === "active" && !item.isDeleted);
  const filtered = useMemo(() => tab === "all" ? transactions : transactions.filter((item) => item.type === tab), [tab, transactions]);

  useEffect(() => {
    if (!requestedType) return;
    setEditing(null);
    setFormType(requestedType);
    setFormOpen(true);
    onRequestHandled();
  }, [onRequestHandled, requestedType]);

  function openCreate(type: TransactionType) {
    setEditing(null);
    setFormType(type);
    setFormOpen(true);
  }

  function openEdit(item: Transaction) {
    setEditing(item);
    setFormType(item.type);
    setFormOpen(true);
  }

  return (
    <div className="stack">
      <section className="transaction-summary">
        <div>
          <p className="eyebrow">Transactions Core</p>
          <h2>Ghi Thu • Chi • Chuyển tiền</h2>
          <p>{transactions.length} giao dịch đang hoạt động • Balance Engine cập nhật ví đồng thời</p>
        </div>
        <div className="action-row transaction-actions-top">
          <button className="btn income-btn" type="button" disabled={!activeWallets.length} onClick={() => openCreate("income")}>+ Thu</button>
          <button className="btn expense-btn" type="button" disabled={!activeWallets.length} onClick={() => openCreate("expense")}>− Chi</button>
          <button className="btn secondary" type="button" disabled={activeWallets.length < 2} onClick={() => openCreate("transfer")}>↔ Chuyển</button>
        </div>
      </section>

      {!activeWallets.length ? (
        <section className="empty-box transaction-empty">
          <strong>Chưa có ví để ghi giao dịch</strong>
          <p>Tạo ít nhất một ví trước. Chuyển tiền cần tối thiểu hai ví đang sử dụng.</p>
          <button className="btn primary top-gap" type="button" onClick={onGoWallets}>Quản lý ví</button>
        </section>
      ) : (
        <>
          <div className="transaction-tabs">
            {(["all", "expense", "income", "transfer"] as const).map((value) => (
              <button key={value} type="button" className={tab === value ? "active" : ""} onClick={() => setTab(value)}>
                {value === "all" ? "Tất cả" : value === "expense" ? "Chi" : value === "income" ? "Thu" : "Chuyển"}
              </button>
            ))}
          </div>

          {loading ? (
            <section className="card"><p className="card-sub">Đang tải giao dịch…</p></section>
          ) : filtered.length === 0 ? (
            <section className="empty-box transaction-empty">
              <strong>Chưa có giao dịch</strong>
              <p>Ghi khoản đầu tiên. Dữ liệu số dư ví sẽ được cập nhật ngay sau khi lưu.</p>
              <div className="action-row top-gap">
                <button className="btn expense-btn" type="button" onClick={() => openCreate("expense")}>Thêm Chi</button>
                <button className="btn income-btn" type="button" onClick={() => openCreate("income")}>Thêm Thu</button>
              </div>
            </section>
          ) : (
            <section className="transaction-list">
              {filtered.map((item) => (
                <article key={item.id} className="transaction-card">
                  <div className={`transaction-icon ${item.type}`} style={item.categoryColor ? { background: `${item.categoryColor}22` } : undefined}>{transactionIcon(item)}</div>
                  <div className="transaction-copy">
                    <div className="transaction-title-row">
                      <h3>{transactionTitle(item)}</h3>
                      <span className={`mini-badge transaction-type ${item.type}`}>{transactionTypeLabel(item.type)}</span>
                    </div>
                    <p>{transactionSubtitle(item)} • {displayDate(item.dateKey)}</p>
                    {item.note && <small>{item.note}</small>}
                  </div>
                  <div className={`transaction-amount ${item.type}`}>
                    {item.type === "income" ? "+" : item.type === "expense" ? "−" : ""}{money(item.amount)}
                  </div>
                  <div className="transaction-row-actions">
                    <button className="text-btn" type="button" onClick={() => openEdit(item)}>Sửa</button>
                    <button className="text-btn danger-text" type="button" onClick={() => setDeleting(item)}>Xóa</button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      {formOpen && (
        <TransactionForm
          initialType={formType}
          transaction={editing}
          wallets={wallets}
          categories={categories}
          settings={settings}
          workspaceId={workspaceId}
          mode={mode}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onOpenWallets={onGoWallets}
          onOpenCategories={onGoCategories}
          onNotify={onNotify}
          onSaved={async () => {
            const wasEditing = Boolean(editing);
            setFormOpen(false);
            setEditing(null);
            onNotify(wasEditing ? "Đã cập nhật giao dịch và tính lại số dư." : "Đã lưu giao dịch và cập nhật số dư.");
            await onRefresh();
          }}
        />
      )}

      {deleting && (
        <DeleteTransactionModal
          item={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await deleteTransaction(mode, workspaceId, deleting.id);
              setDeleting(null);
              onNotify("Đã xóa giao dịch và hoàn tác số dư.");
              await onRefresh();
            } catch (error) {
              onNotify(error instanceof Error ? error.message : "Không thể xóa giao dịch.", "danger");
            }
          }}
        />
      )}
    </div>
  );
}

function TransactionForm({
  initialType,
  transaction,
  wallets,
  categories,
  settings,
  workspaceId,
  mode,
  onClose,
  onSaved,
  onOpenWallets,
  onOpenCategories,
  onNotify,
}: {
  initialType: TransactionType;
  transaction?: Transaction | null;
  wallets: Wallet[];
  categories: Category[];
  settings: WorkspaceSettings;
  workspaceId: string;
  mode: DataMode;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  onOpenWallets: () => void;
  onOpenCategories: () => void;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const defaultWallet = wallets.find((item) => item.id === settings.defaultWalletId && item.status === "active") ?? wallets.find((item) => item.status === "active") ?? null;
  const draftKey = `tiendidau:transaction-draft:${initialType}`;
  const [type, setType] = useState<TransactionType>(transaction?.type ?? initialType);
  const [amountText, setAmountText] = useState(transaction ? String(transaction.amount) : "");
  const [dateKey, setDateKey] = useState(transaction?.dateKey ?? today);
  const [note, setNote] = useState(transaction?.note ?? "");
  const [walletId, setWalletId] = useState(transaction?.walletId ?? defaultWallet?.id ?? "");
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? "");
  const [sourceWalletId, setSourceWalletId] = useState(transaction?.sourceWalletId ?? defaultWallet?.id ?? "");
  const [destinationWalletId, setDestinationWalletId] = useState(transaction?.destinationWalletId ?? "");
  const [confirmedShortfall, setConfirmedShortfall] = useState(false);
  const [saving, setSaving] = useState(false);

  const usableWallets = useMemo(() => wallets.filter((item) => !item.isDeleted && (item.status === "active" || transactionUses(item, transaction))), [transaction, wallets]);
  const usableCategories = useMemo(() => categories.filter((item) => !item.isDeleted && item.type === type && (item.status === "active" || item.id === transaction?.categoryId)), [categories, transaction?.categoryId, type]);

  useEffect(() => {
    if (transaction) return;
    const raw = window.localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<TransactionInput> & { amountText?: string };
      setType(draft.type ?? initialType);
      setAmountText(draft.amountText ?? "");
      setDateKey(draft.dateKey ?? today);
      setNote(draft.note ?? "");
      setWalletId(draft.walletId ?? defaultWallet?.id ?? "");
      setCategoryId(draft.categoryId ?? "");
      setSourceWalletId(draft.sourceWalletId ?? defaultWallet?.id ?? "");
      setDestinationWalletId(draft.destinationWalletId ?? "");
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [defaultWallet?.id, draftKey, initialType, today, transaction]);

  useEffect(() => {
    if (transaction) return;
    window.localStorage.setItem(draftKey, JSON.stringify({
      type, amountText, dateKey, note, walletId, categoryId, sourceWalletId, destinationWalletId,
    }));
  }, [amountText, categoryId, dateKey, destinationWalletId, draftKey, note, sourceWalletId, transaction, type, walletId]);

  useEffect(() => {
    if (type === "transfer") {
      if (!sourceWalletId) setSourceWalletId(defaultWallet?.id ?? usableWallets[0]?.id ?? "");
      if (!destinationWalletId || destinationWalletId === sourceWalletId) {
        setDestinationWalletId(usableWallets.find((item) => item.id !== (sourceWalletId || defaultWallet?.id))?.id ?? "");
      }
      return;
    }
    if (!walletId) setWalletId(defaultWallet?.id ?? usableWallets[0]?.id ?? "");
    const selected = categories.find((item) => item.id === categoryId);
    if (!selected || selected.type !== type || (selected.status !== "active" && selected.id !== transaction?.categoryId)) {
      setCategoryId(usableCategories[0]?.id ?? "");
    }
  }, [categories, categoryId, defaultWallet?.id, destinationWalletId, sourceWalletId, transaction?.categoryId, type, usableCategories, usableWallets, walletId]);

  useEffect(() => {
    setConfirmedShortfall(false);
  }, [amountText, sourceWalletId, type, walletId]);

  const amount = parseAmount(amountText);
  const baseBalance = balanceAfterUndo(transaction, type === "transfer" ? sourceWalletId : walletId, wallets);
  const shortfall = (type === "expense" || type === "transfer") && Number.isSafeInteger(amount) && amount > 0 && amount > baseBalance;
  const validTransfer = type !== "transfer" || (sourceWalletId && destinationWalletId && sourceWalletId !== destinationWalletId && usableWallets.length >= 2);
  const validRegular = type === "transfer" || Boolean(walletId && categoryId);
  const canSave = Number.isSafeInteger(amount) && amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && note.trim().length <= 300 && validTransfer && validRegular && (!shortfall || confirmedShortfall);

  async function submit() {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await saveTransaction(mode, workspaceId, {
        type,
        amount,
        dateKey,
        note: note.trim(),
        walletId: type === "transfer" ? null : walletId || null,
        categoryId: type === "transfer" ? null : categoryId || null,
        sourceWalletId: type === "transfer" ? sourceWalletId || null : null,
        destinationWalletId: type === "transfer" ? destinationWalletId || null : null,
      }, transaction ?? undefined);
      window.localStorage.removeItem(draftKey);
      await onSaved();
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Không thể lưu giao dịch. Dữ liệu form vẫn được giữ.", "danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      wide
      title={transaction ? `Sửa ${transactionTypeLabel(type)}` : `Thêm ${transactionTypeLabel(type)}`}
      description="Số dư ví và số lượng giao dịch được cập nhật trong cùng thao tác để tránh lệch dữ liệu."
      onClose={onClose}
    >
      <div className="transaction-type-switch">
        <button className={type === "expense" ? "active expense" : ""} type="button" onClick={() => setType("expense")}>− Chi</button>
        <button className={type === "income" ? "active income" : ""} type="button" onClick={() => setType("income")}>+ Thu</button>
        <button className={type === "transfer" ? "active transfer" : ""} type="button" onClick={() => setType("transfer")}>↔ Chuyển</button>
      </div>

      <div className="form-grid transaction-form-grid top-gap">
        <label className="field full">
          <span>Số tiền</span>
          <div className="money-input transaction-money-input">
            <input autoFocus inputMode="numeric" value={amountText} onChange={(event) => setAmountText(event.target.value)} placeholder="0" />
            <b>₫</b>
          </div>
          {amount > 0 && Number.isSafeInteger(amount) && <div className="money-preview">{money(amount)}</div>}
        </label>

        <label className="field"><span>Ngày</span><input type="date" value={dateKey} onChange={(event) => setDateKey(event.target.value)} /></label>

        {type !== "transfer" ? (
          <>
            <label className="field">
              <span>Ví</span>
              <select value={walletId} onChange={(event) => setWalletId(event.target.value)}>
                <option value="">Chọn ví</option>
                {usableWallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.icon} {wallet.name} — {money(wallet.currentBalance)}</option>)}
              </select>
            </label>
            <label className="field full">
              <span>Danh mục {type === "income" ? "Thu" : "Chi"}</span>
              <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                <option value="">Chọn danh mục</option>
                {usableCategories.map((category) => <option key={category.id} value={category.id}>{categoryIconGlyph(category.icon)} {category.name}{category.status === "hidden" ? " (đang ẩn)" : ""}</option>)}
              </select>
              {!usableCategories.length && <small>Chưa có danh mục phù hợp. Hãy tạo hoặc hiện lại danh mục.</small>}
            </label>
          </>
        ) : (
          <>
            <label className="field">
              <span>Ví nguồn</span>
              <select value={sourceWalletId} onChange={(event) => setSourceWalletId(event.target.value)}>
                <option value="">Chọn ví nguồn</option>
                {usableWallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.icon} {wallet.name} — {money(wallet.currentBalance)}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Ví đích</span>
              <select value={destinationWalletId} onChange={(event) => setDestinationWalletId(event.target.value)}>
                <option value="">Chọn ví đích</option>
                {usableWallets.filter((wallet) => wallet.id !== sourceWalletId).map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.icon} {wallet.name} — {money(wallet.currentBalance)}</option>)}
              </select>
            </label>
          </>
        )}

        <label className="field full">
          <span>Ghi chú</span>
          <textarea value={note} maxLength={300} rows={3} onChange={(event) => setNote(event.target.value)} placeholder="Không bắt buộc" />
          <div className="field-counter">{note.length}/300</div>
        </label>
      </div>

      {shortfall && (
        <div className="shortfall-warning">
          <div><b>Số tiền lớn hơn số dư hiện có</b><p>Số dư trước giao dịch khoảng {money(baseBalance)}. Bạn vẫn có thể lưu nếu đây là chủ ý.</p></div>
          <label><input type="checkbox" checked={confirmedShortfall} onChange={(event) => setConfirmedShortfall(event.target.checked)} /><span>Tôi vẫn muốn lưu giao dịch này</span></label>
        </div>
      )}

      {type === "transfer" && usableWallets.length < 2 && (
        <div className="shortfall-warning"><div><b>Cần ít nhất 2 ví</b><p>Hãy tạo thêm một ví đang sử dụng trước khi chuyển tiền.</p></div><button type="button" className="btn secondary" onClick={onOpenWallets}>Mở Ví</button></div>
      )}
      {type !== "transfer" && !usableCategories.length && (
        <div className="shortfall-warning"><div><b>Chưa có danh mục khả dụng</b><p>Tạo hoặc hiện lại danh mục {type === "income" ? "Thu" : "Chi"}.</p></div><button type="button" className="btn secondary" onClick={onOpenCategories}>Mở Danh mục</button></div>
      )}

      <div className="modal-actions">
        <button className="btn secondary" type="button" onClick={onClose}>Hủy</button>
        <button className={`btn grow ${type === "expense" ? "expense-btn" : type === "income" ? "income-btn" : "primary"}`} type="button" disabled={!canSave || saving} onClick={() => void submit()}>
          {saving ? "Đang lưu…" : transaction ? "Lưu thay đổi" : type === "expense" ? "Lưu chi tiêu" : type === "income" ? "Lưu thu nhập" : "Chuyển tiền"}
        </button>
      </div>
    </Modal>
  );
}

function transactionUses(wallet: Wallet, transaction?: Transaction | null) {
  if (!transaction) return false;
  return transaction.walletId === wallet.id || transaction.sourceWalletId === wallet.id || transaction.destinationWalletId === wallet.id;
}

function balanceAfterUndo(transaction: Transaction | null | undefined, walletId: string, wallets: Wallet[]) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return 0;
  let balance = wallet.currentBalance;
  if (!transaction) return balance;
  if (transaction.type === "income" && transaction.walletId === walletId) balance -= transaction.amount;
  if (transaction.type === "expense" && transaction.walletId === walletId) balance += transaction.amount;
  if (transaction.type === "transfer" && transaction.sourceWalletId === walletId) balance += transaction.amount;
  if (transaction.type === "transfer" && transaction.destinationWalletId === walletId) balance -= transaction.amount;
  return balance;
}

function DeleteTransactionModal({ item, onClose, onConfirm }: {
  item: Transaction;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  return (
    <Modal title="Xóa giao dịch?" description="Giao dịch sẽ được soft delete và số dư ví được hoàn tác tự động." onClose={onClose}>
      <div className="delete-preview">
        <span>{transactionIcon(item)}</span>
        <div><b>{transactionTitle(item)}</b><p>{displayDate(item.dateKey)} • {money(item.amount)}</p></div>
      </div>
      <div className="modal-actions">
        <button className="btn secondary" type="button" onClick={onClose}>Hủy</button>
        <button className="btn danger-btn grow" type="button" disabled={saving} onClick={async () => { setSaving(true); try { await onConfirm(); } finally { setSaving(false); } }}>{saving ? "Đang xóa…" : "Xóa & hoàn tác số dư"}</button>
      </div>
    </Modal>
  );
}
