import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "../components/custom/SiteHeader";
import { SiteFooter } from "../components/custom/SiteFooter";
import { absoluteUrl, getSiteURL } from "@/lib/utils";

const gaId = process.env.NEXT_PUBLIC_GA_ID ?? process.env.GA_ID;

const gtmId = "GTM-N27VZHG2";
const isVercelProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteURL()),
  title: {
    default: "Realsee Discover | Immersive 3D Tours & Creators",
    template: "%s | Realsee Discover",
  },
  description:
    "Explore immersive 3D virtual tours, meet certified Realsee creators, and experience the future of real estate storytelling.",
  keywords: [
    "Realsee",
    "3D virtual tour",
    "digital twin",
    "real estate technology",
    "immersive experience",
  ],
  applicationName: "Realsee Discover",
  authors: [{ name: "Realsee" }],
  creator: "Realsee",
  publisher: "Realsee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/realsee-logo-with-brand.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        url: "/realsee-logo.jpeg",
        type: "image/jpeg",
        sizes: "512x512",
      },
    ],
    shortcut: [
      {
        url: "/realsee-logo-with-brand.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/realsee-logo-with-brand.png",
        type: "image/png",
        sizes: "196x196",
      },
    ],
  },
  openGraph: {
    title: "Realsee Discover | Immersive 3D Tours & Creators",
    description:
      "Discover high-fidelity 3D tours and visionary creators powered by Realsee's photogrammetry technology.",
    url: absoluteUrl(),
    siteName: "Realsee Discover",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realsee Discover | Immersive 3D Tours & Creators",
    description:
      "Explore immersive 3D experiences and connect with Realsee's global creator network.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: absoluteUrl(),
  },
  other: {
    "X-Robots-Tag": "index, follow",
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="cyberpunk">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} antialiased bg-cyber-gray-900 text-cyber-gray-200 min-h-screen font-sans`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
        {isVercelProduction ? <GoogleTagManager gtmId={gtmId} /> : null}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
