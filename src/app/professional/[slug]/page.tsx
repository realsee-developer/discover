import { Icon } from "@iconify/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JoinCTA } from "@/components/custom/home/JoinCTA";

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
// @next/third-parties 的 YouTubeEmbed 与 lite-youtube-embed 脚本存在兼容问题，
// 在生产构建中会导致复合自定义元素未注册而无法播放。
// 临时使用自定义 iframe 封装以确保交互可靠。
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

  const portraitUrl = pro ? `/professional/${pro.id}.jpg` : defaultImage;

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
      // OpenGraphMetadata 不支持 profile 字段，需移除以通过类型检查
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
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyber-brand-400/40 bg-cyber-gray-900">
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
        pro.Location,
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
    portraitUrl: `/professional/${pro.id}.jpg`,
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

  // Add VideoObject schema if behind-the-scenes video exists
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
      <section className="relative isolate overflow-hidden">
        {heroImages.length ? (
          <HeroRotatingBg images={heroImages} />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-cyber-gray-900"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-cyber-gray-900/30 via-cyber-gray-900/15 to-cyber-gray-900/70"
        />
        <div className="container relative z-10 mx-auto grid justify-items-center gap-12 px-6 py-24 text-center sm:gap-14 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center lg:gap-16 lg:text-left">
          <div className="order-1 flex flex-col items-center justify-center gap-4 text-center lg:order-2 lg:items-start lg:text-left lg:justify-self-start">
            <div className="inline-flex items-center justify-center lg:justify-start">
              <div className="rounded-full bg-gradient-to-r from-cyber-brand-500 via-cyber-neon-cyan to-cyber-neon-magenta p-[1.5px] shadow-[0_0_32px_rgba(51,102,255,0.35)]">
                <div className="flex items-center gap-3 rounded-full bg-cyber-gray-900/85 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyber-gray-100">
                  <Icon
                    icon="heroicons:sparkles"
                    width={16}
                    className="text-cyber-neon-cyan"
                  />
                  Realsee Creator
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyber-gray-800/80 px-2 py-[2px] text-[0.65rem] font-medium text-cyber-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.65)]">
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

            <div className="space-y-4 lg:text-left">
              <h1 className="font-display text-4xl tracking-tight text-white drop-shadow-[0_8px_24px_rgba(7,24,46,0.6)] md:text-6xl xl:text-[4.5rem]">
                {pro.name}
              </h1>
              {pro.shortBio ? (
                <p className="max-w-3xl text-base leading-relaxed text-cyber-gray-100/90 md:text-lg">
                  {pro.shortBio}
                </p>
              ) : null}
              <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:justify-center lg:justify-start">
                {locationMapsUrl ? (
                  <Link
                    href={locationMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-200/30 bg-cyber-gray-900/60 px-4 py-1.5 text-xs font-medium text-cyber-gray-100 shadow-[0_0_18px_rgba(51,102,255,0.18)] transition-colors duration-300 hover:border-cyber-brand-400 hover:text-cyber-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
                    prefetch={false}
                  >
                    <Icon
                      icon="heroicons:map-pin"
                      width={16}
                      className="text-cyber-brand-800"
                    />
                    <span>{pro.Location}</span>
                  </Link>
                ) : null}
                <KudosButton slug={slug} name={pro.name} />
              </div>
            </div>

            {socialLinks.length ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                {socialLinks.map((entry) => {
                  const href = entry.value.startsWith("http")
                    ? entry.value
                    : `https://${entry.value}`;
                  return (
                    <Link
                      key={entry.key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl text-cyber-gray-100 border border-cyber-gray-600/30 bg-cyber-gray-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyber-brand-400 hover:text-cyber-neon-cyan hover:shadow-md hover:shadow-cyber-brand-500/15 focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                      aria-label={
                        entry.key === "website" ? "Website" : entry.key
                      }
                    >
                      <Icon icon={entry.icon} width={20} />
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <div className="relative aspect-[3/4] w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[440px] xl:max-w-[500px] 2xl:max-w-[560px]">
              <Image
                src={`/professional/${pro.id}.jpg`}
                alt={pro.name}
                width={960}
                height={1280}
                sizes="(min-width: 1920px) 520px, (min-width: 1536px) 480px, (min-width: 1280px) 440px, (min-width: 1024px) 380px, (min-width: 640px) 60vw, 85vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%230a0f1a'/%3E%3C/svg%3E"
                className="h-full w-full rounded-[1.25rem] object-cover shadow-[0_40px_120px_-45px_rgba(5,15,35,0.85)]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {youtubeId ? (
        <section className="relative py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-cyber-brand-200/20 via-transparent to-cyber-plasma-purple/20"
          />
          <div className="container relative z-10 mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-200/45 bg-cyber-gray-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-gray-100 drop-shadow-[0_0_12px_rgba(51,102,255,0.35)]">
                <Icon icon="heroicons:play-circle" width={18} />
                Behind the Scenes
              </span>
              <h2 className="mt-6 font-display text-3xl text-white md:text-4xl">
                Watch {pro.name} in Action
              </h2>
              <p className="mt-3 text-base text-cyber-gray-300 md:text-lg">
                Discover how immersive 3D capture comes to life with exclusive
                production footage and commentary.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="relative overflow-hidden rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/80 shadow-[0_45px_85px_-35px_rgba(15,23,42,0.9)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-y-10 scale-110 bg-gradient-to-r from-cyber-brand-500/25 via-cyber-neon-cyan/15 to-cyber-plasma-purple/25 blur-3xl"
                />
                <div className="relative z-10 aspect-video overflow-hidden rounded-[1.75rem] border border-cyber-brand-400/20 bg-black">
                  <YouTubePlayer
                    videoId={youtubeId}
                    title={`${pro.name} behind the scenes video`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="tours" className="relative py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/15 to-cyber-gray-900"
        />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-200/45 bg-cyber-gray-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-gray-100 drop-shadow-[0_0_12px_rgba(51,102,255,0.35)]">
              <Icon icon="heroicons:cube" width={18} />
              Portfolio
            </span>
            <h2 className="mt-6 font-display text-3xl text-white md:text-4xl">
              Selected 3D Tours
            </h2>
            <p className="mt-3 text-base text-cyber-gray-300 md:text-lg">
              Explore signature captures, storytelling walkthroughs, and
              photoreal virtual spaces crafted for clients worldwide.
            </p>
          </div>

          <div className="mt-12">
            <ToursGrid tours={tourCards} />
          </div>
        </div>
      </section>

      {pro.aboutTheCreator ? (
        <section className="relative py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/20 to-cyber-gray-900"
          />
          <div className="container relative z-10 mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-200/45 bg-cyber-gray-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-gray-100 drop-shadow-[0_0_12px_rgba(51,102,255,0.35)]">
                <Icon icon="heroicons:user" width={18} />
                About the Creator
              </span>
              <h2 className="mt-6 font-display text-3xl text-white md:text-4xl">
                Inside {pro.name}'s Practice
              </h2>
              <p className="mt-3 text-base text-cyber-gray-300 md:text-lg">
                Learn more about the craft, mission, and creative process behind
                each immersive experience.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/70 p-10 shadow-[0_45px_90px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl">
              <div className="text-left text-lg leading-relaxed text-cyber-gray-200 whitespace-pre-line">
                {pro.aboutTheCreator}
              </div>
              {blogArticle ? (
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 px-6 py-5">
                  <div className="flex items-center gap-3 text-sm text-cyber-gray-300">
                    <Icon
                      icon="ri:article-line"
                      width={20}
                      className="text-cyber-brand-500"
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
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative py-24">
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
