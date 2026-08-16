export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function monthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${map.year}-${map.month}`;
}

export function monthBounds(key = monthKey()) {
  const [y, m] = key.split("-").map(Number);
  const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return { from: `${key}-01`, toExclusive: next };
}

export function formatDateLabel(key: string) {
  const today = todayKey();
  const t = new Date(`${today}T12:00:00+07:00`);
  t.setDate(t.getDate() - 1);
  const yesterday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(t);
  if (key === today) return "Hôm nay";
  if (key === yesterday) return "Hôm qua";
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
}

export function displayMonth(key = monthKey()) {
  const [y, m] = key.split("-");
  return `Tháng ${Number(m)}/${y}`;
}
