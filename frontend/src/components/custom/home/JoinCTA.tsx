"use client";
import { Icon } from "@iconify/react";

export function JoinCTA() {
  return (
    <section className="join-community-section relative overflow-hidden bg-gradient-to-b from-primary/20 via-accent/15 to-base-100 py-32">
      <div className="absolute inset-0 -z-20">
        <img
          src="/bg/creator-hero.jpeg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/80 via-base-100/60 to-base-100/95" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute left-[15%] top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute right-[12%] top-40 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />
      </div>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-base-300/50 bg-base-100/95 p-12 text-center shadow-2xl backdrop-blur-xl md:p-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-3 text-sm font-bold text-primary border-2 border-primary/30 shadow-lg backdrop-blur-md mb-8">
            <Icon
              icon="heroicons:sparkles"
              width={16}
              className="text-primary"
            />
            <span>Join the Creator Economy</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-base-content md:text-7xl bg-gradient-to-r from-base-content via-base-content to-base-content/80 bg-clip-text">
            Become a Realsee Creator
          </h2>
          <p className="mx-auto mt-8 max-w-4xl text-lg text-base-content/80 md:text-2xl font-medium leading-relaxed">
            Turn your spatial capture passion into opportunities. Publish
            stunning tours, collaborate with brands, and get discovered by
            clients worldwide.
          </p>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-6">
            <div className="creator-tag-shine group inline-flex items-center gap-3 rounded-2xl bg-white/90 px-6 py-4 text-base font-bold text-primary ring-2 ring-white/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.05] hover:bg-white hover:shadow-xl hover:shadow-primary/20 hover:ring-primary/30">
              <div className="rounded-full bg-primary/15 p-2">
                <Icon
                  icon="heroicons:users"
                  width={20}
                  className="text-primary"
                />
              </div>
              <span>Global Community</span>
            </div>
            <div className="creator-tag-shine group inline-flex items-center gap-3 rounded-2xl bg-white/90 px-6 py-4 text-base font-bold text-orange-600 ring-2 ring-white/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.05] hover:bg-white hover:shadow-xl hover:shadow-orange-600/20 hover:ring-orange-600/30">
              <div className="rounded-full bg-orange-100 p-2">
                <Icon
                  icon="heroicons:camera"
                  width={20}
                  className="text-orange-600"
                />
              </div>
              <span>Pro‑grade Tools</span>
            </div>
            <div className="creator-tag-shine group inline-flex items-center gap-3 rounded-2xl bg-white/90 px-6 py-4 text-base font-bold text-green-600 ring-2 ring-white/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.05] hover:bg-white hover:shadow-xl hover:shadow-green-600/20 hover:ring-green-600/30">
              <div className="rounded-full bg-green-100 p-2">
                <Icon
                  icon="heroicons:currency-dollar"
                  width={20}
                  className="text-green-600"
                />
              </div>
              <span>Monetization</span>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-6">
            <a
              href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
              className="creator-magic-button group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-16 py-6 text-xl font-black text-white shadow-2xl shadow-blue-500/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.08] hover:shadow-3xl hover:shadow-purple-500/60 focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden"
            >
              {/* 背景动画层 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] skew-x-12 transition-transform duration-700 group-hover:translate-x-[200%]" />
              
              {/* 脉冲光圈 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500 opacity-30 animate-pulse" />
              
              {/* 悬浮光晕 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-pink-400/60 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 scale-110" />
              
              {/* 图标容器 */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/40 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                <Icon
                  icon="heroicons:rocket-launch"
                  width={20}
                  className="text-white drop-shadow-md"
                />
              </div>
              
              {/* 文字 */}
              <span className="relative z-10 tracking-wide drop-shadow-sm">Join Creator Center</span>
              
              {/* 右侧装饰箭头 */}
              <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/30 backdrop-blur-md border border-white/40 transition-transform duration-300 group-hover:translate-x-1 shadow-lg">
                <Icon
                  icon="heroicons:arrow-right"
                  width={16}
                  className="text-white drop-shadow-sm"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
      {/* Enhanced visual effects for creator CTA section */}
      <style jsx>{`
        .creator-tag-shine {
          position: relative;
          overflow: hidden;
        }
        .creator-tag-shine::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
          transition: transform 0.6s ease;
          pointer-events: none;
        }
        .creator-tag-shine:hover::before {
          transform: translateX(100%) translateY(100%) rotate(45deg);
        }
        
        /* 魔法按钮效果 */
        .creator-magic-button {
          position: relative;
          background-size: 200% 200%;
          animation: magicButtonGlow 4s ease-in-out infinite;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .creator-magic-button::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6);
          background-size: 400% 400%;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          animation: magicBorder 3s linear infinite;
          opacity: 0.9;
        }
        
        .creator-magic-button:hover::before {
          opacity: 1;
          animation-duration: 1.5s;
        }
        
        @keyframes magicButtonGlow {
          0%, 100% { 
            background-position: 0% 50%;
            box-shadow: 
              0 0 30px rgba(59, 130, 246, 0.5),
              0 0 60px rgba(59, 130, 246, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.3);
          }
          25% { 
            background-position: 100% 0%;
            box-shadow: 
              0 0 40px rgba(147, 51, 234, 0.5),
              0 0 80px rgba(147, 51, 234, 0.3),
              0 12px 40px rgba(0, 0, 0, 0.4);
          }
          50% { 
            background-position: 100% 100%;
            box-shadow: 
              0 0 50px rgba(236, 72, 153, 0.5),
              0 0 100px rgba(236, 72, 153, 0.3),
              0 16px 48px rgba(0, 0, 0, 0.5);
          }
          75% { 
            background-position: 0% 100%;
            box-shadow: 
              0 0 45px rgba(168, 85, 247, 0.5),
              0 0 90px rgba(168, 85, 247, 0.3),
              0 14px 44px rgba(0, 0, 0, 0.4);
          }
        }
        
        @keyframes magicBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .creator-magic-button:hover {
          animation-duration: 2s;
          transform: scale(1.08) translateY(-2px);
          filter: brightness(1.1);
        }
        
        .creator-magic-button:active {
          transform: scale(1.05) translateY(0px);
          transition: all 0.1s ease-out;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .creator-tag-shine::before {
            display: none;
          }
          .creator-magic-button {
            animation: none;
          }
          .creator-magic-button::before {
            animation: none;
          }
          .creator-magic-button:hover {
            animation: none;
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}
