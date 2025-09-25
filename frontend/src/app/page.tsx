import type { Metadata } from "next";
import { Carousel } from "@/components/custom/home/Carousel";
import { SearchFilter } from "@/components/custom/home/SearchFilter";
import { TourGrid } from "@/components/custom/home/TourGrid";
import { Professionals } from "@/components/custom/home/Professionals";
import { JoinCTA } from "@/components/custom/home/JoinCTA";
import { absoluteUrl } from "@/lib/utils";

const ogImage = absoluteUrl("/cover/og-main.jpg");

export const metadata: Metadata = {
  title: "Immersive Virtual Tours & Creator Network",
  description:
    "Experience photorealistic 3D property tours, discover certified Realsee creators, and learn how immersive storytelling transforms real estate.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Immersive Virtual Tours & Creator Network",
    description:
      "Explore featured 3D experiences, advanced capture devices, and top creators in the Realsee ecosystem.",
    url: absoluteUrl("/"),
    images: ogImage ? [{ url: ogImage }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Immersive Virtual Tours & Creator Network",
    description:
      "Discover cutting-edge virtual tours and connect with Realsee creators worldwide.",
    images: ogImage ? [ogImage] : undefined,
  },
};

export default async function Home() {
  return (
    <main className="main-content-wrapper">
      <Carousel />
      <SearchFilter />
      <TourGrid />
      <Professionals />
      <JoinCTA />
    </main>
  );
}
