import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getStrapiURL } from "@/lib/utils";
import { SiteHeader } from "../components/custom/SiteHeader";
import { SiteFooter } from "../components/custom/SiteFooter";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="business">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        <main className="relative pt-16">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
