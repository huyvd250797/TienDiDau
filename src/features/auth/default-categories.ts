export type DefaultCategoryType = "income" | "expense";

export interface DefaultCategoryDefinition {
  id: string;
  systemKey: string;
  name: string;
  type: DefaultCategoryType;
  icon: string;
  color: string;
  sortOrder: number;
}

export const DEFAULT_CATEGORIES = [
  {
    id: "income-salary",
    systemKey: "salary",
    name: "Lương",
    type: "income",
    icon: "briefcase",
    color: "#22C875",
    sortOrder: 10
  },
  {
    id: "income-bonus",
    systemKey: "bonus",
    name: "Thưởng",
    type: "income",
    icon: "gift",
    color: "#34D399",
    sortOrder: 20
  },
  {
    id: "income-freelance",
    systemKey: "freelance",
    name: "Freelance",
    type: "income",
    icon: "laptop",
    color: "#2DD4BF",
    sortOrder: 30
  },
  {
    id: "income-affiliate",
    systemKey: "affiliate",
    name: "Affiliate",
    type: "income",
    icon: "link",
    color: "#38BDF8",
    sortOrder: 40
  },
  {
    id: "income-sales",
    systemKey: "sales",
    name: "Bán hàng",
    type: "income",
    icon: "store",
    color: "#60A5FA",
    sortOrder: 50
  },
  {
    id: "income-interest",
    systemKey: "interest",
    name: "Lãi tiết kiệm",
    type: "income",
    icon: "percent",
    color: "#818CF8",
    sortOrder: 60
  },
  {
    id: "income-other",
    systemKey: "other-income",
    name: "Khác",
    type: "income",
    icon: "more-horizontal",
    color: "#94A3B8",
    sortOrder: 70
  },
  {
    id: "expense-food",
    systemKey: "food",
    name: "Ăn uống",
    type: "expense",
    icon: "utensils",
    color: "#F59E0B",
    sortOrder: 110
  },
  {
    id: "expense-cafe",
    systemKey: "cafe",
    name: "Cafe",
    type: "expense",
    icon: "coffee",
    color: "#F97316",
    sortOrder: 120
  },
  {
    id: "expense-shopping",
    systemKey: "shopping",
    name: "Mua sắm",
    type: "expense",
    icon: "shopping-bag",
    color: "#EC4899",
    sortOrder: 130
  },
  {
    id: "expense-electricity",
    systemKey: "electricity",
    name: "Điện",
    type: "expense",
    icon: "zap",
    color: "#EAB308",
    sortOrder: 140
  },
  {
    id: "expense-water",
    systemKey: "water",
    name: "Nước",
    type: "expense",
    icon: "droplet",
    color: "#06B6D4",
    sortOrder: 150
  },
  {
    id: "expense-internet",
    systemKey: "internet",
    name: "Internet",
    type: "expense",
    icon: "wifi",
    color: "#3B82F6",
    sortOrder: 160
  },
  {
    id: "expense-rent",
    systemKey: "rent",
    name: "Tiền nhà",
    type: "expense",
    icon: "home",
    color: "#8B5CF6",
    sortOrder: 170
  },
  {
    id: "expense-fuel",
    systemKey: "fuel",
    name: "Xăng xe",
    type: "expense",
    icon: "fuel",
    color: "#14B8A6",
    sortOrder: 180
  },
  {
    id: "expense-health",
    systemKey: "health",
    name: "Y tế",
    type: "expense",
    icon: "heart-pulse",
    color: "#EF4444",
    sortOrder: 190
  },
  {
    id: "expense-education",
    systemKey: "education",
    name: "Giáo dục",
    type: "expense",
    icon: "graduation-cap",
    color: "#6366F1",
    sortOrder: 200
  },
  {
    id: "expense-travel",
    systemKey: "travel",
    name: "Du lịch",
    type: "expense",
    icon: "plane",
    color: "#0EA5E9",
    sortOrder: 210
  },
  {
    id: "expense-entertainment",
    systemKey: "entertainment",
    name: "Giải trí",
    type: "expense",
    icon: "gamepad",
    color: "#A855F7",
    sortOrder: 220
  },
  {
    id: "expense-other",
    systemKey: "other-expense",
    name: "Khác",
    type: "expense",
    icon: "more-horizontal",
    color: "#94A3B8",
    sortOrder: 230
  }
] as const satisfies readonly DefaultCategoryDefinition[];

export const DEFAULT_CATEGORY_COUNTS = {
  total: DEFAULT_CATEGORIES.length,
  income: DEFAULT_CATEGORIES.filter((category) => category.type === "income").length,
  expense: DEFAULT_CATEGORIES.filter((category) => category.type === "expense").length
} as const;
