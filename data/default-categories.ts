export type CategoryType = "income" | "expense";

export type DefaultCategory = {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  sortOrder: number;
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { id: "income-salary", name: "Lương", type: "income", icon: "wallet", color: "#22c55e", sortOrder: 10 },
  { id: "income-bonus", name: "Thưởng", type: "income", icon: "gift", color: "#10b981", sortOrder: 20 },
  { id: "income-freelance", name: "Freelance", type: "income", icon: "briefcase", color: "#14b8a6", sortOrder: 30 },
  { id: "income-affiliate", name: "Affiliate", type: "income", icon: "link", color: "#06b6d4", sortOrder: 40 },
  { id: "income-sales", name: "Bán hàng", type: "income", icon: "store", color: "#0ea5e9", sortOrder: 50 },
  { id: "income-interest", name: "Lãi tiết kiệm", type: "income", icon: "percent", color: "#3b82f6", sortOrder: 60 },
  { id: "income-other", name: "Khác", type: "income", icon: "circle", color: "#64748b", sortOrder: 70 },
  { id: "expense-food", name: "Ăn uống", type: "expense", icon: "utensils", color: "#f97316", sortOrder: 110 },
  { id: "expense-cafe", name: "Cafe", type: "expense", icon: "coffee", color: "#f59e0b", sortOrder: 120 },
  { id: "expense-shopping", name: "Mua sắm", type: "expense", icon: "bag", color: "#ec4899", sortOrder: 130 },
  { id: "expense-electricity", name: "Điện", type: "expense", icon: "zap", color: "#eab308", sortOrder: 140 },
  { id: "expense-water", name: "Nước", type: "expense", icon: "droplet", color: "#0ea5e9", sortOrder: 150 },
  { id: "expense-internet", name: "Internet", type: "expense", icon: "wifi", color: "#6366f1", sortOrder: 160 },
  { id: "expense-rent", name: "Tiền nhà", type: "expense", icon: "home", color: "#8b5cf6", sortOrder: 170 },
  { id: "expense-fuel", name: "Xăng xe", type: "expense", icon: "fuel", color: "#ef4444", sortOrder: 180 },
  { id: "expense-health", name: "Y tế", type: "expense", icon: "heart", color: "#f43f5e", sortOrder: 190 },
  { id: "expense-education", name: "Giáo dục", type: "expense", icon: "book", color: "#14b8a6", sortOrder: 200 },
  { id: "expense-travel", name: "Du lịch", type: "expense", icon: "plane", color: "#06b6d4", sortOrder: 210 },
  { id: "expense-entertainment", name: "Giải trí", type: "expense", icon: "gamepad", color: "#a855f7", sortOrder: 220 },
  { id: "expense-other", name: "Khác", type: "expense", icon: "circle", color: "#64748b", sortOrder: 230 }
];
