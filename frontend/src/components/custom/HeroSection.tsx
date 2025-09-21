import Link from "next/link";
import type { IHeroSectionProps } from "@/types";
import { StrapiImage } from "@/components/custom/StrapiImage";

const styles = {
  header: "relative h-[600px] overflow-hidden",
  backgroundImage: "absolute inset-0 object-cover w-full h-full",
  overlay:
    "relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/50",
  heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
  button:
    "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors",
};

export function HeroSection({ data }: { data: IHeroSectionProps }) {
  if (!data) return null;

  const { heading, subHeading, link, image } = data;
  const imageUrl = image?.url ?? null;
  const imageAlt = image?.alternativeText || "Background";

  return (
    <header className={styles.header}>
      {imageUrl && (
        <StrapiImage
          alt={imageAlt}
          className={styles.backgroundImage}
          height={1080}
          src={imageUrl}
          style={{
            aspectRatio: "1920/1080",
            objectFit: "cover",
          }}
          width={1920}
        />
      )}
      <div className={styles.overlay}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subHeading}</p>
        {link?.href && (
          <Link className={styles.button} href={link.href} target={link.isExternal ? "_blank" : undefined}>
            {link.label}
          </Link>
        )}
      </div>
    </header>
  );
}

export default HeroSection;

