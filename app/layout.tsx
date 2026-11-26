import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 中文標題用的襯線字體；字檔很大，不預先載入，瀏覽器會依照用到的字分段下載
const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 合約審查器｜簽名之前，先讀懂每一條",
  description: "上傳合約，AI 以台灣律師的視角標出風險條款、缺漏條款，並給出可直接替換的修改建議。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifTC.variable} h-full antialiased`}
    >
      <body className="bg-grain flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
