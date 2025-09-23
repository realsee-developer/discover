import Link from "next/link";
import type { IHeroSectionProps } from "@/types";
import { StrapiImage } from "@/components/custom/StrapiImage";

const styles = {
  header: "relative h-[600px] overflow-hidden",
  backgroundImage: "absolute inset-0 object-cover w-full h-full",
  overlay:
    "relative z-10 flex flex-col items-center justify-center h-full text-center text-white",
  heading:
    "text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-[linear-gradient(90deg,oklch(0.98_0_0),oklch(0.72_0.17_210),oklch(0.68_0.16_260))]",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl text-white/85",
  button:
    "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium",
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
      <div className="absolute inset-0 z-0 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(56,189,248,0.18),transparent_60%)]" />
      <div className="absolute inset-0 z-0 mix-blend-screen pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className={styles.overlay}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subHeading}</p>
        {link?.href && (
          <Link
            className={styles.button + " btn btn-md"}
            href={link.href}
            target={link.isExternal ? "_blank" : undefined}
          >
            <span className="hidden sm:inline">{link.label}</span>
            <span className="sm:hidden">{link.label}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default HeroSection;

