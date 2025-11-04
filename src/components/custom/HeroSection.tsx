import Image from "next/image";
import Link from "next/link";
import type { IHeroSectionProps } from "@/types";

export function HeroSection({ data }: { data: IHeroSectionProps }) {
  if (!data) return null;

  const { heading, subHeading, link, image } = data;
  const imageUrl = image?.url ?? null;
  const imageAlt = image?.alternativeText || "Background";

  return (
    <div className="hero min-h-[600px] relative overflow-hidden">
      {imageUrl && (
        <Image
          alt={imageAlt}
          className="hero-image absolute inset-0 h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230a0f1a'/%3E%3C/svg%3E"
          src={imageUrl}
        />
      )}
      <div className="hero-overlay bg-opacity-50"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md lg:max-w-2xl">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-5">
            {heading}
          </h1>
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
