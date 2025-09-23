import type { Metadata } from "next";
import { getProfessionalBySlug, getProfessionals, getVrById, resolvePublicAssetPath } from "@/data/db";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Icon } from "@iconify/react";
import { HeroRotatingBg } from "./HeroRotatingBg";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  const title = pro ? `${pro.name} · Realsee Professional` : "Professional · Realsee";
  const description = pro?.shortBio || "Discover Realsee Professionals and their immersive 3D tours.";
  return { title, description };
}

export async function generateStaticParams() {
  return getProfessionals().map((p) => ({ slug: p.slug! }));
}

export default async function ProfessionalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  if (!pro) {
    return (
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold">Professional not found</h1>
        <p className="mt-2 text-base-content/70">The profile you are looking for does not exist.</p>
      </main>
    );
  }

  const tours = (pro.vrIds || [])
    .map((id) => getVrById(id))
    .filter((v): v is NonNullable<ReturnType<typeof getVrById>> => Boolean(v));

  const hasWebsite = pro.Website && pro.Website !== "/";
  const heroImages = tours
    .map((t) => resolvePublicAssetPath(t.assetCover || t.cover) || t.remoteCover)
    .filter((s): s is string => Boolean(s));

  const getCategoryIcon = (category: string): string => {
    const c = (category || "").toLowerCase();
    if (c.includes("residential") || c.includes("house") || c.includes("home")) return "heroicons:home";
    if (c.includes("industrial") || c.includes("factory")) return "heroicons:building-office-2";
    if (c.includes("exhibition")) return "heroicons:photo";
    if (c.includes("showroom")) return "heroicons:sparkles";
    if (c.includes("museum")) return "heroicons:building-library";
    if (c.includes("office")) return "heroicons:building-office";
    if (c.includes("restaurant")) return "heroicons:building-storefront";
    if (c.includes("studio")) return "heroicons:video-camera";
    if (c.includes("church")) return "mdi:church";
    if (c.includes("gym")) return "mdi:dumbbell";
    if (c.includes("aerial")) return "heroicons:paper-airplane";
    if (c.includes("outdoor") || c.includes("outside")) return "heroicons:globe-alt";
    return "heroicons:tag";
  };

  const getDeviceIcon = (device: string): string => {
    const d = (device || "").toLowerCase();
    if (d.includes("galois") || d.includes("伽罗华")) return "mdi:laser-pointer";
    if (d.includes("pano to 3d") || d.includes("panorama") || d.includes("全景")) return "mdi:panorama-variant";
    return "heroicons:camera";
  };

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative min-h-[560px] md:min-h-[700px] py-16 md:py-24 flex items-center">
        {heroImages.length ? <HeroRotatingBg images={heroImages} /> : null}
        <div className="container mx-auto px-6">
          <div className="w-full max-w-5xl mx-auto">
            <div className="rounded-3xl border border-white/30 bg-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl ring-1 ring-white/20 text-base-100">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-xl opacity-60" />
                  <div className="w-32 h-32 rounded-full overflow-hidden border border-white/60 shadow-lg ring-2 ring-white/40">
                    <img src={`/professional/${pro.id}.jpg`} alt={pro.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{pro.name}</h1>
                  {pro.shortBio ? (
                    <p className="text-base md:text-xl text-base-100/90 mb-4">{pro.shortBio}</p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    {pro.Location ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-base-200/70 px-3 py-1 text-sm text-base-content/80 ring-1 ring-base-300/60"><Icon icon="heroicons:map-pin" width={16} className="text-primary" />{pro.Location}</span>
                    ) : null}
                    {hasWebsite ? (
                      <a className="inline-flex items-center gap-1 rounded-full bg-base-200/70 px-3 py-1 text-sm text-base-content/80 ring-1 ring-base-300/60 hover:bg-base-200" href={pro.Website!} target="_blank" rel="noopener">
                        <Icon icon="heroicons:globe-alt" width={16} className="text-primary" />官网
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video (YouTube) */}
      {pro.youtubeId ? (
        <section className="py-12 bg-base-100">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl card bg-base-100 border border-base-300/60 shadow-xl rounded-3xl overflow-hidden">
              <div className="card-body">
                <h3 className="card-title">精选视频</h3>
                <YouTubeEmbed videoid={pro.youtubeId} height={420} params="modestbranding=1&rel=0" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Tours Grid */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <h2 className="mb-6 text-xl md:text-2xl font-bold">Tours by {pro.name}</h2>
          {tours.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((t) => (
                <a
                  key={t.id}
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-3xl border border-base-300/40 bg-base-100 shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-48">
                    <img
                      src={resolvePublicAssetPath(t.assetCover || t.cover) || t.remoteCover || "/cover/placeholder.jpg"}
                      alt={t.title || t.id}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                    {/* category badge removed to keep card minimal; tags shown below */}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base md:text-lg font-semibold">{t.title || "Untitled Tour"}</h3>
                    <p className="mt-1 text-sm text-base-content/70 line-clamp-2">{t.description || "Click to explore the space in 3D Tour."}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      {t.device ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ring-base-300/60 bg-base-200/60">
                          <Icon icon={getDeviceIcon(t.device)} width={14} /> {t.device}
                        </span>
                      ) : null}
                      {t.shortCategory ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-base-100">
                          <Icon icon={getCategoryIcon(t.shortCategory)} width={14} /> {t.shortCategory}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 flex items-center justify-end text-sm">
                      <span className="inline-flex items-center gap-1 text-base-content/60 group-hover:text-primary"><span className="iconify" data-icon="heroicons:arrow-right" data-width="16"></span></span>
                    </div>
                  </div>
                  
                </a>
              ))}
            </div>
          ) : (
            <p className="text-base-content/70">No tours yet.</p>
          )}
        </div>
      </section>

      {/* About */}
      {pro.aboutTheCreator ? (
        <section className="py-16 bg-base-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">关于专业人士</h2>
              <div className="prose prose-lg max-w-none text-base-content whitespace-pre-line">
                {pro.aboutTheCreator}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Contact CTA */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto rounded-3xl border border-base-300/60 bg-base-100/80 p-8 shadow-xl backdrop-blur">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">有兴趣与{pro.name}合作吗？</h2>
            <p className="text-base md:text-lg text-base-content/80 mb-6">
              准备用令人惊叹的3D导览展示您的空间？联系我们讨论您的项目，让您的愿景成为现实。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a className="btn btn-outline btn-lg" href="/contact">
                <span className="iconify" data-icon="heroicons:building-office" data-width="20"></span>
                联系Realsee
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


