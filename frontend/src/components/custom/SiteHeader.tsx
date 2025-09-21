"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Icon } from "@iconify/react";

export function SiteHeader() {
  const router = useRouter();

  const navigateTo = useCallback(
    (path: string) => () => {
      router.push(path);
    },
    [router]
  );

  const performSearch = useCallback(() => {
    // TODO: 接入真实搜索页
    router.push("/search");
  }, [router]);

  return (
    <div data-section-id="common_header" data-section-type="common_header">
      <header className="navbar bg-base-100 shadow-lg border-b border-base-300 h-16 px-6">
        <div className="navbar-start">
          <button
            onClick={navigateTo("/")}
            className="btn btn-ghost text-xl font-bold text-primary cursor-pointer"
         >
            <img
              src="https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2025/9/13/6f11aeea-72f1-47e6-9140-2e02da8483a6.png"
              alt="Realsee Logo"
              className="w-8 h-8 rounded"
            />
            <span>Realsee Gallery</span>
          </button>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            <li>
              <Link href="/" className="hover:bg-base-200 smooth-transition">Discover</Link>
            </li>
            <li>
              <Link href="/search" className="hover:bg-base-200 smooth-transition">Browse Tours</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:bg-base-200 smooth-transition">Join Community</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-3">
          <div className="form-control hidden sm:block">
            <div className="join">
              <input
                type="text"
                placeholder="Search 3D tours..."
                className="input input-bordered join-item w-64"
                onKeyDown={(e) => {
                  if (e.key === "Enter") performSearch();
                }}
              />
              <button className="btn btn-ghost join-item" onClick={performSearch}>
                <Icon icon="heroicons:magnifying-glass" width={20} />
              </button>
            </div>
          </div>

          <div className="dropdown dropdown-end lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-square">
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
        [data-section-id="common_header"] .navbar { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(8px); }
        [data-section-id="common_header"] .menu li > *:hover { background-color: var(--color-base-200); }
        [data-section-id="common_header"] .dropdown-content { box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
}


