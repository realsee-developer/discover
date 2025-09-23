"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export function SiteHeader() {
  const router = useRouter();
  const [atTop, setAtTop] = useState(true);

  // logo is not clickable anymore

  const performSearch = useCallback(() => {
    // TODO: 接入真实搜索页
    router.push("/search");
  }, [router]);

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
          `navbar h-16 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur ` +
          (atTop
            ? "bg-base-100/70 border-b border-base-300/50 shadow-sm"
            : "bg-base-100/90 border-b border-base-300 shadow-lg")
        }
      >
        <div className="navbar-start select-none">
          <div className={`text-base-content flex items-center gap-3 text-xl font-bold`}>
            <img src="/realsee-logo.jpeg" alt="Realsee Logo" className="w-8 h-8 rounded" />
            <span>Realsee Gallery</span>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            <li>
              <Link
                href="/"
                className="smooth-transition text-base-content/90 hover:text-primary"
              >
                Discover
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="smooth-transition text-base-content/90 hover:text-primary"
              >
                Browse Tours
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="smooth-transition text-base-content/90 hover:text-primary"
              >
                Join Community
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-3">
          <div className="form-control hidden sm:block">
            <div className="join">
              <input
                type="text"
                placeholder="Search 3D tours..."
                className={`input input-bordered join-item w-64`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") performSearch();
                }}
              />
              <button
                className={`btn btn-ghost join-item text-base-content/70 hover:text-primary`}
                onClick={performSearch}
              >
                <Icon icon="heroicons:magnifying-glass" width={20} />
              </button>
            </div>
          </div>

          <div className="dropdown dropdown-end lg:hidden">
            <button tabIndex={0} className={`btn btn-ghost btn-square`}>
              <Icon icon="heroicons:bars-3" width={24} />
            </button>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-lg bg-base-100 rounded-box w-64 border border-base-300">
              <li><Link href="/">Discover</Link></li>
              <li><Link href="/search">Browse Tours</Link></li>
              <li><Link href="/contact">Join Community</Link></li>
            </ul>
          </div>
        </div>
      </header>
      <style>{`
        [data-section-id="common_header"] .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; backdrop-filter: blur(8px); }
        [data-section-id="common_header"] .menu li > *:hover { }
        [data-section-id="common_header"] .dropdown-content { box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
}


