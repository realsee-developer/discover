"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      try {
        setAtTop(window.scrollY <= 4);
      } catch {}
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-section-id="common_header" data-section-type="common_header">
      <header
        className={
          `fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md backdrop-saturate-150 ` +
          (atTop
            ? "bg-cyber-gray-800/90 border-b border-cyber-brand-300/50 shadow-sm shadow-cyber-brand-500/25"
            : "bg-cyber-gray-800/98 border-b border-cyber-brand-300/70 shadow-xl shadow-cyber-brand-500/40")
        }
        suppressHydrationWarning
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 select-none">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyber-brand-500/20 via-cyber-neon-cyan/10 to-cyber-brand-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <Image
                  src="/realsee-logo.jpeg"
                  alt="Realsee Logo"
                  width={40}
                  height={40}
                  className="relative w-10 h-10 rounded-xl shadow-lg ring-2 ring-cyber-brand-500/40 group-hover:ring-cyber-neon-cyan/60 transition-all duration-300"
                  priority
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-cyber-brand-500 to-cyber-neon-cyan rounded-full border-2 border-cyber-gray-900 shadow-lg shadow-cyber-neon-cyan/50"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display bg-gradient-to-r from-cyber-brand-600 via-cyber-neon-cyan to-cyber-brand-600 bg-clip-text text-transparent">
                  Realsee
                </span>
                <span className="text-xs text-cyber-brand-600 font-semibold -mt-1 hidden sm:block tracking-wider uppercase">
                  Discover
                </span>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="relative text-cyber-gray-100 hover:text-cyber-brand-800 font-medium transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
              >
                Discover
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center shadow-sm shadow-cyber-brand-500/50"></span>
              </Link>
              <Link
                href="/search"
                className="relative text-cyber-gray-100 hover:text-cyber-brand-800 font-medium transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
              >
                Browse Tours
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center shadow-cyber-brand-500/50"></span>
              </Link>
              <Link
                href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
                className="relative text-cyber-gray-100 hover:text-cyber-brand-800 font-medium transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
              >
                Join Community
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center shadow-sm shadow-cyber-brand-500/50"></span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    className="p-2.5 rounded-xl bg-cyber-gray-700/80 hover:bg-cyber-brand-500/20 text-white hover:text-cyber-brand-600 transition-all duration-300 border border-cyber-gray-600/60 hover:border-cyber-brand-500 shadow-lg shadow-cyber-brand-500/10"
                  >
                    <Icon icon="heroicons:bars-3" width={20} />
                  </button>
                  <ul className="menu dropdown-content mt-3 z-50 p-3 shadow-2xl bg-cyber-gray-800/95 backdrop-blur-md rounded-2xl w-72 border border-cyber-gray-600/60 shadow-cyber-brand-500/20">
                    <li>
                      <Link
                        href="/"
                        className="text-white hover:text-cyber-brand-600 hover:bg-cyber-brand-500/10 rounded-xl font-medium transition-all duration-300"
                      >
                        <Icon icon="heroicons:home" width={18} />
                        Discover
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/search"
                        className="text-white hover:text-cyber-brand-600 hover:bg-cyber-brand-500/10 rounded-xl font-medium transition-all duration-300"
                      >
                        <Icon icon="heroicons:magnifying-glass" width={18} />
                        Browse Tours
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
                        className="text-white hover:text-cyber-brand-600 hover:bg-cyber-brand-500/10 rounded-xl font-medium transition-all duration-300"
                      >
                        <Icon icon="heroicons:user-group" width={18} />
                        Join Community
                      </Link>
                    </li>
                    <div className="cyber-divider mx-2 my-2"></div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <style>{`
        [data-section-id="common_header"] header {
          backdrop-filter: blur(12px) saturate(150%);
        }
        
        [data-section-id="common_header"] .dropdown-content {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(12px) saturate(150%);
        }


        @media (prefers-reduced-motion: reduce) {
          [data-section-id="common_header"] * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
