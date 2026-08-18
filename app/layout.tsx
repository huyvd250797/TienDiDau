import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiền Đi Đâu",
  description: "Ứng dụng ghi chép thu chi cá nhân gọn nhẹ",
  applicationName: "Tiền Đi Đâu",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090c13",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
