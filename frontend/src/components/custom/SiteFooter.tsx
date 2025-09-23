import { ThemeToggle } from "./ThemeToggle";
export function SiteFooter() {
  return (
    <div data-section-id="common_footer" data-section-type="common_footer">
      <footer className="bg-base-200 text-base-content border-t border-base-300">
        <div className="container mx-auto px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-base-content/70">Product</h3>
              <ul className="space-y-2">
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.65)]" href="#"><span>Galois</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Realsee G1</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>360 Camera</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Mobile phone</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-base-content/70">Solution</h3>
              <ul className="space-y-2">
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Real Estate Professional</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Real Estate Agency</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-base-content/70">Resources</h3>
              <ul className="space-y-2">
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>About Us</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Partners</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-base-content/70">Quick links</h3>
              <ul className="space-y-2">
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Realsee App</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Console</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Help Center</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
                <li><a className="group flex items-center justify-between gap-2 text-sm text-base-content/80 transition-colors hover:text-primary" href="#"><span>Legal agreements</span><span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">→</span></a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-base-300 bg-base-200/70">
          <div className="container mx-auto flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm opacity-75">© {new Date().getFullYear()} Beike Realsee Technology (HK) Limited. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <a aria-label="LinkedIn" className="btn btn-ghost btn-sm btn-circle hover:shadow-neon-sm" href="#"><span aria-hidden="true">in</span></a>
                <a aria-label="YouTube" className="btn btn-ghost btn-sm btn-circle" href="#"><span aria-hidden="true">yt</span></a>
                <a aria-label="X" className="btn btn-ghost btn-sm btn-circle" href="#"><span aria-hidden="true">x</span></a>
                <a aria-label="Reddit" className="btn btn-ghost btn-sm btn-circle" href="#"><span aria-hidden="true">rd</span></a>
                <a aria-label="WhatsApp" className="btn btn-ghost btn-sm btn-circle" href="#"><span aria-hidden="true">wa</span></a>
              </div>
              <div className="h-5 w-px bg-base-300" />
              <div className="flex items-center gap-3 text-sm">
                <a className="link" href="#">English</a>
                <span className="opacity-50">/</span>
                <a className="link" href="#">简体中文</a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style>{`
        [data-section-id="common_footer"] .link:hover { color: var(--color-primary); text-shadow: 0 0 16px rgba(56,189,248,0.35) }
      `}</style>
    </div>
  );
}


