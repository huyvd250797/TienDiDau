import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: { default: "Tiền Đi Đâu", template: "%s | Tiền Đi Đâu" },
  description: "Biết tiền đi đâu. Quản lý tiền tốt hơn.",
  applicationName: "Tiền Đi Đâu",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Tiền Đi Đâu" },
  icons: { apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0e" },
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi" suppressHydrationWarning><body><PwaRegister />{children}</body></html>;
}
