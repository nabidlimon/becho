import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BECHO (বেচো) — Autonomous AI Social Sales & Support Closer",
  description:
    "The 24/7 AI Sales Closer for Facebook Pages. Understands customer photos, voice notes, multi-message bursts, and closes Cash-on-Delivery orders in 2 seconds.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "1024x1024" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/app-icon.png", type: "image/png", sizes: "1024x1024" },
      { url: "/app-icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "BECHO (বেচো) — Autonomous AI Social Sales Closer",
    description:
      "Turn Facebook DMs into Cash-on-Delivery orders in 2 seconds with multimodal AI vision and marketing psychology.",
    images: [{ url: "/banner.svg", width: 1200, height: 630, alt: "BECHO Banner" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
