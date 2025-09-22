import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getStrapiURL } from "@/lib/utils";
import { SiteHeader } from "../components/custom/SiteHeader";
import { SiteFooter } from "../components/custom/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getStrapiURL();
  try {
    const res = await fetch(`${baseUrl}/api/global`);
    if (!res.ok) throw new Error("Failed to fetch metadata");
    const json = await res.json();
    const title = json?.data?.title ?? "Discover";
    const description = json?.data?.description ?? "Discover App";
    return { title, description } satisfies Metadata;
  } catch {
    return { title: "Discover", description: "Discover App" };
  }
}

async function getGlobal() {
  const baseUrl = getStrapiURL();
  try {
    const res = await fetch(`${baseUrl}/api/global?populate=deep`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _global = await getGlobal();
  return (
    <html lang="zh-CN" data-theme="business">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />

        {/* 使用 npm 依赖：Iconify React 不需要全局 runtime，此处移除 */}
      </body>
    </html>
  );
}
