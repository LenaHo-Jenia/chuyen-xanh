import type { Metadata, Viewport } from "next";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import vi from "../../messages/vi.json";

export const metadata: Metadata = {
  title: vi.meta.title,
  description: vi.meta.description,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { title: "Chuyển Xanh", capable: true, statusBarStyle: "default" },
  openGraph: {
    title: vi.meta.title,
    description: "Xe của bạn có được đi trong vùng phát thải thấp Hà Nội không? Tra trong 30 giây, kèm căn cứ.",
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"]
  }
};

export const viewport: Viewport = { themeColor: "#1d3b33", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
