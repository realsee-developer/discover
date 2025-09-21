import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "@iconify/react";
export function SiteFooter() {
  return (
    <div data-section-id="common_footer" data-section-type="common_footer">
      <footer className="footer footer-horizontal bg-base-200 text-base-content p-10 border-t border-base-300">
        <div className="footer-comprehensive">
          <div>
            <span className="footer-title text-primary font-bold">Realsee Gallery</span>
            <p className="text-sm opacity-75 max-w-xs">
              Discover immersive 3D spaces and connect with talented photographers worldwide. Experience the future of virtual tours.
            </p>
            <div className="flex gap-3 mt-3">
              <a className="btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content smooth-transition"><Icon icon="heroicons:share" width={18} /></a>
              <a className="btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content smooth-transition"><Icon icon="heroicons:chat-bubble-left-ellipsis" width={18} /></a>
              <a className="btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content smooth-transition"><Icon icon="heroicons:envelope" width={18} /></a>
            </div>
          </div>
          <div>
            <span className="footer-title">Explore</span>
            <a className="link link-hover cursor-pointer">Featured Tours</a>
            <a className="link link-hover cursor-pointer">Browse All</a>
            <a className="link link-hover cursor-pointer">Popular Spaces</a>
            <a className="link link-hover cursor-pointer">Mobile App</a>
          </div>
          <div>
            <span className="footer-title">Creators</span>
            <a className="link link-hover cursor-pointer">Featured Photographers</a>
            <a className="link link-hover cursor-pointer">Join Community</a>
            <a className="link link-hover cursor-pointer">Creator Resources</a>
            <a className="link link-hover cursor-pointer">Equipment Guide</a>
          </div>
          <div>
            <span className="footer-title">Categories</span>
            <a className="link link-hover cursor-pointer">Restaurants</a>
            <a className="link link-hover cursor-pointer">Offices</a>
            <a className="link link-hover cursor-pointer">Outdoor</a>
            <a className="link link-hover cursor-pointer">Industrial</a>
          </div>
          <div>
            <span className="footer-title">Support</span>
            <a className="link link-hover cursor-pointer">Contact Us</a>
            <a className="link link-hover cursor-pointer">Help Center</a>
            <a className="link link-hover cursor-pointer">Privacy Policy</a>
            <a className="link link-hover cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </footer>
      <div className="bg-base-300 py-4 px-10 border-t border-base-300 footer-copyright">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm opacity-75">© {new Date().getFullYear()} Realsee Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <span>English</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <style>{`
        [data-section-id="common_footer"] .footer { margin-top: auto; }
        [data-section-id="common_footer"] .link:hover { color: var(--color-primary); }
        [data-section-id="common_footer"] .footer-title { color: var(--color-base-content); font-weight: 600; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
}


