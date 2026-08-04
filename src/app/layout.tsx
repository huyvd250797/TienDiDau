import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const themeBootstrap = `
(() => {
  try {
    const saved = localStorage.getItem("tiendidau-theme") || "dark";
    const resolved = saved === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : saved;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (_) {
    document.documentElement.classList.add("dark");
  }
})();`;

export const metadata: Metadata = {
  title: {
    default: "Tiền Đi Đâu",
    template: "%s · Tiền Đi Đâu"
  },
  description: "Ứng dụng quản lý thu chi cá nhân hiện đại và trực quan.",
  applicationName: "Tiền Đi Đâu",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tiền Đi Đâu"
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07101d" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
