import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { getStrapiURL } from "@/lib/utils";
import { SiteHeader } from "../components/custom/SiteHeader";
import { SiteFooter } from "../components/custom/SiteFooter";

// Primary font - Inter for excellent readability
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font - JetBrains Mono for code and technical content
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Display font - Orbitron for cyberpunk headings
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
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
    <html lang="en" data-theme="cyberpunk">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} antialiased bg-base-100 text-base-content min-h-screen font-sans`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
