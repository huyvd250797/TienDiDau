import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tiền Đi Đâu",
    short_name: "TienDiDau",
    description: "Biết tiền đi đâu. Quản lý tiền tốt hơn.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f0e",
    theme_color: "#10b981",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
