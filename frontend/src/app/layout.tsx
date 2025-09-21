import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getStrapiURL } from "@/lib/utils";

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
  const global = await getGlobal();
  const header = global?.data?.header;
  const footer = global?.data?.footer;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <Link href={header?.logoText?.href ?? "/"} className="font-semibold">
              {header?.logoText?.label ?? "Discover"}
            </Link>
            <Link
              href={header?.ctaButton?.href ?? "/"}
              target={header?.ctaButton?.isExternal ? "_blank" : undefined}
              className="px-3 py-1 border rounded"
            >
              {header?.ctaButton?.label ?? "Get Started"}
            </Link>
          </div>
        </header>
        {children}
        <footer className="border-t mt-12">
          <div className="container mx-auto p-6 text-sm text-muted-foreground">
            <div>
              {footer?.text ?? "Thanks for visiting."}
            </div>
            <div className="mt-3 flex gap-3">
              {(footer?.socialLink ?? []).map((s: any) => (
                <Link key={s.id} href={s.href} target={s.isExternal ? "_blank" : undefined} className="underline">
                  {s.label}
                </Link>
              ))}
            </div>
            <div className="mt-3">© {new Date().getFullYear()} {(footer?.logoText?.label ?? "Discover")}</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
