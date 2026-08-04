/**
 * Design tokens dùng trong TypeScript. Màu sắc nằm ở CSS variables trong globals.css
 * để Tailwind và trình duyệt có chung một nguồn dữ liệu.
 */
export const designTokens = {
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  },
  layout: {
    sidebarWidth: 280,
    contentMaxWidth: 1440,
    mobileNavHeight: 72
  },
  radius: {
    control: 12,
    card: 18,
    panel: 24
  },
  motion: {
    fast: 140,
    normal: 220,
    slow: 320
  },
  zIndex: {
    content: 1,
    header: 30,
    navigation: 40,
    modal: 60,
    toast: 80
  }
} as const;

export type DesignTokens = typeof designTokens;
