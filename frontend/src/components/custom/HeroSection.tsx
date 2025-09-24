import Link from "next/link";
import type { IHeroSectionProps } from "@/types";
import { StrapiImage } from "@/components/custom/StrapiImage";

export function HeroSection({ data }: { data: IHeroSectionProps }) {
  if (!data) return null;

  const { heading, subHeading, link, image } = data;
  const imageUrl = image?.url ?? null;
  const imageAlt = image?.alternativeText || "Background";

  return (
    <div className="hero min-h-[600px] relative overflow-hidden">
      {imageUrl && (
        <StrapiImage
          alt={imageAlt}
          className="hero-image absolute inset-0 object-cover w-full h-full"
          height={1080}
          src={imageUrl}
          style={{
            aspectRatio: "1920/1080",
            objectFit: "cover",
          }}
          width={1920}
        />
      )}
      <div className="hero-overlay bg-opacity-50"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md lg:max-w-2xl">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-5">{heading}</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8">{subHeading}</p>
          {link?.href && (
            <Link 
              className="btn btn-primary btn-lg px-8 shadow-lg"
              href={link.href} 
              target={link.isExternal ? "_blank" : undefined}
            >
              {link.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

