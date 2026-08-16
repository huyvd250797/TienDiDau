export const APP_NAME = "Tiền Đi Đâu";
export const APP_VERSION = "1.0.0";
export const USER_ID = "HuyVo";
export const SESSION_COOKIE = "tiendidau_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export const DEFAULT_EXPENSE_CATEGORIES = [
  ["food", "Ăn uống", "🍜", "#ef4444"],
  ["transport", "Di chuyển", "🚗", "#3b82f6"],
  ["shopping", "Mua sắm", "🛒", "#a855f7"],
  ["home", "Nhà ở", "🏠", "#f59e0b"],
  ["utilities", "Điện nước", "💡", "#06b6d4"],
  ["entertainment", "Giải trí", "🎮", "#ec4899"],
  ["health", "Sức khỏe", "💊", "#10b981"],
  ["education", "Giáo dục", "📚", "#6366f1"],
  ["family", "Gia đình", "👨‍👩‍👧", "#14b8a6"],
  ["baby", "Con cái", "👶", "#f97316"],
  ["gift-expense", "Quà tặng", "🎁", "#e11d48"],
  ["travel", "Du lịch", "✈️", "#0ea5e9"],
  ["other-expense", "Khác", "•••", "#64748b"]
] as const;

export const DEFAULT_INCOME_CATEGORIES = [
  ["salary", "Lương", "💰", "#16a34a"],
  ["bonus", "Thưởng", "🎉", "#22c55e"],
  ["freelance", "Freelance", "💻", "#0d9488"],
  ["investment", "Đầu tư", "📈", "#0284c7"],
  ["refund", "Hoàn tiền", "↩️", "#4f46e5"],
  ["gift-income", "Quà tặng", "🎁", "#db2777"],
  ["other-income", "Khác", "•••", "#64748b"]
] as const;
