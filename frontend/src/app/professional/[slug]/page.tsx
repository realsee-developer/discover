export {}
import type { Metadata } from "next";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Icon } from "@iconify/react";
import {
  getProfessionalBySlug,
  getProfessionals,
  getVrById,
  resolvePublicAssetPath,
} from "@/data/db";
import { DeviceIcon } from "@/lib/badge-utils";
import { HeroRotatingBg } from "./HeroRotatingBg";
import { ProfileAvatar } from "./ProfileAvatar";
import { ToursGrid, type TourCardData } from "./ToursGrid";

type SocialKey = "linkedin" | "instagram" | "facebook" | "youtube" | "vimeo" | "blogArticle";

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
            <Icon icon="heroicons:user" width={36} className="text-cyber-gray-500" />
          </div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Professional Not Found</h1>
          <p className="max-w-xl text-sm text-cyber-gray-400 md:text-base">
            The professional profile you are looking for does not exist or may have been moved.
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

  const hasWebsite = pro.Website && pro.Website !== "/" && pro.Website !== "";
  const heroImages = tours
    .map((t) => resolvePublicAssetPath(t.assetCover || t.cover) || t.remoteCover)
    .filter((s): s is string => Boolean(s));

  const categoryIconMap = (category: string): string => {
    const value = (category || "").toLowerCase();
    if (value.includes("residential") || value.includes("house") || value.includes("home")) return "heroicons:home";
    if (value.includes("industrial") || value.includes("factory")) return "heroicons:building-office-2";
    if (value.includes("exhibition")) return "heroicons:photo";
    if (value.includes("showroom")) return "heroicons:sparkles";
    if (value.includes("museum")) return "heroicons:building-library";
    if (value.includes("office")) return "heroicons:building-office";
    if (value.includes("restaurant")) return "heroicons:building-storefront";
    if (value.includes("studio")) return "heroicons:video-camera";
    if (value.includes("church")) return "mdi:church";
    if (value.includes("gym")) return "mdi:dumbbell";
    if (value.includes("aerial")) return "heroicons:paper-airplane";
    if (value.includes("outdoor") || value.includes("outside")) return "heroicons:globe-alt";
    return "heroicons:tag";
  };

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeId = pro.behindScenesVideo ? extractYouTubeId(pro.behindScenesVideo) : null;
  const proRecord = pro as Record<string, string | undefined>;
  const socialConfigs: Array<{
    key: SocialKey;
    icon: string;
    label: string;
    description: string;
    iconClass: string;
    extraClass?: string;
  }> = [
    {
      key: "linkedin",
      icon: "mdi:linkedin",
      label: "LinkedIn",
      description: "Professional Network",
      iconClass: "bg-cyber-brand-600/20 text-cyber-brand-100 group-hover:bg-cyber-brand-600/30",
    },
    {
      key: "instagram",
      icon: "mdi:instagram",
      label: "Instagram",
      description: "Visual Portfolio",
      iconClass: "bg-cyber-plasma-purple/20 text-cyber-plasma-purple group-hover:bg-cyber-plasma-purple/30",
    },
    {
      key: "facebook",
      icon: "mdi:facebook",
      label: "Facebook",
      description: "Social Updates",
      iconClass: "bg-cyber-electric-blue/20 text-cyber-electric-blue group-hover:bg-cyber-electric-blue/30",
    },
    {
      key: "youtube",
      icon: "mdi:youtube",
      label: "YouTube",
      description: "Video Content",
      iconClass: "bg-red-500/20 text-red-400 group-hover:bg-red-500/30",
    },
    {
      key: "vimeo",
      icon: "mdi:vimeo",
      label: "Vimeo",
      description: "Pro Videos",
      iconClass: "bg-cyber-brand-600/20 text-cyber-brand-100 group-hover:bg-cyber-brand-600/30",
    },
    {
      key: "blogArticle",
      icon: "heroicons:document-text",
      label: "Featured Article",
      description: "Read the full story",
      iconClass: "bg-cyber-plasma-purple/20 text-cyber-plasma-purple group-hover:bg-cyber-plasma-purple/30",
      extraClass: "sm:col-span-2",
    },
  ];

  const socialEntries = socialConfigs
    .map((config) => {
      const value = proRecord[config.key];
      if (!value) return null;
      return { ...config, value };
    })
    .filter(Boolean) as Array<(typeof socialConfigs)[number] & { value: string }>;

  const quickStats = (
    projects: number,
    location: string | undefined,
  ): Array<{ icon: string; label: string; value: string }> => [
    {
      icon: "heroicons:cube",
      label: "Projects Delivered",
      value: projects.toString().padStart(2, "0"),
    },
    {
      icon: "heroicons:globe-alt",
      label: "Availability",
      value: location ? `Based in ${location}` : "Worldwide",
    },
    {
      icon: "heroicons:clock",
      label: "Avg Response",
      value: "24h",
    },
  ];

  const stats = quickStats(tours.length, pro.Location);
  const capabilityHighlights = [
    {
      icon: "heroicons:camera",
      title: "Capture",
      description: "Immersive 3D scans and cinematic imagery.",
    },
    {
      icon: "heroicons:cube-transparent",
      title: "Modeling",
      description: "Accurate meshes, point clouds, and floor plans.",
    },
    {
      icon: "heroicons:sparkles",
      title: "Presentation",
      description: "Guided tours with interactive storytelling layers.",
    },
  ];



  return (
    <main className="main-content-wrapper flex-1 bg-cyber-gray-900 text-cyber-gray-200">
      <section className="relative isolate overflow-hidden py-24 md:py-32">
        {heroImages.length ? (
          <HeroRotatingBg images={heroImages} />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-cyber-gray-900" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(85,119,255,0.2),transparent_55%),radial-gradient(circle_at_80%_15%,rgba(0,255,255,0.15),transparent_45%),radial-gradient(circle_at_55%_82%,rgba(138,43,226,0.15),transparent_55%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 opacity-30">
          <div className="cyber-grid h-full w-full" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] xl:gap-16">
            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-cyber-gray-500">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/40 bg-cyber-gray-900/60 px-4 py-1 text-[0.75rem] font-semibold text-cyber-brand-200">
                  <Icon icon="heroicons:sparkles" width={16} />
                  Realsee Creator
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber-neon-cyan/30 bg-cyber-gray-900/50 px-4 py-1 text-[0.75rem] font-semibold text-cyber-neon-cyan">
                  <Icon icon="heroicons:shield-check" width={16} />
                  Verified Pro
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-4xl leading-tight text-white md:text-6xl xl:text-7xl">
                  {pro.name}
                </h1>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-300/40 bg-cyber-brand-600/20 px-5 py-2 text-sm font-semibold text-cyber-brand-100 shadow-[0_0_25px_rgba(85,119,255,0.25)]">
                  <Icon icon="heroicons:camera" width={20} className="text-cyber-brand-200" />
                  3D Professional Photographer
                </div>
                {pro.shortBio ? (
                  <p className="max-w-3xl text-base leading-relaxed text-cyber-gray-200 md:text-lg">
                    {pro.shortBio}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-cyber-brand-400/25 bg-cyber-gray-900/60 px-5 py-4 shadow-lg shadow-cyber-brand-500/10"
                  >
                    <div className="flex items-center gap-3 text-sm font-medium text-cyber-gray-400">
                      <Icon icon={stat.icon} width={18} className="text-cyber-brand-300" />
                      {stat.label}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white md:text-xl">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
                  className="btn cyber-btn-primary px-8 py-3 text-base font-semibold uppercase tracking-[0.15em]"
                >
                  <Icon icon="heroicons:chat-bubble-left-right" width={20} />
                  Contact for Collaboration
                </a>
                <button className="btn btn-outline border-cyber-brand-400/40 bg-cyber-gray-900/40 px-8 py-3 text-base font-semibold text-cyber-gray-100 hover:border-cyber-brand-300 hover:bg-cyber-brand-600/15">
                  <Icon icon="heroicons:heart" width={20} className="text-cyber-brand-200" />
                  Follow
                </button>
                {hasWebsite ? (
                  <a
                    href={pro.Website!.startsWith("http") ? pro.Website! : `https://${pro.Website}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyber-brand-200 hover:text-cyber-brand-100"
                  >
                    <Icon icon="heroicons:arrow-top-right-on-square" width={16} />
                    Visit Portfolio
                  </a>
                ) : null}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-12 rounded-[3rem] bg-gradient-to-br from-cyber-brand-500/25 via-cyber-neon-cyan/20 to-cyber-plasma-purple/25 blur-3xl"
              />
              <div className="relative rounded-[2.5rem] border border-cyber-brand-300/40 bg-cyber-gray-900/70 p-10 shadow-[0_35px_70px_-25px_rgba(15,23,42,0.85)] backdrop-blur-xl">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-brand-500 to-cyber-neon-cyan blur-2xl opacity-60"
                    />
                    <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-cyber-gray-900 shadow-[0_0_35px_rgba(85,119,255,0.45)]">
                      <ProfileAvatar professionalId={pro.id} name={pro.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyber-neon-green to-cyber-brand-600 text-xs font-bold text-cyber-gray-900 shadow-lg">
                      <Icon icon="heroicons:shield-check" width={18} />
                    </div>
                  </div>

                  {pro.Location ? (
                    <div className="flex items-center gap-2 text-sm text-cyber-gray-200">
                      <Icon icon="heroicons:map-pin" width={18} className="text-cyber-brand-200" />
                      {pro.Location}
                    </div>
                  ) : null}

                  <div className="grid w-full gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 px-4 py-3 text-left">
                      <div className="text-xs uppercase tracking-[0.2em] text-cyber-gray-500">Focus</div>
                      <div className="mt-1 text-sm font-semibold text-cyber-gray-100">Immersive Virtual Tours</div>
                    </div>
                    <div className="rounded-xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 px-4 py-3 text-left">
                      <div className="text-xs uppercase tracking-[0.2em] text-cyber-gray-500">Services</div>
                      <div className="mt-1 text-sm font-semibold text-cyber-gray-100">Capture · Modeling · Delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-gray-900 to-cyber-gray-900" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-5xl text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
              <Icon icon="heroicons:identification" width={18} />
              Professional Details
            </span>
            <h2 className="mt-6 font-display text-3xl text-white md:text-4xl">Connect with {pro.name}</h2>
            <p className="mt-3 text-base text-cyber-gray-300 md:text-lg">
              Reach out directly for collaborations, commissions, and immersive virtual tour projects.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/70 p-8 shadow-lg shadow-cyber-brand-500/10">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                  <Icon icon="heroicons:phone" width={24} className="text-cyber-brand-200" />
                  Contact Information
                </h3>
                <div className="mt-6 space-y-4">
                  {pro.Location ? (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(pro.Location)}`}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center gap-3 rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/50 px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-cyber-brand-300 hover:bg-cyber-brand-600/15 hover:shadow-lg hover:shadow-cyber-brand-500/20"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-brand-600/20 text-cyber-brand-100 transition-all duration-200 group-hover:scale-105 group-hover:bg-cyber-brand-600/30">
                        <Icon icon="heroicons:map-pin" width={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">Location</div>
                        <div className="text-sm text-cyber-gray-300">{pro.Location}</div>
                      </div>
                      <Icon icon="heroicons:arrow-top-right-on-square" width={16} className="text-cyber-brand-200" />
                    </a>
                  ) : null}

                  {hasWebsite ? (
                    <a
                      href={pro.Website!.startsWith("http") ? pro.Website! : `https://${pro.Website}`}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center gap-3 rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/50 px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-cyber-brand-300 hover:bg-cyber-brand-600/15 hover:shadow-lg hover:shadow-cyber-brand-500/20"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-neon-cyan/20 text-cyber-neon-cyan transition-all duration-200 group-hover:scale-105 group-hover:bg-cyber-neon-cyan/30">
                        <Icon icon="heroicons:globe-alt" width={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">Website</div>
                        <div className="text-sm text-cyber-gray-300">{pro.Website}</div>
                      </div>
                      <Icon icon="heroicons:arrow-top-right-on-square" width={16} className="text-cyber-neon-cyan" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/70 p-8 shadow-lg shadow-cyber-brand-500/10">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                  <Icon icon="heroicons:share" width={24} className="text-cyber-brand-200" />
                  Social Media & Links
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {socialEntries.map((entry) => (
                    <a
                      key={entry.key}
                      href={entry.value.startsWith("http") ? entry.value : entry.key === "youtube" ? entry.value : `https://${entry.value}`}
                      target="_blank"
                      rel="noopener"
                      className={`group flex items-center gap-3 rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/50 px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-cyber-brand-300 hover:bg-cyber-brand-600/15 hover:shadow-lg hover:shadow-cyber-brand-500/20 ${entry.extraClass ?? ""}`.trim()}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110 ${entry.iconClass}`.trim()}
                      >
                        <Icon icon={entry.icon} width={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white">{entry.label}</div>
                        <div className="text-xs text-cyber-gray-400">{entry.description}</div>
                      </div>
                    </a>
                  ))}
                  {!socialEntries.length ? (
                    <div className="col-span-full rounded-2xl border border-cyber-brand-300/30 bg-cyber-gray-900/60 px-6 py-10 text-center text-cyber-gray-400">
                      <Icon icon="heroicons:link-slash" width={40} className="mx-auto mb-4 text-cyber-gray-500" />
                      <p>No social media links available</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              {
                icon: "heroicons:cube",
                label: "Total Projects",
                value: tours.length,
              },
              {
                icon: "heroicons:check-badge",
                label: "Verified Status",
                value: "Pro",
              },
              {
                icon: "heroicons:star",
                label: "Quality Rating",
                value: "5.0",
              },
              {
                icon: "heroicons:clock",
                label: "Response Time",
                value: "24h",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 p-6 text-center shadow-lg shadow-cyber-brand-500/10"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-brand-600/20 text-cyber-brand-100">
                  <Icon icon={item.icon} width={24} />
                </div>
                <div className="mt-3 text-2xl font-bold text-white">
                  {typeof item.value === "number" ? item.value : item.value}
                </div>
                <div className="text-sm text-cyber-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {youtubeId ? (
        <section className="relative py-24">
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-cyber-brand-200/20 via-transparent to-cyber-plasma-purple/20" />
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
                Get an inside look at professional 3D photography techniques and immersive virtual space creation.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="relative overflow-hidden rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/80 p-2 shadow-[0_45px_85px_-35px_rgba(15,23,42,0.9)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-y-10 scale-110 bg-gradient-to-r from-cyber-brand-500/25 via-cyber-neon-cyan/15 to-cyber-plasma-purple/25 blur-3xl"
                />
                <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-cyber-brand-400/20 bg-black">
                  <YouTubeEmbed videoid={youtubeId} height={500} params="modestbranding=1&rel=0&autoplay=0&controls=1" />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/15 to-cyber-gray-900" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
              <Icon icon="heroicons:cube" width={20} />
              3D Portfolio
            </span>
            <h2 className="mt-6 font-display text-4xl text-white md:text-5xl">
              Exceptional Work by {pro.name}
            </h2>
            <p className="mt-4 text-lg text-cyber-gray-300 md:text-xl">
              Explore professional-grade 3D virtual tours and experience the digital transformation of real spaces.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-brand-100">{tours.length}</div>
                <div className="text-cyber-gray-400">Total Projects</div>
              </div>
              <div className="h-8 w-px bg-cyber-brand-400/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-brand-100">Pro</div>
                <div className="text-cyber-gray-400">Quality Assured</div>
              </div>
            </div>
          </div>

          {tours.length ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour, index) => (
                <a
                  key={tour.id}
                  href={tour.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/70 shadow-lg shadow-cyber-brand-500/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-35px_rgba(15,23,42,0.8)]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={resolvePublicAssetPath(tour.assetCover || tour.cover) || tour.remoteCover || "/cover/placeholder.jpg"}
                        alt={tour.title || tour.id}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {tour.shortCategory ? (
                        <div className="absolute top-3 left-3">
                          <div className="badge badge-primary badge-sm gap-1">
                            <Icon icon={categoryIconMap(tour.shortCategory)} width={12} />
                            <span>{tour.shortCategory}</span>
                          </div>
                        </div>
                      ) : null}
                      {tour.device ? (
                        <div className="absolute top-3 right-3">
                          <div className="badge badge-neutral badge-sm gap-1.5">
                            <DeviceIcon device={tour.device} width={14} />
                            <span className="font-medium text-xs">{tour.device}</span>
                          </div>
                        </div>
                      ) : null}
                      <div className="pointer-events-none absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-brand-600 text-white shadow-lg">
                          <Icon icon="heroicons:play" width={16} className="ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-cyber-brand-100">
                          {tour.title || "Untitled Tour"}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-cyber-gray-300">
                        {tour.description || "Click to explore this space in an immersive 3D virtual tour."}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-cyber-brand-400/10 pt-3 text-xs text-cyber-gray-400">
                        <div className="flex items-center gap-2">
                          <Icon icon="heroicons:eye" width={14} />
                          <span>3D Virtual Tour</span>
                        </div>
                        <span>Click to Explore</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 text-cyber-brand-100">
                <Icon icon="heroicons:cube" width={32} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">No Projects Yet</h3>
              <p className="text-cyber-gray-400">This photographer hasn't uploaded any 3D projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {pro.aboutTheCreator ? (
        <section className="relative py-24">
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/20 to-cyber-gray-900" />
          <div className="container relative z-10 mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
                <Icon icon="heroicons:user" width={18} />
                Professional Background
              </span>
              <h2 className="mt-6 font-display text-3xl text-white md:text-4xl">About {pro.name}</h2>
              <p className="mt-3 text-base text-cyber-gray-300 md:text-lg">
                Learn about this professional photographer's journey, expertise, and creative vision.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="relative overflow-hidden rounded-3xl border border-cyber-brand-300/30 bg-cyber-gray-900/70 p-10 shadow-[0_45px_90px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyber-brand-500/15 via-transparent to-cyber-neon-cyan/20 blur-2xl opacity-70"
                />
                <div className="relative text-left text-lg leading-relaxed text-cyber-gray-200 whitespace-pre-line">
                  {pro.aboutTheCreator}
                </div>
                <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {capabilityHighlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 p-6 text-center"
                    >
                      <Icon icon={highlight.icon} width={32} className="mx-auto text-cyber-brand-200" />
                      <h3 className="mt-3 font-semibold text-white">{highlight.title}</h3>
                      <p className="mt-2 text-sm text-cyber-gray-400">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-cyber-gray-900 via-cyber-brand-200/25 to-cyber-gray-900" />
        <div aria-hidden="true" className="absolute inset-0 opacity-40">
          <div className="cyber-grid h-full w-full" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
              <Icon icon="heroicons:handshake" width={18} />
              Start Collaboration
            </span>
            <h2 className="mt-6 font-display text-4xl text-white md:text-5xl">
              Ready to Work with {pro.name}?
            </h2>
            <p className="mt-4 text-lg text-cyber-gray-300 md:text-xl">
              Empower your spaces with professional 3D technology and create immersive experiences that stand out.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: "heroicons:lightning-bolt",
                title: "Quick Response",
                description: "Professional team responds within 24 hours.",
              },
              {
                icon: "heroicons:star",
                title: "Professional Quality",
                description: "Industry-leading 3D capture and modeling technology.",
              },
              {
                icon: "heroicons:shield-check",
                title: "Quality Guarantee",
                description: "Satisfaction promise with dedicated support.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-cyber-brand-400/20 bg-cyber-gray-900/60 p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-cyber-brand-300"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyber-brand-600/20 text-cyber-brand-100">
                  <Icon icon={card.icon} width={28} />
                </div>
                <h3 className="mt-4 font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-cyber-gray-400">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
              className="btn cyber-btn-primary px-10 py-4 text-lg font-semibold uppercase tracking-[0.2em]"
            >
              <Icon icon="heroicons:chat-bubble-left-right" width={22} />
              Contact for Collaboration
            </a>
            <div className="flex items-center gap-6 text-sm text-cyber-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-brand-100">2hrs</div>
                <div>Avg Response</div>
              </div>
              <div className="h-8 w-px bg-cyber-brand-400/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-brand-100">98%</div>
                <div>Client Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.35em] text-cyber-gray-500">
            <div className="flex items-center gap-2">
              <Icon icon="heroicons:shield-check" width={16} />
              ISO Certified
            </div>
            <div className="h-4 w-px bg-cyber-brand-400/30" />
            <div className="flex items-center gap-2">
              <Icon icon="heroicons:star" width={16} />
              5-Star Service
            </div>
            <div className="h-4 w-px bg-cyber-brand-400/30" />
            <div className="flex items-center gap-2">
              <Icon icon="heroicons:clock" width={16} />
              24/7 Support
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
