import { getStrapiURL } from "@/lib/utils";

async function getStrapiData(url: string) {
  const baseUrl = getStrapiURL();
  try {
    const response = await fetch(baseUrl + url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

import type { IHeroSectionProps, IFeaturesSectionProps } from "@/types";
import { HeroSection } from "@/components/custom/HeroSection";
import { FeaturesSection } from "@/components/custom/FeaturesSection";

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page?populate[blocks][populate]=*");
  const title = strapiData?.data?.title ?? "Home Page";
  const description = strapiData?.data?.description ?? "请先在 Strapi 发布 Home Page 内容并开启公开权限。";
  const blocks = (strapiData?.data?.blocks ?? []) as Array<IHeroSectionProps | IFeaturesSectionProps>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-lg mt-4">{description}</p>
      <div className="mt-8 space-y-8">
        {Array.isArray(blocks) &&
          blocks.map((block) => {
            if (block?.__component?.includes("hero-section")) {
              return <HeroSection key={block.documentId ?? block.id} data={block as IHeroSectionProps} />;
            }
            if (block?.__component?.includes("features-section")) {
              return <FeaturesSection key={block.documentId ?? block.id} data={block as IFeaturesSectionProps} />;
            }
            return null;
          })}
      </div>
    </main>
  );
}
