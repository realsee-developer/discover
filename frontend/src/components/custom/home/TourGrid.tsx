import { Icon } from "@iconify/react";
import { getVrs, resolvePublicAssetPath } from "@/data/db";

export function TourGrid() {
  const vrs = getVrs().slice(0, 12);
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
    if (d.includes("galois") || d.includes("伽罗华")) return "mdi:laser-pointer"; // 激光扫描仪
    if (d.includes("pano to 3d") || d.includes("panorama") || d.includes("全景")) return "mdi:panorama-variant"; // 全景转VR
    return "heroicons:camera";
  };

  return (
    <section className="tour-gallery-section relative overflow-hidden py-16 bg-gradient-to-b from-base-200 to-base-200/60">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-base-content md:text-4xl">
              Explore More 3D Tours
            </h2>
            <p className="mt-2 max-w-2xl text-base text-base-content/70">
              Dive into a hand‑picked collection of interactive spaces across categories and devices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/search" className="btn btn-primary shadow-md shadow-primary/20">
              View All Tours
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vrs.map((vr) => (
            <a
              key={vr.id}
              href={vr.url}
              target="_blank"
              rel="noreferrer"
              className="relative block overflow-hidden rounded-2xl border border-base-300/40 bg-base-100/40 shadow-lg ring-0 transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
            >
              <figure className="relative m-0 overflow-hidden">
                <img
                  src={resolvePublicAssetPath(vr.assetCover || vr.cover) || vr.remoteCover || "/file.svg"}
                  alt={vr.title || vr.id}
                  className="h-48 w-full object-cover transition-transform duration-[5000ms] ease-out will-change-transform group-hover:scale-110 motion-reduce:transform-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-content/80 via-base-content/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {vr.shortCategory || vr.category ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-3 py-1.5 text-sm text-primary-content shadow-sm ring-1 ring-primary/40 backdrop-blur">
                      <Icon icon={getCategoryIcon(vr.shortCategory || vr.category || "")} width={16} /> {vr.shortCategory || vr.category}
                    </span>
                  ) : null}
                  {vr.device ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white shadow-sm backdrop-blur">
                      <Icon icon={getDeviceIcon(vr.device)} width={16} /> {vr.device}
                    </span>
                  ) : null}
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur transition">
                    <Icon icon="heroicons:play" width={16} />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 pr-20 text-white md:p-4 md:pr-24">
                  <h3 className="line-clamp-2 text-sm font-semibold drop-shadow-md md:text-base">
                    {vr.title || vr.id}
                  </h3>
                </div>
              </figure>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


