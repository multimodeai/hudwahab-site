import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hud Wahab — AI Engineer & Founder of Multimode AI",
  description:
    "I build private AI agents that handle real business operations. Founder of Multimode AI LLC. Values-aligned, human in the loop.",
  keywords: [
    "AI agent",
    "AI engineer",
    "business automation",
    "Multimode AI",
    "Hud Wahab",
    "AI consulting",
  ],
  icons: { icon: "/favicon.png" },
  metadataBase: new URL("https://multimodeai.com"),
  openGraph: {
    title: "Hud Wahab — AI Engineer & Founder of Multimode AI",
    description:
      "Private AI agents that handle real business operations. Values-aligned, human in the loop.",
    url: "https://multimodeai.com",
    siteName: "Multimode AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hud Wahab — AI Engineer & Founder of Multimode AI",
    description:
      "Private AI agents that handle real business operations. Values-aligned, human in the loop.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Fonts (Typekit) — brand/logo script "wreath" (Medium 500) */}
        <link rel="stylesheet" href="https://use.typekit.net/kia8fkx.css" />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
