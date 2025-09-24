import Image from "next/image";
import { Icon } from "@iconify/react";
import { getVrs, resolvePublicAssetPath } from "@/data/db";
import { getCategoryBadgeClass, getDeviceBadgeClass, getBadgeIcon, DeviceIcon } from "@/lib/badge-utils";

export function TourGrid() {
  const vrs = getVrs().slice(0, 12);

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
              className="tour-card card bg-base-100 group cursor-pointer"
            >
              <figure className="relative overflow-hidden">
                <Image
                  src={(() => {
                    const localSrc = resolvePublicAssetPath(vr.assetCover || vr.cover);
                    const remoteSrc = vr.remoteCover;
                    const fallback = "/placeholder.jpg";
                    return localSrc || remoteSrc || fallback;
                  })()}
                  alt={vr.title || vr.id}
                  width={640}
                  height={384}
                  className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* 左上角的分类徽章 */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 max-w-[calc(100%-6rem)]">
                  {vr.shortCategory || vr.category ? (
                    <div className={`badge ${getCategoryBadgeClass(vr.shortCategory || vr.category || "")} badge-sm gap-1`}>
                      <Icon icon={getBadgeIcon(vr.shortCategory || vr.category || "")} width={12} />
                      <span>{vr.shortCategory || vr.category}</span>
                    </div>
                  ) : null}
                </div>
                
                {/* 右上角的设备信息 */}
                {vr.device ? (
                  <div className="absolute top-3 right-3">
                    <div className={`badge ${getDeviceBadgeClass(vr.device)} badge-sm gap-1.5`}>
                      <DeviceIcon device={vr.device} width={14} />
                      <span className="font-medium text-xs">{vr.device}</span>
                    </div>
                  </div>
                ) : null}

              </figure>
              
              {/* 标题覆盖层 */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                  {vr.title || vr.id}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


