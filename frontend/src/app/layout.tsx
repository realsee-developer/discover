import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
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

export default async function RootLayout({
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
      </body>
    </html>
  );
}
