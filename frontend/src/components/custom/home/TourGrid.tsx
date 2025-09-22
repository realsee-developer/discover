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
    <section className="tour-gallery-section bg-base-200 py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-base-content">Explore More 3D Tours</h2>
          <a href="/search" className="btn btn-primary btn-outline">
            View All Tours
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vrs.map((vr) => (
            <a
              key={vr.id}
              href={vr.url}
              target="_blank"
              rel="noreferrer"
              className="relative block overflow-hidden rounded-xl border border-base-300/40 bg-base-100/5 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <figure className="relative overflow-hidden m-0">
                <img
                  src={resolvePublicAssetPath(vr.assetCover || vr.cover) || vr.remoteCover || "/file.svg"}
                  alt={vr.title || vr.id}
                  className="w-full h-48 object-cover transform-gpu transition-transform duration-[5000ms] ease-out group-hover:scale-110 motion-reduce:transform-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-content/70 via-base-content/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {vr.shortCategory || vr.category ? (
                    <span className="badge badge-primary badge-md text-primary-content border-0 shadow-sm shadow-primary/40 gap-1">
                      <Icon icon={getCategoryIcon(vr.shortCategory || vr.category || "")} width={14} /> {vr.shortCategory || vr.category}
                    </span>
                  ) : null}
                  {vr.device ? (
                    <span className="badge badge-outline badge-md border-white/70 text-base-100/95 gap-1 bg-black/10">
                      <Icon icon={getDeviceIcon(vr.device)} width={14} /> {vr.device}
                    </span>
                  ) : null}
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="badge badge-outline bg-black/40 text-white border-white/50 gap-1 backdrop-blur-sm">
                    <Icon icon="heroicons:play" width={14} /> View
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-white">
                  <h3 className="text-sm md:text-base font-semibold drop-shadow-md line-clamp-2">
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


