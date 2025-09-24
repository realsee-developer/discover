import Image from "next/image";
import { Icon } from "@iconify/react";

export function SiteFooter() {
  return (
    <div data-section-id="common_footer" data-section-type="common_footer">
      <footer className="relative bg-gradient-to-br from-cyber-gray-900 via-cyber-gray-800 to-cyber-brand-50 border-t border-cyber-brand-300/30">
        {/* Cyberpunk background patterns */}
        <div 
          className="absolute inset-0" 
          style={{
            background: `radial-gradient(circle at 30% 40%, rgb(from var(--cyber-brand-500) r g b / 0.08), transparent 70%), radial-gradient(circle at 80% 20%, rgb(from var(--cyber-neon-cyan) r g b / 0.03), transparent 60%)`
          }}
        ></div>
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgb(from var(--cyber-brand-500) r g b / 0.02) 50%, transparent 100%)`
          }}
        ></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgb(from var(--cyber-brand-500) r g b / 0.03) 60deg, transparent 120deg)`
          }}
        ></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgb(from var(--cyber-brand-500) r g b / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgb(from var(--cyber-brand-500) r g b / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="relative">
          {/* Main Content */}
          <div className="container mx-auto px-6 py-20">
            {/* Brand Section */}
            <div className="mb-20 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyber-brand-500/30 via-cyber-neon-cyan/20 to-cyber-brand-500/30 rounded-3xl blur-md group-hover:blur-lg transition-all duration-500"></div>
                  <Image
                    src="/realsee-logo.jpeg"
                    alt="Realsee Logo"
                    width={64}
                    height={64}
                    className="relative w-16 h-16 rounded-2xl shadow-2xl ring-2 ring-cyber-brand-500/50 group-hover:ring-cyber-neon-cyan/70 transition-all duration-500"
                    priority
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyber-brand-500 to-cyber-neon-cyan rounded-full border-2 border-cyber-gray-900 shadow-lg shadow-cyber-neon-cyan/50"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-bold font-display bg-gradient-to-r from-cyber-brand-600 via-cyber-neon-cyan to-cyber-brand-600 bg-clip-text text-transparent">
                    Realsee
                  </span>
                  <span className="text-cyber-brand-500 text-lg font-semibold -mt-1 tracking-wider">
                    DISCOVER
                  </span>
                </div>
              </div>
              <p className="text-cyber-gray-200 max-w-3xl mx-auto text-xl leading-relaxed">
                Experience the future of real estate with cutting-edge 3D
                technology.
                <br className="hidden sm:block" />
                Virtual tours, professional photography, and immersive property
                exploration.
              </p>
            </div>

            {/* Links Grid */}
            <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3 mb-20">
              {/* Products */}
              <div className="space-y-8 group">
                <h3 className="text-lg font-bold uppercase tracking-widest text-cyber-brand-600 border-b-2 border-cyber-brand-500/30 pb-3 relative">
                  Products
                  <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan group-hover:w-full transition-all duration-700"></div>
                </h3>
                <ul className="space-y-6">
                  {[
                    {
                      name: "Galois",
                      desc: "AI-powered 3D reconstruction technology for professional real estate photography",
                      link: "https://home.realsee.ai/en/galois",
                    },
                    {
                      name: "Realsee G1",
                      desc: "Professional 3D camera system for high-quality virtual tour creation",
                      link: "https://home.realsee.ai/en/realsee-g1",
                    },
                    {
                      name: "360 Camera",
                      desc: "Panoramic capture device for immersive virtual reality experiences",
                      link: "https://home.realsee.ai/en/vr-capture-with-360-camera",
                    },
                    {
                      name: "Mobile App",
                      desc: "Capture and create 3D tours on-the-go with our mobile application",
                      link: "https://home.realsee.ai/en/vr-capture-with-mobile",
                    },
                  ].map((item) => (
                    <li key={item.name}>
                      <a
                        className="group/link block p-4 -m-4 rounded-xl hover:bg-gradient-to-r hover:from-cyber-brand-500/5 hover:to-cyber-neon-cyan/5 border border-transparent hover:border-cyber-brand-500/20 transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-cyber-gray-100 font-semibold text-lg group-hover/link:text-cyber-brand-500 transition-colors duration-300">
                            {item.name}
                          </span>
                          <Icon
                            className="text-cyber-gray-500 group-hover/link:text-cyber-brand-500 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1"
                            icon="heroicons:arrow-top-right-on-square"
                            width={18}
                          />
                        </div>
                        <p className="text-sm text-cyber-gray-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div className="space-y-8 group">
                <h3 className="text-lg font-bold uppercase tracking-widest text-cyber-brand-600 border-b-2 border-cyber-brand-500/30 pb-3 relative">
                  Solutions
                  <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan group-hover:w-full transition-all duration-700"></div>
                </h3>
                <ul className="space-y-6">
                  {[
                    {
                      name: "Real Estate",
                      desc: "Complete 3D virtual tour solutions for property marketing and sales",
                      link: "https://home.realsee.ai/en/solutions-real-estate",
                    },
                    {
                      name: "Photography Services",
                      desc: "Professional real estate photography and virtual staging services",
                      link: "https://home.realsee.ai/en/solutions-real-estate-photographer",
                    },
                    {
                      name: "Brokerage Platform",
                      desc: "Enterprise solutions for real estate brokerages and agencies",
                      link: "https://home.realsee.ai/en/real-estate-brokerage",
                    },
                  ].map((item) => (
                    <li key={item.name}>
                      <a
                        className="group/link block p-4 -m-4 rounded-xl hover:bg-gradient-to-r hover:from-cyber-brand-500/5 hover:to-cyber-neon-cyan/5 border border-transparent hover:border-cyber-brand-500/20 transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-cyber-gray-100 font-semibold text-lg group-hover/link:text-cyber-brand-500 transition-colors duration-300">
                            {item.name}
                          </span>
                          <Icon
                            className="text-cyber-gray-500 group-hover/link:text-cyber-brand-500 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1"
                            icon="heroicons:arrow-top-right-on-square"
                            width={18}
                          />
                        </div>
                        <p className="text-sm text-cyber-gray-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-8 group">
                <h3 className="text-lg font-bold uppercase tracking-widest text-cyber-brand-600 border-b-2 border-cyber-brand-500/30 pb-3 relative">
                  Resources
                  <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan group-hover:w-full transition-all duration-700"></div>
                </h3>
                <ul className="space-y-6">
                  {[
                    {
                      name: "Realsee App",
                      desc: "Download our mobile app for iOS and Android devices",
                      link: "https://home.realsee.ai/en/download-realsee-vr",
                    },
                    {
                      name: "Console",
                      desc: "Manage your 3D content and virtual tours in our web dashboard",
                      link: "https://my.realsee.ai/capture-3d",
                    },
                    {
                      name: "Support Center",
                      desc: "Get help, documentation, and customer support resources",
                      link: "https://home.realsee.ai/en/contact-us",
                    },
                    {
                      name: "Legal",
                      desc: "Terms of service, privacy policy, and legal information",
                      link: "https://home.realsee.ai/legal",
                    },
                  ].map((item) => (
                    <li key={item.name}>
                      <a
                        className="group/link block p-4 -m-4 rounded-xl hover:bg-gradient-to-r hover:from-cyber-brand-500/5 hover:to-cyber-neon-cyan/5 border border-transparent hover:border-cyber-brand-500/20 transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-cyber-gray-100 font-semibold text-lg group-hover/link:text-cyber-brand-500 transition-colors duration-300">
                            {item.name}
                          </span>
                          <Icon
                            className="text-cyber-gray-500 group-hover/link:text-cyber-brand-500 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1"
                            icon="heroicons:arrow-top-right-on-square"
                            width={18}
                          />
                        </div>
                        <p className="text-sm text-cyber-gray-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-cyber-brand-300/20 bg-gradient-to-r from-cyber-gray-900/80 via-cyber-gray-800/60 to-cyber-gray-900/80 backdrop-blur-md">
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-8 text-center lg:text-left">
                {/* Copyright */}
                <div className="text-sm text-cyber-gray-300 order-2 lg:order-1 max-w-md lg:max-w-none">
                  <p>
                    © {new Date().getFullYear()} Beike Realsee Technology (HK)
                    Limited.
                  </p>
                  <p className="text-cyber-gray-400 mt-1">
                    All rights reserved. Pioneering the future of real estate
                    technology.
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center justify-center gap-4 order-1 lg:order-2">
                  <span className="text-xs text-cyber-gray-400 uppercase tracking-wider mr-2">
                    Connect
                  </span>
                  <div className="flex items-center gap-3">
                    {[
                      {
                        icon: "mdi:linkedin",
                        label: "LinkedIn",
                        link: "https://www.linkedin.com/company/realsee/",
                      },
                      {
                        icon: "mdi:youtube",
                        label: "YouTube",
                        link: "https://www.youtube.com/channel/UCARlm-6LYCRgjIu_R8LbD8Q",
                      },
                      {
                        icon: "simple-icons:x",
                        label: "X",
                        link: "https://x.com/REALSEE_Moment",
                      },
                      {
                        icon: "mdi:reddit",
                        label: "Reddit",
                        link: "https://www.reddit.com/r/RealseeOfficial/",
                      },
                      {
                        icon: "mdi:whatsapp",
                        label: "WhatsApp",
                        link: "#",
                      },
                      {
                        icon: "mdi:facebook",
                        label: "Facebook",
                        link: "https://www.facebook.com/RealseeVR/",
                      },
                    ].map((social) => (
                      <a
                        key={social.label}
                        aria-label={social.label}
                        className="p-3 rounded-xl text-cyber-gray-100 border border-cyber-gray-600/40 bg-cyber-gray-800/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyber-brand-400 hover:text-cyber-neon-cyan hover:shadow-md hover:shadow-cyber-brand-500/20 focus-visible:outline-2 focus-visible:outline-cyber-brand-500 focus-visible:outline-offset-2"
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon={social.icon} width={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
