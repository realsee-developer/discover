import { Carousel } from "@/components/custom/home/Carousel";
import { SearchFilter } from "@/components/custom/home/SearchFilter";
import { TourGrid } from "@/components/custom/home/TourGrid";
import { Professionals } from "@/components/custom/home/Professionals";
import { JoinCTA } from "@/components/custom/home/JoinCTA";
import { getStrapiURL } from "@/lib/utils";
import HeroSection from "@/components/custom/HeroSection";
import FeaturesSection from "@/components/custom/FeaturesSection";
import type { IFeaturesSectionProps, IHeroSectionProps } from "@/types";

type HomeBlocks = Array<IHeroSectionProps | IFeaturesSectionProps>;

async function getHomeBlocks(): Promise<HomeBlocks> {
  const baseUrl = getStrapiURL();
  try {
    const res = await fetch(
      `${baseUrl}/api/home-page?populate[blocks][populate]=*`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch home-page");
    const json = await res.json();
    const blocks = (json?.data?.blocks ?? []) as HomeBlocks;
    return Array.isArray(blocks) ? blocks : [];
  } catch {
    return [];
  }
}

function renderBlock(block: HomeBlocks[number]) {
  switch (block?.__component) {
    case "layout.hero-section":
      return <HeroSection key={block.documentId} data={block as IHeroSectionProps} />;
    case "layout.features-section":
      return <FeaturesSection key={block.documentId} data={block as IFeaturesSectionProps} />;
    default:
      return null;
  }
}

export default async function Home() {
  const blocks = await getHomeBlocks();
  return (
    <main className="main-content-wrapper">
      <Carousel />
      {blocks.map(renderBlock)}
      <SearchFilter />
      <TourGrid />
      <Professionals />
      <JoinCTA />
    </main>
  );
}
