export {};

import type { Metadata } from "next";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Icon } from "@iconify/react";

import {
  getProfessionalBySlug,
  getProfessionals,
  getVrById,
  resolvePublicAssetPath,
} from "@/data/db";
import { HeroRotatingBg } from "./HeroRotatingBg";
import { ProfileAvatar } from "./ProfileAvatar";
import { ToursGrid, type TourCardData } from "./ToursGrid";
import { JoinCTA } from "@/components/custom/home/JoinCTA";

type SocialKey = "linkedin" | "instagram" | "facebook" | "youtube" | "vimeo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  const title = pro
    ? `${pro.name} - Professional 3D Photographer | Realsee Creator`
    : "Professional 3D Photographer | Realsee";
  const description =
    pro?.shortBio ||
    "Discover talented Realsee professionals and their stunning immersive 3D virtual tours and digital twins.";
  return {
    title,
    description,
    keywords: pro
      ? `${pro.name}, 3D photography, virtual tours, Realsee, ${
          pro.Location || ""
        }, digital twins`
      : "3D photography, virtual tours, Realsee professionals",
    openGraph: {
      title,
      description,
      type: "profile",
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
          <a
            href="/search"
            className="btn cyber-btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            <Icon icon="heroicons:magnifying-glass" width={18} />
            Browse All Professionals
          </a>
        </section>
      </main>
    );
  }

  const tours = (pro.vrIds || [])
    .map((id) => getVrById(id))
    .filter((v): v is NonNullable<ReturnType<typeof getVrById>> => Boolean(v));

  const hasWebsite = Boolean(pro.Website && pro.Website !== "/");
  const heroImages = tours
    .map(
      (t) => resolvePublicAssetPath(t.assetCover || t.cover) || t.remoteCover
    )
    .filter((s): s is string => Boolean(s));

  const proRecord = pro as Record<string, string | undefined>;
  const socialConfigs: Array<{
    key: SocialKey;
    icon: string;
    label: string;
    iconClass: string;
  }> = [
    {
      key: "linkedin",
      icon: "mdi:linkedin",
      label: "LinkedIn",
      iconClass: "bg-cyber-brand-600/20 text-cyber-brand-100",
    },
    {
      key: "instagram",
      icon: "mdi:instagram",
      label: "Instagram",
      iconClass: "bg-cyber-plasma-purple/20 text-cyber-plasma-purple",
    },
    {
      key: "facebook",
      icon: "mdi:facebook",
      label: "Facebook",
      iconClass: "bg-cyber-electric-blue/20 text-cyber-electric-blue",
    },
    {
      key: "youtube",
      icon: "mdi:youtube",
      label: "YouTube",
      iconClass: "bg-cyber-neon-magenta/20 text-cyber-neon-magenta",
    },
    {
      key: "vimeo",
      icon: "mdi:vimeo",
      label: "Vimeo",
      iconClass: "bg-cyber-brand-600/20 text-cyber-brand-100",
    },
  ];

  type SocialLink = {
    key: SocialKey | "website";
    icon: string;
    label: string;
    iconClass: string;
    value: string;
  };

  const socialLinks: SocialLink[] = [];

  if (hasWebsite) {
    socialLinks.push({
      key: "website",
      icon: "heroicons:globe-alt",
      label: "Website",
      iconClass: "bg-cyber-brand-600/20 text-cyber-brand-100",
      value: pro.Website!.startsWith("http") ? pro.Website! : `https://${pro.Website}`,
    });
  }

  for (const config of socialConfigs) {
    const value = proRecord[config.key];
    if (!value) continue;
    socialLinks.push({ ...config, value });
  }

  const youtubeId = pro.behindScenesVideo
    ? extractYouTubeId(pro.behindScenesVideo)
    : null;
  const blogArticle = proRecord.blogArticle;

  const heroStats: Array<{ icon: string; label: string; value: string }> = [
    {
      icon: "heroicons:globe-alt",
      label: "Location",
      value: pro.Location ? pro.Location : "Worldwide",
    },
  ];

  const tourCards: TourCardData[] = tours.map((tour) => ({
    id: tour.id,
    title: tour.title || "Untitled Tour",
    url: tour.url || "#",
    shortCategory: tour.shortCategory || undefined,
    device: tour.device || undefined,
    cover:
      resolvePublicAssetPath(tour.assetCover || tour.cover) ||
      tour.remoteCover ||
      "/cover/placeholder.jpg",
    categoryIcon: tour.shortCategory
      ? categoryIconMap(tour.shortCategory)
      : undefined,
  }));

  const contactHref =
    "https://home.realsee.ai/en/contact-us-join-realsee-creators-center";
  const contactLabel = `Contact ${pro.name} via Realsee`;

  return (
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
          className="absolute inset-0 -z-10 bg-gradient-to-b from-cyber-gray-900/80 via-cyber-gray-900/70 to-cyber-gray-900"
        />
        <div className="container relative z-10 mx-auto grid gap-12 px-6 py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-cyber-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-1 text-[0.75rem] font-semibold text-cyber-brand-200">
                  <Icon icon="heroicons:sparkles" width={16} />
                  Realsee Creator
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber-neon-cyan/30 bg-cyber-gray-900/50 px-4 py-1 text-[0.75rem] font-semibold text-cyber-neon-cyan">
                  <Icon icon="heroicons:shield-check" width={16} />
                  Verified Pro
                </span>
              </div>

            <div className="space-y-5">
              <h1 className="font-display text-4xl tracking-tight text-white md:text-6xl xl:text-7xl">
                  {pro.name}
                </h1>
                {pro.shortBio ? (
                  <p className="max-w-3xl text-base leading-relaxed text-cyber-gray-200 md:text-lg">
                    {pro.shortBio}
                  </p>
                ) : null}
              </div>

            {socialLinks.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((entry) => (
                  <a
                    key={entry.key}
                    href={
                      entry.value.startsWith("http")
                        ? entry.value
                        : `https://${entry.value}`
                    }
                    target="_blank"
                    rel="noopener"
                    className={`group inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/20 bg-cyber-gray-900/60 px-4 py-2 text-sm font-medium text-cyber-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyber-brand-300 hover:bg-cyber-brand-600/10 ${entry.iconClass}`}
                  >
                    <Icon icon={entry.icon} width={18} />
                    <span>{entry.label}</span>
                  </a>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={contactHref}
                className="btn cyber-btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] md:text-base"
              >
                <Icon icon="heroicons:chat-bubble-left-right" width={20} />
                {contactLabel}
              </a>
              </div>
            </div>

          <aside className="rounded-3xl border border-cyber-brand-400/25 bg-cyber-gray-900/70 p-8 shadow-lg shadow-cyber-brand-500/10 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-cyber-brand-500/30 via-cyber-neon-cyan/25 to-cyber-plasma-purple/25 blur-2xl"
                />
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-cyber-brand-300/40 bg-cyber-gray-900/80 shadow-[0_0_45px_rgba(51,102,255,0.25)]">
                  <ProfileAvatar
                    professionalId={pro.id}
                    name={pro.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <ul className="grid w-full gap-4 text-left sm:grid-cols-3 lg:grid-cols-1">
                {heroStats.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 px-4 py-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyber-gray-500">
                      <Icon
                        icon={item.icon}
                        width={16}
                        className="text-cyber-brand-200"
                      />
                      {item.label}
                      </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
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
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
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
              <div className="relative overflow-hidden rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/80 p-2 shadow-[0_45px_85px_-35px_rgba(15,23,42,0.9)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-y-10 scale-110 bg-gradient-to-r from-cyber-brand-500/25 via-cyber-neon-cyan/15 to-cyber-plasma-purple/25 blur-3xl"
                />
                <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-cyber-brand-400/20 bg-black">
                  <YouTubeEmbed
                    videoid={youtubeId}
                    height={480}
                    params="modestbranding=1&rel=0&autoplay=0&controls=1"
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
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
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
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
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
                      icon="heroicons:document-text"
                      width={20}
                      className="text-cyber-brand-200"
                    />
                    <span>Featured interview on Realsee Creator Stories</span>
                  </div>
                  <a
                    href={blogArticle}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-sm cyber-btn-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                  >
                    <Icon icon="heroicons:book-open" width={16} />
                    Read Full Article
                  </a>
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
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
