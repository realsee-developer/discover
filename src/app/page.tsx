import type { Metadata } from "next";
import { Carousel } from "@/components/custom/home/Carousel";
import { JoinCTA } from "@/components/custom/home/JoinCTA";
import { Professionals } from "@/components/custom/home/Professionals";
import { SearchFilter } from "@/components/custom/home/SearchFilter";
import { TourGrid } from "@/components/custom/home/TourGrid";
import { absoluteUrl } from "@/lib/utils";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getHomeBreadcrumbs,
} from "@/lib/structured-data";
import { generateGlobalAlternates } from "@/lib/seo-utils";
import { getProfessionals, getVrs } from "@/data/db";

const ogImage = "/realsee-logo.jpeg";

export const metadata: Metadata = {
  title: "Immersive Virtual Tours & Creator Network",
  description:
    "Experience photorealistic 3D property tours, discover certified Realsee creators, and learn how immersive storytelling transforms real estate.",
  keywords: [
    "Realsee",
    "3D virtual tour",
    "virtual tour",
    "digital twin",
    "real estate technology",
    "immersive experience",
    "3D photography",
    "virtual reality",
    "VR tours",
    "360 tours",
    "photogrammetry",
    "LiDAR scanning",
    "3D scanning",
    "real estate photography",
    "architectural visualization",
    "property tours",
    "interactive tours",
    "virtual showroom",
    "Realsee creators",
    "professional photographers",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
    languages: generateGlobalAlternates("/"),
  },
  openGraph: {
    title: "Immersive Virtual Tours & Creator Network",
    description:
      "Explore featured 3D experiences, advanced capture devices, and top creators in the Realsee ecosystem.",
    url: absoluteUrl("/"),
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Immersive Virtual Tours & Creator Network",
    description:
      "Discover cutting-edge virtual tours and connect with Realsee creators worldwide.",
    images: [ogImage],
    site: "@REALSEE_Moment",
  },
};

export default async function Home() {
  // Generate structured data for SEO
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const breadcrumbSchema = getHomeBreadcrumbs();

  const structuredData = [
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
  ];

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

      <main className="main-content-wrapper">
        <Carousel />
        <SearchFilter />
        <TourGrid />
        <Professionals />
        <JoinCTA />
      </main>
    </>
  );
}
