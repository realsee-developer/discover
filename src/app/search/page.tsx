import type { Metadata } from "next";
import { SearchStateClient } from "./SearchStateClient";
import { absoluteUrl } from "@/lib/utils";
import {
  getOrganizationSchema,
  getSearchBreadcrumbs,
} from "@/lib/structured-data";
import { generateGlobalAlternates } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Search 3D Virtual Tours & Creators",
  description:
    "Search and discover immersive 3D virtual tours, professional creators, and cutting-edge capture devices in the Realsee ecosystem. Filter by category, device, or creator.",
  keywords: [
    "search virtual tours",
    "find 3D tours",
    "Realsee search",
    "3D photography search",
    "virtual tour directory",
    "real estate tours",
    "professional photographers",
    "3D creators",
    "LiDAR tours",
    "360 photography",
    "VR tour search",
    "architectural tours",
    "property photography",
    "digital twin search",
  ],
  alternates: {
    canonical: absoluteUrl("/search"),
    languages: generateGlobalAlternates("/search"),
  },
  openGraph: {
    title: "Search 3D Virtual Tours & Creators | Realsee Discover",
    description:
      "Explore and search through thousands of immersive 3D virtual tours and connect with professional creators worldwide.",
    url: absoluteUrl("/search"),
    type: "website",
    images: [
      {
        url: absoluteUrl("/realsee-logo.jpeg"),
        width: 512,
        height: 512,
        alt: "Realsee Discover Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search 3D Virtual Tours & Creators",
    description:
      "Discover immersive 3D experiences and professional creators in the Realsee network.",
    images: [absoluteUrl("/realsee-logo.jpeg")],
    site: "@REALSEE_Moment",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function SearchPage() {
  // Generate structured data for SEO
  const organizationSchema = getOrganizationSchema();
  const breadcrumbSchema = getSearchBreadcrumbs();

  const structuredData = [organizationSchema, breadcrumbSchema];

  return (
    <>
      {/* Structured Data for SEO and AI Crawlers */}
      {structuredData.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="bg-cyber-gray-900 min-h-screen">
        <SearchStateClient />
      </main>
    </>
  );
}
