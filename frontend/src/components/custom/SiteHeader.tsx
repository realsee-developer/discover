import Link from "next/link";

export function SiteHeader() {
  return (
    <div data-section-id="common_header" data-section-type="common_header">
      <header className="navbar h-16 px-6 fixed top-0 left-0 right-0 z-50 bg-base-100/90 border-b border-base-300/70">
        <div className="navbar-start select-none">
          <Link href="/" className="text-base-content flex items-center gap-3 text-xl font-bold">
            <img src="/realsee-logo.jpeg" alt="Realsee Logo" className="w-8 h-8 rounded" />
            <span>Realsee Gallery</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            <li>
              <Link
                href="/"
                className="smooth-transition relative text-base-content/90 hover:text-primary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[oklch(0.72_0.17_210)] after:transition-all hover:after:w-full"
              >
                Discover
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="smooth-transition relative text-base-content/90 hover:text-primary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[oklch(0.72_0.17_210)] after:transition-all hover:after:w-full"
              >
                Browse Tours
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="smooth-transition relative text-base-content/90 hover:text-primary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[oklch(0.72_0.17_210)] after:transition-all hover:after:w-full"
              >
                Join Community
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-3">
          <div className="hidden sm:block">
            <Link href="/search" className="btn">
              Search
            </Link>
          </div>

          <details className="dropdown dropdown-end lg:hidden">
            <summary className="btn btn-ghost btn-square" aria-label="Open menu">☰</summary>
            <ul className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-lg bg-base-100 rounded-box w-64 border border-base-300">
              <li><Link href="/">Discover</Link></li>
              <li><Link href="/search">Browse Tours</Link></li>
              <li><Link href="/contact">Join Community</Link></li>
            </ul>
          </details>
        </div>
      </header>
      <style>{`
        [data-section-id="common_header"] .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
        [data-section-id="common_header"] .dropdown-content { box-shadow: 0 10px 25px rgba(0,0,0,0.25); }
      `}</style>
    </div>
  );
}

export default SiteHeader;
