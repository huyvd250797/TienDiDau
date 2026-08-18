"use client";

import { useEffect, useMemo, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { saveCategory, setCategoryVisibility, type DataMode } from "@/features/data/repository";
import type { Category, CategoryInput, CategoryType } from "@/types/category";

const icons = ["🍜", "☕", "🛍️", "⚡", "💧", "🌐", "🏠", "⛽", "❤️", "📚", "✈️", "🎮", "💼", "🎁", "💵", "🔗", "🏪", "📈", "⭕"];
const colors = ["#22c55e", "#10b981", "#0ea5e9", "#3b82f6", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e", "#ef4444", "#f97316", "#f59e0b", "#64748b"];

function iconFor(category: Category) {
  const map: Record<string, string> = {
    wallet: "💵", gift: "🎁", briefcase: "💼", link: "🔗", store: "🏪", percent: "📈", circle: "⭕",
    utensils: "🍜", coffee: "☕", bag: "🛍️", zap: "⚡", droplet: "💧", wifi: "🌐", home: "🏠",
    fuel: "⛽", heart: "❤️", book: "📚", plane: "✈️", gamepad: "🎮",
  };
  return map[category.icon] ?? category.icon;
}

export function CategoriesView({
  categories,
  workspaceId,
  mode,
  loading,
  onRefresh,
  onBack,
  onNotify,
}: {
  categories: Category[];
  workspaceId: string;
  mode: DataMode;
  loading: boolean;
  onRefresh: () => Promise<void>;
  onBack: () => void;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const [tab, setTab] = useState<CategoryType>("expense");
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => categories.filter((item) => item.type === tab), [categories, tab]);
  const defaultCount = filtered.filter((item) => item.isDefault).length;
  const customCount = filtered.filter((item) => !item.isDefault).length;

  async function toggle(category: Category) {
    try {
      const next = category.status === "active" ? "hidden" : "active";
      await setCategoryVisibility(mode, workspaceId, category.id, next);
      onNotify(next === "active" ? "Đã hiển thị danh mục." : "Đã ẩn danh mục.");
      await onRefresh();
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Không thể cập nhật danh mục.", "danger");
    }
  }

  return (
    <div className="stack">
      <section className="section-head-row">
        <div>
          <button className="back-link" type="button" onClick={onBack}>← Quay lại</button>
          <p className="eyebrow top-gap-small">Quản lý</p>
          <h2 className="section-title">Danh mục Thu & Chi</h2>
          <p className="card-sub">Danh mục mặc định và danh mục tự tạo sẽ được dùng khi nhập giao dịch.</p>
        </div>
        <button className="btn primary" type="button" disabled={loading || !workspaceId} onClick={() => { setEditing(null); setFormOpen(true); }}>+ Thêm danh mục</button>
      </section>

      <div className="segmented">
        <button className={tab === "expense" ? "active" : ""} type="button" onClick={() => setTab("expense")}>Chi tiêu</button>
        <button className={tab === "income" ? "active" : ""} type="button" onClick={() => setTab("income")}>Thu nhập</button>
      </div>

      <section className="card compact-card">
        <div className="category-stats"><span>{defaultCount} mặc định</span><span>•</span><span>{customCount} tùy chỉnh</span><span>•</span><span>{filtered.filter((item) => item.status === "hidden").length} đang ẩn</span></div>
      </section>

      {loading ? (
        <section className="card"><p className="card-sub">Đang tải danh mục…</p></section>
      ) : (
        <section className="category-grid">
          {filtered.map((category) => (
            <article key={category.id} className={`category-card ${category.status === "hidden" ? "muted-card" : ""}`}>
              <div className="category-icon" style={{ background: `${category.color}22`, color: category.color }}>{iconFor(category)}</div>
              <div className="category-copy">
                <div className="wallet-title-row">
                  <h3>{category.name}</h3>
                  {category.isDefault && <span className="mini-badge">Mặc định</span>}
                  {category.status === "hidden" && <span className="mini-badge neutral">Ẩn</span>}
                </div>
                <p>{category.type === "income" ? "Thu nhập" : "Chi tiêu"}</p>
              </div>
              <div className="category-actions">
                <button className="text-btn" type="button" onClick={() => { setEditing(category); setFormOpen(true); }}>Sửa</button>
                <button className="text-btn" type="button" onClick={() => void toggle(category)}>{category.status === "active" ? "Ẩn" : "Hiện"}</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {formOpen && (
        <CategoryForm
          category={editing}
          defaultType={tab}
          workspaceId={workspaceId}
          mode={mode}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={async () => {
            setFormOpen(false);
            setEditing(null);
            onNotify(editing ? "Đã cập nhật danh mục." : "Đã thêm danh mục.");
            await onRefresh();
          }}
          onNotify={onNotify}
        />
      )}
    </div>
  );
}

function CategoryForm({
  category,
  defaultType,
  workspaceId,
  mode,
  onClose,
  onSaved,
  onNotify,
}: {
  category?: Category | null;
  defaultType: CategoryType;
  workspaceId: string;
  mode: DataMode;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  onNotify: (message: string, tone?: "success" | "danger" | "warning") => void;
}) {
  const draftKey = `tiendidau:category-draft:${category?.id ?? "new"}`;
  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState<CategoryType>(category?.type ?? defaultType);
  const [icon, setIcon] = useState(category ? iconFor(category) : icons[0]);
  const [color, setColor] = useState(category?.color ?? colors[0]);
  const [saving, setSaving] = useState(false);
  const typeLocked = Boolean(category && category.transactionCount > 0);

  useEffect(() => {
    if (category) return;
    const raw = window.localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<CategoryInput>;
      setName(draft.name ?? "");
      setType(draft.type ?? defaultType);
      setIcon(draft.icon ?? icons[0]);
      setColor(draft.color ?? colors[0]);
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [category, defaultType, draftKey]);

  useEffect(() => {
    if (category) return;
    window.localStorage.setItem(draftKey, JSON.stringify({ name, type, icon, color }));
  }, [category, color, draftKey, icon, name, type]);

  const canSave = name.trim().length >= 1 && name.trim().length <= 40;

  async function submit() {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await saveCategory(mode, workspaceId, { name: name.trim(), type, icon, color }, category ?? undefined);
      window.localStorage.removeItem(draftKey);
      await onSaved();
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Không thể lưu danh mục. Dữ liệu form vẫn được giữ.", "danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={category ? "Sửa danh mục" : "Thêm danh mục"} description="Danh mục đã dùng sẽ được ẩn thay vì xóa vật lý." onClose={onClose}>
      <div className="form-grid">
        <label className="field full"><span>Tên danh mục</span><input autoFocus value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Ăn sáng" /></label>
        <label className="field full"><span>Loại</span><select disabled={typeLocked} value={type} onChange={(e) => setType(e.target.value as CategoryType)}><option value="expense">Chi tiêu</option><option value="income">Thu nhập</option></select>{typeLocked && <small>Loại danh mục bị khóa vì đã có giao dịch.</small>}</label>
        <div className="field full"><span>Icon</span><div className="choice-row">{icons.map((item) => <button key={item} type="button" className={`choice-icon ${icon === item ? "selected" : ""}`} onClick={() => setIcon(item)}>{item}</button>)}</div></div>
        <div className="field full"><span>Màu sắc</span><div className="choice-row">{colors.map((item) => <button key={item} type="button" className={`color-dot ${color === item ? "selected" : ""}`} style={{ background: item }} aria-label={item} onClick={() => setColor(item)} />)}</div></div>
      </div>
      <div className="modal-actions">
        <button className="btn secondary" type="button" onClick={onClose}>Hủy</button>
        <button className="btn primary grow" type="button" disabled={!canSave || saving} onClick={() => void submit()}>{saving ? "Đang lưu…" : "Lưu danh mục"}</button>
      </div>
    </Modal>
  );
}
