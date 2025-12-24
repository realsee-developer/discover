import { Icon } from "@iconify/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JoinCTA } from "@/components/custom/home/JoinCTA";
import { GlitchText, ScanLinesOverlay } from "@/components/cyber";

import { getProfessionalBySlug, getProfessionals, getVrById } from "@/data/db";
import { absoluteUrl } from "@/lib/utils";
import { HeroRotatingBg } from "./HeroRotatingBg";
import {
  getProfilePageSchema,
  getProfessionalBreadcrumbs,
  getVideoObjectSchema,
} from "@/lib/structured-data";
import { generateGlobalAlternates } from "@/lib/seo-utils";
import { KudosButton } from "./KudosButton";
import { type TourCardData, ToursGrid } from "./ToursGrid";
import YouTubePlayer from "./YouTubePlayer";

type SocialKey = "linkedin" | "instagram" | "facebook" | "youtube" | "vimeo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  const canonicalUrl = absoluteUrl(`/professional/${slug}`);
  const defaultImage = "/realsee-logo.jpeg";
  const twitterSite =
    getTwitterHandle(pro?.twitter ?? null) ?? "@REALSEE_Moment";

  const title = pro
    ? `${pro.name} - Professional 3D Photographer | Realsee Creator`
    : "Professional 3D Photographer | Realsee";
  const description =
    pro?.shortBio ||
    "Discover talented Realsee professionals and their stunning immersive 3D virtual tours and digital twins.";
  const keywords = pro
    ? [
        pro.name,
        "Realsee Creator",
        "3D photography",
        "virtual tours",
        "digital twins",
        pro.Location ?? "",
      ].filter(Boolean)
    : [
        "Realsee",
        "3D photography",
        "virtual tours",
        "immersive experiences",
        "digital twins",
      ];

  const portraitUrl = pro ? `/professional/${pro.slug}.jpg` : defaultImage;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: generateGlobalAlternates(`/professional/${slug}`),
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: canonicalUrl,
      siteName: "Realsee Discover",
      locale: "en_US",
      images: [
        {
          url: portraitUrl.startsWith("http")
            ? portraitUrl
            : absoluteUrl(portraitUrl),
          width: 640,
          height: 800,
          alt: pro ? `${pro.name} portrait` : "Realsee Discover",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [portraitUrl],
      site: twitterSite,
    },
  };
}

export async function generateStaticParams() {
  return getProfessionals().map((p) => ({ slug: p.slug! }));
}

export default async function ProfessionalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);

  if (!pro) {
    return (
      <main className="main-content-wrapper flex-1 bg-cyber-gray-900 text-cyber-gray-200">
        <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyber-brand-400/40 bg-cyber-gray-900 neon-border">
            <Icon
              icon="heroicons:user"
              width={36}
              className="text-cyber-gray-500"
            />
          </div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Professional Not Found
          </h1>
          <p className="max-w-xl text-sm text-cyber-gray-400 md:text-base">
            The professional profile you are looking for does not exist or may
            have been moved.
          </p>
          <Link
            href="/search"
            className="btn cyber-btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            <Icon icon="heroicons:magnifying-glass" width={18} />
            Browse All Professionals
          </Link>
        </section>
      </main>
    );
  }

  const tours = (pro.vrIds || [])
    .map((id) => getVrById(id))
    .filter((v): v is NonNullable<ReturnType<typeof getVrById>> => Boolean(v));

  const hasWebsite = Boolean(pro.Website && pro.Website !== "/");
  const heroImages = tours
    .map((t) => t.assetCover || t.cover)
    .filter((src): src is string => Boolean(src));

  const locationMapsUrl = pro.Location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        pro.Location
      )}`
    : null;

  const socialHandles: Partial<Record<SocialKey | "twitter", string>> = {
    linkedin: pro.linkedin,
    instagram: pro.instagram,
    facebook: pro.facebook,
    youtube: pro.youtube,
    vimeo: pro.vimeo,
    twitter: pro.twitter,
  };
  const socialConfigs: Array<{
    key: SocialKey | "twitter";
    icon: string;
    colorClass: string;
    bgClass: string;
  }> = [
    {
      key: "linkedin",
      icon: "mdi:linkedin",
      colorClass: "text-[#0A66C2]",
      bgClass: "border-[#0A66C2]/50 bg-[#0A66C2]/35",
    },
    {
      key: "instagram",
      icon: "mdi:instagram",
      colorClass: "text-[#C13584]",
      bgClass: "border-[#C13584]/50 bg-[#C13584]/35",
    },
    {
      key: "facebook",
      icon: "mdi:facebook",
      colorClass: "text-[#1877F2]",
      bgClass: "border-[#1877F2]/50 bg-[#1877F2]/35",
    },
    {
      key: "youtube",
      icon: "mdi:youtube",
      colorClass: "text-[#FF0033]",
      bgClass: "border-[#FF0033]/50 bg-[#FF0033]/35",
    },
    {
      key: "vimeo",
      icon: "mdi:vimeo",
      colorClass: "text-[#1AB7EA]",
      bgClass: "border-[#1AB7EA]/50 bg-[#1AB7EA]/35",
    },
    {
      key: "twitter",
      icon: "mdi:twitter",
      colorClass: "text-[#1DA1F2]",
      bgClass: "border-[#1DA1F2]/50 bg-[#1DA1F2]/35",
    },
  ];

  type SocialLink = {
    key: SocialKey | "website" | "twitter";
    icon: string;
    value: string;
    colorClass: string;
    bgClass: string;
  };

  const socialLinks: SocialLink[] = [];

  if (hasWebsite) {
    socialLinks.push({
      key: "website",
      icon: "heroicons:globe-alt",
      colorClass: "text-cyber-brand-100",
      bgClass: "border-cyber-brand-500/50 bg-cyber-brand-500/30",
      value: pro.Website?.startsWith("http")
        ? pro.Website!
        : `https://${pro.Website}`,
    });
  }

  for (const config of socialConfigs) {
    const value = socialHandles[config.key];
    if (!value) continue;
    socialLinks.push({ ...config, value });
  }

  const youtubeId = pro.behindScenesVideo
    ? extractYouTubeId(pro.behindScenesVideo)
    : null;
  const blogArticle = pro.blogArticle;

  const tourCards: TourCardData[] = tours.map((tour) => ({
    id: tour.id,
    title: tour.title || "Untitled Tour",
    url: tour.url || "#",
    shortCategory: tour.shortCategory || undefined,
    device: tour.device || undefined,
    cover:
      tour.assetCover ||
      tour.cover ||
      tour.remoteCover ||
      "/cover/placeholder.jpg",
    categoryIcon: tour.shortCategory
      ? categoryIconMap(tour.shortCategory)
      : undefined,
  }));

  // Generate structured data for SEO
  const profilePageSchema = getProfilePageSchema({
    name: pro.name,
    slug: slug,
    shortBio: pro.shortBio,
    location: pro.Location,
    website: pro.Website,
    portraitUrl: `/professional/${pro.slug}.jpg`,
    tourCount: tours.length,
    socialLinks: {
      linkedin: pro.linkedin,
      instagram: pro.instagram,
      facebook: pro.facebook,
      youtube: pro.youtube,
      twitter: pro.twitter,
    },
  });

  const breadcrumbSchema = getProfessionalBreadcrumbs(pro.name, slug);

  const structuredData = [
    profilePageSchema,
    breadcrumbSchema,
  ] as unknown as Array<Record<string, unknown>>;
  if (youtubeId) {
    const videoSchema = getVideoObjectSchema({
      name: `${pro.name} - Behind the Scenes`,
      description: `Watch ${pro.name} in action. Discover how immersive 3D capture comes to life with exclusive production footage and commentary from this professional Realsee creator.`,
      youtubeId: youtubeId,
      uploadDate: "2024-01-01T00:00:00Z",
    });
    structuredData.push(videoSchema as Record<string, unknown>);
  }

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

      <main className="main-content-wrapper flex-1 bg-cyber-gray-900 text-cyber-gray-200">
        {/* ============================================
            HERO SECTION - Diagonal Split Design
            ============================================ */}
        <section className="relative isolate min-h-[100svh] overflow-hidden flex items-center">
          {/* Background with rotating images */}
          {heroImages.length ? (
            <HeroRotatingBg images={heroImages} enhanced />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-20 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-100 to-cyber-gray-900"
            />
          )}

          {/* Subtle gradient overlay for text readability - no heavy mask */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-cyber-gray-900/70 via-transparent to-transparent lg:from-cyber-gray-900/60"
          />

          {/* Global scanlines */}
          <ScanLinesOverlay intensity="subtle" />

          {/* Hero Content Grid */}
          <div className="container relative z-10 mx-auto px-6 py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16 xl:grid-cols-[1fr_500px] items-center">
              {/* Left Column - Info */}
              <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">
                {/* Verified Badge */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative group">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyber-neon-cyan via-cyber-brand-500 to-cyber-neon-magenta opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
                    <div className="relative flex items-center gap-3 rounded-full bg-cyber-gray-900/90 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyber-gray-100 border border-cyber-neon-cyan/30">
                      <Icon
                        icon="heroicons:sparkles"
                        width={16}
                        className="text-cyber-neon-cyan animate-pulse"
                      />
                      <span>Realsee Creator</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyber-neon-cyan/20 px-2 py-[2px] text-[0.65rem] font-medium text-cyber-neon-cyan">
                        <Icon
                          icon="heroicons:shield-check"
                          width={14}
                          className="text-cyber-neon-cyan"
                        />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name with Glitch Effect */}
                <div className="space-y-5">
                  <GlitchText
                    as="h1"
                    text={pro.name}
                    className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-white"
                    style={{
                      textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 0 60px rgba(0,255,255,0.3)",
                    }}
                  />

                  {/* Short Bio */}
                  {pro.shortBio && (
                    <p 
                      className="max-w-2xl text-lg leading-relaxed text-white lg:text-xl mx-auto lg:mx-0 font-medium"
                      style={{
                        textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)",
                      }}
                    >
                      {pro.shortBio}
                    </p>
                  )}
                </div>

                {/* Location & Kudos */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-2">
                  {locationMapsUrl && (
                    <Link
                      href={locationMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-cyber-neon-cyan/30 bg-cyber-gray-900/60 px-5 py-2 text-sm font-medium text-cyber-gray-100 backdrop-blur-md transition-all duration-300 hover:border-cyber-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:-translate-y-0.5"
                      prefetch={false}
                    >
                      <Icon
                        icon="heroicons:map-pin"
                        width={18}
                        className="text-cyber-neon-cyan group-hover:animate-pulse"
                      />
                      <span>{pro.Location}</span>
                    </Link>
                  )}
                  <KudosButton slug={slug} name={pro.name} />
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                    {socialLinks.map((entry, idx) => {
                      const href = entry.value.startsWith("http")
                        ? entry.value
                        : `https://${entry.value}`;
                      return (
                        <Link
                          key={entry.key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 rounded-xl bg-cyber-gray-900/60 border border-cyber-gray-600/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyber-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.25)]"
                          style={{
                            animationDelay: `${idx * 50}ms`,
                          }}
                          aria-label={
                            entry.key === "website" ? "Website" : entry.key
                          }
                        >
                          <Icon
                            icon={entry.icon}
                            width={22}
                            className="text-cyber-gray-300 group-hover:text-cyber-neon-cyan transition-colors"
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Right Column - Portrait */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative floating-avatar">
                  {/* Soft ambient glow - large and diffused */}
                  <div
                    className="absolute -inset-8 rounded-[2rem] opacity-40 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, var(--color-cyber-neon-cyan) 0%, var(--color-cyber-neon-magenta) 50%, transparent 70%)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Portrait frame with gradient border */}
                  <div className="relative aspect-[3/4] w-[200px] sm:w-[240px] lg:w-[300px] xl:w-[340px] rounded-2xl p-[2px] bg-gradient-to-br from-cyber-neon-cyan via-cyber-neon-magenta to-cyber-brand-500 shadow-[0_0_20px_rgba(0,255,255,0.2),0_0_40px_rgba(255,0,255,0.15)]">
                    <div className="relative h-full w-full overflow-hidden rounded-[13px] bg-cyber-gray-900">
                      <Image
                        src={`/professional/${pro.slug}.jpg`}
                        alt={pro.name}
                        width={680}
                        height={907}
                        sizes="(min-width: 1280px) 340px, (min-width: 1024px) 300px, (min-width: 640px) 240px, 200px"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%230a0f1a'/%3E%3C/svg%3E"
                        className="h-full w-full object-cover"
                        priority
                      />

                      {/* Subtle scanlines */}
                      <ScanLinesOverlay intensity="subtle" />

                      {/* Subtle inner vignette */}
                      <div
                        className="absolute inset-0 rounded-[14px] pointer-events-none"
                        style={{
                          boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)",
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Decorative accent lines */}
                  <div
                    className="absolute -right-4 top-1/4 h-16 w-0.5 rounded-full bg-gradient-to-b from-cyber-neon-cyan/60 via-cyber-neon-magenta/40 to-transparent"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -left-4 bottom-1/4 h-14 w-0.5 rounded-full bg-gradient-to-t from-cyber-neon-cyan/60 via-cyber-brand-500/40 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <div className="scroll-mouse opacity-60" />
            <span className="text-xs uppercase tracking-widest text-cyber-gray-400">
              Scroll
            </span>
          </div>
        </section>

        {/* ============================================
            VIDEO SECTION - Holographic Frame
            ============================================ */}
        {youtubeId && (
          <section className="relative py-24 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-cyber-brand-200/20 via-transparent to-cyber-plasma-purple/20"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 data-flow-bg opacity-20"
            />

            <div className="container relative z-10 mx-auto px-6">
              <div className="mx-auto max-w-4xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber-neon-cyan/40 bg-cyber-gray-900/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-neon-cyan backdrop-blur-md">
                  <Icon icon="heroicons:play-circle" width={18} />
                  Behind the Scenes
                </span>
                <h2 className="mt-6 font-display text-3xl text-white md:text-4xl lg:text-5xl">
                  Watch{" "}
                  <span className="text-glow-gradient">{pro.name}</span> in
                  Action
                </h2>
                <p className="mt-4 text-base text-cyber-gray-300 md:text-lg max-w-2xl mx-auto">
                  Discover how immersive 3D capture comes to life with exclusive
                  production footage and commentary.
                </p>
              </div>

              <div className="mx-auto mt-12 max-w-5xl">
                <div className="relative holographic-frame rounded-2xl p-1 bg-cyber-gray-900/80">
                  {/* Corner decorations */}
                  <span className="cyber-corner-tl" aria-hidden="true" />
                  <span className="cyber-corner-tr" aria-hidden="true" />
                  <span className="cyber-corner-bl" aria-hidden="true" />
                  <span className="cyber-corner-br" aria-hidden="true" />

                  <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                    <YouTubePlayer
                      videoId={youtubeId}
                      title={`${pro.name} behind the scenes video`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================
            PORTFOLIO SECTION - Masonry Grid
            ============================================ */}
        <section id="tours" className="relative py-24 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/10 to-cyber-gray-900"
          />

          <div className="container relative z-10 mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-neon-cyan/40 bg-cyber-gray-900/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-neon-cyan backdrop-blur-md">
                <Icon icon="heroicons:cube" width={18} />
                Portfolio
              </span>
              <h2 className="mt-6 font-display text-3xl text-white md:text-4xl lg:text-5xl">
                Selected{" "}
                <span className="text-glow-gradient">3D Tours</span>
              </h2>
              <p className="mt-4 text-base text-cyber-gray-300 md:text-lg max-w-2xl mx-auto">
                Explore signature captures, storytelling walkthroughs, and
                photoreal virtual spaces crafted for clients worldwide.
              </p>
            </div>

            <div className="mt-16">
              <ToursGrid tours={tourCards} />
            </div>
          </div>
        </section>

        {/* ============================================
            ABOUT SECTION - Quote Card Style
            ============================================ */}
        {pro.aboutTheCreator && (
          <section className="relative py-24 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/15 to-cyber-gray-900"
            />

            <div className="container relative z-10 mx-auto px-6">
              <div className="mx-auto max-w-4xl text-center mb-12">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber-neon-cyan/40 bg-cyber-gray-900/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-neon-cyan backdrop-blur-md">
                  <Icon icon="heroicons:user" width={18} />
                  About the Creator
                </span>
                <h2 className="mt-6 font-display text-3xl text-white md:text-4xl lg:text-5xl">
                  Inside{" "}
                  <span className="text-glow-gradient">{pro.name}'s</span>{" "}
                  Practice
                </h2>
              </div>

              {/* Quote Card - Glassmorphism Style */}
              <div className="mx-auto max-w-5xl relative">
                {/* Gradient border wrapper */}
                <div className="p-[2px] rounded-3xl bg-gradient-to-br from-cyber-neon-cyan/60 via-cyber-neon-magenta/40 to-cyber-brand-500/50 shadow-[0_0_40px_rgba(0,255,255,0.1),0_0_80px_rgba(255,0,255,0.05)]">
                  <div className="relative rounded-[22px] bg-cyber-gray-900/90 backdrop-blur-md px-12 py-16 md:px-20 md:py-24 lg:px-28 lg:py-28 overflow-hidden">
                    {/* Opening quote - top left */}
                    <div className="absolute top-8 left-8 md:top-12 md:left-14 lg:top-14 lg:left-16">
                      <Icon
                        icon="ri:double-quotes-l"
                        width={72}
                        className="text-cyber-neon-cyan/25"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Quote content */}
                    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose text-cyber-gray-100 text-center px-6 md:px-16 lg:px-20 relative z-10">
                      {pro.aboutTheCreator}
                    </p>

                    {/* Closing quote - bottom right */}
                    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-14 lg:bottom-14 lg:right-16">
                      <Icon
                        icon="ri:double-quotes-r"
                        width={72}
                        className="text-cyber-neon-magenta/25"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Subtle scanlines overlay */}
                    <ScanLinesOverlay intensity="subtle" />
                  </div>
                </div>

                {/* Blog article link */}
                {blogArticle && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-xl border border-cyber-neon-cyan/20 bg-cyber-gray-900/60 backdrop-blur-sm px-6 py-5">
                    <div className="flex items-center gap-3 text-sm text-cyber-gray-300">
                      <Icon
                        icon="ri:article-line"
                        width={20}
                        className="text-cyber-neon-cyan"
                      />
                      <span>Featured interview on Realsee Creator Stories</span>
                    </div>
                    <Link
                      href={blogArticle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm cyber-btn-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                    >
                      <Icon
                        icon="heroicons:book-open"
                        width={16}
                        className="text-white"
                      />
                      Read Full Article
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ============================================
            CTA SECTION
            ============================================ */}
        <section className="relative py-24 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/25 to-cyber-gray-900"
          />
          <div aria-hidden="true" className="absolute inset-0 opacity-40">
            <div className="cyber-grid h-full w-full" />
          </div>
          <div className="container relative z-10 mx-auto px-6">
            <JoinCTA variant="contact" professionalName={pro.name} />
          </div>
        </section>
      </main>
    </>
  );
}

function categoryIconMap(category: string): string {
  const value = category.toLowerCase();
  if (
    value.includes("residential") ||
    value.includes("house") ||
    value.includes("home")
  )
    return "heroicons:home";
  if (value.includes("industrial") || value.includes("factory"))
    return "heroicons:building-office-2";
  if (value.includes("exhibition")) return "heroicons:photo";
  if (value.includes("showroom")) return "heroicons:sparkles";
  if (value.includes("museum")) return "heroicons:building-library";
  if (value.includes("office")) return "heroicons:building-office";
  if (value.includes("restaurant")) return "heroicons:building-storefront";
  if (value.includes("studio")) return "heroicons:video-camera";
  if (value.includes("church")) return "mdi:church";
  if (value.includes("gym")) return "mdi:dumbbell";
  if (value.includes("aerial")) return "heroicons:paper-airplane";
  if (value.includes("outdoor") || value.includes("outside"))
    return "heroicons:globe-alt";
  return "heroicons:tag";
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getTwitterHandle(raw?: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith("@")) return value;
  try {
    const url = value.startsWith("http")
      ? new URL(value)
      : new URL(`https://x.com/${value}`);
    const handle = url.pathname
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean)
      .pop();
    return handle ? `@${handle}` : null;
  } catch {
    return `@${value.replace(/^@/, "")}`;
  }
}
