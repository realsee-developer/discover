import Image from "next/image";
import { getProfessionals } from "@/data/db";

export function Professionals() {
  const availableIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  
  // 按 tours 数量排序（从多到少）
  const list = getProfessionals()
    .filter((p) => availableIds.has(p.id))
    .sort((a, b) => (b.vrIds || []).length - (a.vrIds || []).length)
    .slice(0, 10);

  // 动态速度计算
  const cardWidth = 384; // w-96 = 384px 桌面端
  const cardWidthMobile = 300; // 移动端宽度
  const cardGap = 64;    // gap-16 = 64px
  
  // 桌面端总宽度
  const cardTotalWidth = cardWidth + cardGap; // 448px per card
  const totalWidth = cardTotalWidth * list.length; // 一组内容的总宽度
  
  // 移动端总宽度
  const cardTotalWidthMobile = cardWidthMobile + cardGap; // 364px per card  
  const totalWidthMobile = cardTotalWidthMobile * list.length;
  
  // 每秒移动像素数（可根据需要调整，数值越大速度越快）
  const pixelsPerSecond = 150; // 推荐范围：80-200，提高到150让速度更合适
  const animationDuration = totalWidth / pixelsPerSecond;
  const mobileAnimationDuration = totalWidthMobile / pixelsPerSecond;

  return (
    <section className="featured-professionals-section relative overflow-hidden bg-gradient-to-b from-base-100 to-base-200/40 py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-base-content md:text-6xl">
            Realsee Galois Professionals
          </h2>
          <p className="mt-6 max-w-4xl text-lg text-base-content/70 md:text-xl">
            Discover a curated network of creators pushing the boundaries of spatial capture.
          </p>
        </div>
        
        {/* 跑马灯容器 - 移除overflow-hidden，用mask实现渐变效果 */}
        <div className="relative py-16">
          {/* 使用CSS mask实现左右渐变效果，不影响阴影 */}
          <div 
            className="professionals-marquee py-16 -my-16" 
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 8rem, black calc(100% - 8rem), transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 8rem, black calc(100% - 8rem), transparent)',
              '--marquee-duration': `${animationDuration}s`,
              '--marquee-duration-mobile': `${mobileAnimationDuration}s`
            } as React.CSSProperties}
          >
            <div className="professionals-track flex gap-16 animate-marquee-dynamic">
              {/* 第一组内容 */}
              {list.map((p) => (
                <a
                  key={p.id}
                  href={`/professional/${p.slug ?? p.id}`}
                  className="group block cursor-pointer rounded-3xl border border-base-300/40 bg-base-100/80 p-6 pt-12 pb-8 text-center shadow-lg ring-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none flex-shrink-0 w-96"
                  aria-label={`Open ${p.name}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-8 isolate">
                      <div className="pointer-events-none absolute -inset-8 z-0 rounded-[50px] bg-gradient-to-br from-primary/30 to-accent/30 opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="avatar relative z-10">
                        <div className="h-40 w-40 overflow-hidden rounded-3xl border-2 border-white/50 shadow-2xl transition-transform duration-500 group-hover:scale-[1.06]">
                          <Image
                            src={`/professional/${p.id}.jpg`}
                            alt={p.name}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-base-content tracking-wide">{p.name}</h3>
                    {p.shortBio ? (
                      <p className="line-clamp-3 text-sm text-base-content/70 leading-relaxed">{p.shortBio}</p>
                    ) : null}
                  </div>
                </a>
              ))}
              {/* 第二组内容（用于无缝循环） */}
              {list.map((p) => (
                <a
                  key={`duplicate-${p.id}`}
                  href={`/professional/${p.slug ?? p.id}`}
                  className="group block cursor-pointer rounded-3xl border border-base-300/40 bg-base-100/80 p-6 pt-12 pb-8 text-center shadow-lg ring-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none flex-shrink-0 w-96"
                  aria-label={`Open ${p.name}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-8 isolate">
                      <div className="pointer-events-none absolute -inset-8 z-0 rounded-[50px] bg-gradient-to-br from-primary/30 to-accent/30 opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="avatar relative z-10">
                        <div className="h-40 w-40 overflow-hidden rounded-3xl border-2 border-white/50 shadow-2xl transition-transform duration-500 group-hover:scale-[1.06]">
                          <Image
                            src={`/professional/${p.id}.jpg`}
                            alt={p.name}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-base-content tracking-wide">{p.name}</h3>
                    {p.shortBio ? (
                      <p className="line-clamp-3 text-sm text-base-content/70 leading-relaxed">{p.shortBio}</p>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
