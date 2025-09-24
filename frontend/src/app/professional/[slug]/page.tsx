import type { Metadata } from "next";
import { getProfessionalBySlug, getProfessionals, getVrById, resolvePublicAssetPath } from "@/data/db";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Icon } from "@iconify/react";
import { HeroRotatingBg } from "./HeroRotatingBg";
import { ProfileAvatar } from "./ProfileAvatar";
import { DeviceIcon } from "@/lib/badge-utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  const title = pro ? `${pro.name} - Professional 3D Photographer | Realsee Creator` : "Professional 3D Photographer | Realsee";
  const description = pro?.shortBio || "Discover talented Realsee professionals and their stunning immersive 3D virtual tours and digital twins.";
  return { 
    title, 
    description,
    keywords: pro ? `${pro.name}, 3D photography, virtual tours, Realsee, ${pro.Location || ''}, digital twins` : "3D photography, virtual tours, Realsee professionals",
    openGraph: {
      title,
      description,
      type: 'profile'
    }
  };
}

export async function generateStaticParams() {
  return getProfessionals().map((p) => ({ slug: p.slug! }));
}

export default async function ProfessionalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  
  if (!pro) {
    return (
      <main className="container mx-auto px-6 py-24">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon icon="heroicons:user" width={32} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Professional Not Found</h1>
          <p className="text-gray-600 mb-8">The professional profile you're looking for doesn't exist or may have been moved.</p>
          <a href="/search" className="btn bg-brand-500 hover:bg-brand-600 text-white border-none">
            <Icon icon="heroicons:magnifying-glass" width={20} className="mr-2" />
            Browse All Professionals
          </a>
        </div>
      </main>
    );
  }

  const tours = (pro.vrIds || [])
    .map((id) => getVrById(id))
    .filter((v): v is NonNullable<ReturnType<typeof getVrById>> => Boolean(v));

  const hasWebsite = pro.Website && pro.Website !== "/" && pro.Website !== "";
  const heroImages = tours
    .map((t) => resolvePublicAssetPath(t.assetCover || t.cover) || t.remoteCover)
    .filter((s): s is string => Boolean(s));


  const getCategoryIcon = (category: string): string => {
    const c = (category || "").toLowerCase();
    if (c.includes("residential") || c.includes("house") || c.includes("home")) return "heroicons:home";
    if (c.includes("industrial") || c.includes("factory")) return "heroicons:building-office-2";
    if (c.includes("exhibition")) return "heroicons:photo";
    if (c.includes("showroom")) return "heroicons:sparkles";
    if (c.includes("museum")) return "heroicons:building-library";
    if (c.includes("office")) return "heroicons:building-office";
    if (c.includes("restaurant")) return "heroicons:building-storefront";
    if (c.includes("studio")) return "heroicons:video-camera";
    if (c.includes("church")) return "mdi:church";
    if (c.includes("gym")) return "mdi:dumbbell";
    if (c.includes("aerial")) return "heroicons:paper-airplane";
    if (c.includes("outdoor") || c.includes("outside")) return "heroicons:globe-alt";
    return "heroicons:tag";
  };

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeId = pro.behindScenesVideo ? extractYouTubeId(pro.behindScenesVideo) : null;

  return (
    <main className="flex-1 main-content-wrapper">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[800px] py-20 md:py-32 flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-brand-400/15 to-brand-600/10"></div>
        
        {/* Hero Background */}
        {heroImages.length ? <HeroRotatingBg images={heroImages} /> : null}
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-brand-400/20 to-brand-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-brand-300/15 to-brand-500/15 rounded-full blur-3xl animate-pulse-slow"></div>
          
          {/* Additional floating elements for visual interest */}
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-brand-300/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-brand-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-brand-200/50 rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="w-full max-w-6xl mx-auto">
            {/* Glassmorphism Card */}
            <div className="relative rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl p-8 md:p-16">
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/20 via-brand-400/10 to-brand-600/20 rounded-3xl blur opacity-40"></div>
              
              <div className="relative flex flex-col lg:flex-row items-center gap-12">
                {/* Avatar with Enhanced Design */}
                <div className="relative group">
                  {/* Animated Rings */}
                  <div className="absolute -inset-4 rounded-full border border-brand-400/30 animate-ping opacity-20"></div>
                  <div className="absolute -inset-2 rounded-full border border-brand-500/40 animate-pulse"></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-brand-400/60 to-brand-600/60 blur-2xl scale-110 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  
                  {/* Avatar Container */}
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-brand-200/50 group-hover:ring-brand-300/70 transition-all duration-300">
                    <ProfileAvatar 
                      professionalId={pro.id} 
                      name={pro.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Name with Gradient */}
                  <h1 className="text-5xl md:text-7xl font-black mb-4">
                    <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 bg-clip-text text-transparent">
                      {pro.name}
                    </span>
                  </h1>
                  
                  {/* Professional Title */}
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-brand-500/20 to-brand-600/20 text-brand-700 font-semibold rounded-full border border-brand-200">
                      <Icon icon="heroicons:camera" width={18} className="inline mr-2" />
                      3D Professional Photographer
                    </span>
                  </div>
                  
                  {/* Bio */}
                  {pro.shortBio ? (
                    <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl">
                      {pro.shortBio}
                    </p>
                  ) : null}
                  
                  {/* Quick Info */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                    {/* Tour Count */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-50 to-brand-100/50 rounded-xl border border-brand-200">
                      <Icon icon="heroicons:cube" width={20} className="text-brand-600" />
                      <span className="text-brand-700 font-semibold">{tours.length} Projects</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200">
                      <Icon icon="heroicons:check-circle" width={20} className="text-green-600" />
                      <span className="text-green-700 font-semibold">Verified Pro</span>
                    </div>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <a 
                      href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
                      className="group px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-600/30 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <Icon icon="heroicons:chat-bubble-left-right" width={20} className="inline mr-2" />
                      Contact for Collaboration
                      <Icon icon="heroicons:arrow-right" width={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                    
                    <button className="group px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200">
                      <Icon icon="heroicons:heart" width={20} className="inline mr-2 group-hover:text-red-500" />
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Info Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_var(--color-brand-50),_transparent_50%),radial-gradient(circle_at_80%_50%,_var(--color-brand-100),_transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-200 mb-4">
                <Icon icon="heroicons:identification" width={20} />
                Professional Details
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch with <span className="text-brand-500">{pro.name}</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect directly through multiple channels for collaboration opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Icon icon="heroicons:phone" width={24} className="text-brand-500" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Location with Google Maps */}
                    {pro.Location ? (
                      <div className="group">
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(pro.Location)}`}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-3 p-4 bg-white hover:bg-brand-50 rounded-xl border border-gray-200/60 hover:border-brand-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center group-hover:from-brand-200 group-hover:to-brand-300 transition-all">
                            <Icon icon="heroicons:map-pin" width={24} className="text-brand-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-brand-700">Location</div>
                            <div className="text-gray-600 text-sm">{pro.Location}</div>
                          </div>
                          <Icon icon="heroicons:arrow-top-right-on-square" width={16} className="text-gray-400 group-hover:text-brand-500" />
                        </a>
                      </div>
                    ) : null}


                    {/* Website */}
                    {hasWebsite ? (
                      <div className="group">
                        <a 
                          href={pro.Website!.startsWith('http') ? pro.Website! : `https://${pro.Website}`}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-3 p-4 bg-white hover:bg-brand-50 rounded-xl border border-gray-200/60 hover:border-brand-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all">
                            <Icon icon="heroicons:globe-alt" width={24} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-brand-700">Website</div>
                            <div className="text-gray-600 text-sm">{pro.Website}</div>
                          </div>
                          <Icon icon="heroicons:arrow-top-right-on-square" width={16} className="text-gray-400 group-hover:text-brand-500" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Social Media & Additional Links */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Icon icon="heroicons:share" width={24} className="text-brand-500" />
                    Social Media & Links
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* LinkedIn */}
                    {pro.linkedin ? (
                      <a 
                        href={pro.linkedin} 
                        target="_blank" 
                        rel="noopener" 
                        className="group flex items-center gap-3 p-4 bg-white hover:bg-blue-50 rounded-xl border border-gray-200/60 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                          <Icon icon="mdi:linkedin" width={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-blue-700">LinkedIn</div>
                          <div className="text-xs text-gray-500">Professional Network</div>
                        </div>
                      </a>
                    ) : null}

                    {/* Instagram */}
                    {pro.instagram ? (
                      <a 
                        href={pro.instagram} 
                        target="_blank" 
                        rel="noopener" 
                        className="group flex items-center gap-3 p-4 bg-white hover:bg-pink-50 rounded-xl border border-gray-200/60 hover:border-pink-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-pink-100 group-hover:bg-pink-200 rounded-lg flex items-center justify-center transition-colors">
                          <Icon icon="mdi:instagram" width={20} className="text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-pink-700">Instagram</div>
                          <div className="text-xs text-gray-500">Visual Portfolio</div>
                        </div>
                      </a>
                    ) : null}

                    {/* Facebook */}
                    {pro.facebook ? (
                      <a 
                        href={pro.facebook} 
                        target="_blank" 
                        rel="noopener" 
                        className="group flex items-center gap-3 p-4 bg-white hover:bg-blue-50 rounded-xl border border-gray-200/60 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                          <Icon icon="mdi:facebook" width={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-blue-700">Facebook</div>
                          <div className="text-xs text-gray-500">Social Updates</div>
                        </div>
                      </a>
                    ) : null}

                    {/* YouTube */}
                    {pro.youtube ? (
                      <a 
                        href={pro.youtube} 
                        target="_blank" 
                        rel="noopener" 
                        className="group flex items-center gap-3 p-4 bg-white hover:bg-red-50 rounded-xl border border-gray-200/60 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                          <Icon icon="mdi:youtube" width={20} className="text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-red-700">YouTube</div>
                          <div className="text-xs text-gray-500">Video Content</div>
                        </div>
                      </a>
                    ) : null}

                    {/* Vimeo */}
                    {pro.vimeo ? (
                      <a 
                        href={pro.vimeo} 
                        target="_blank" 
                        rel="noopener" 
                        className="group flex items-center gap-3 p-4 bg-white hover:bg-indigo-50 rounded-xl border border-gray-200/60 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors">
                          <Icon icon="mdi:vimeo" width={20} className="text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-indigo-700">Vimeo</div>
                          <div className="text-xs text-gray-500">Pro Videos</div>
                        </div>
                      </a>
                    ) : null}

                    {/* Blog Article */}
                    {pro.blogArticle ? (
                      <a 
                        href={pro.blogArticle} 
                        target="_blank" 
                        rel="noopener" 
                        className="group flex items-center gap-3 p-4 bg-white hover:bg-purple-50 rounded-xl border border-gray-200/60 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md sm:col-span-2"
                      >
                        <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
                          <Icon icon="heroicons:document-text" width={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-purple-700">Featured Article</div>
                          <div className="text-xs text-gray-500">Read the full story</div>
                        </div>
                        <Icon icon="heroicons:arrow-top-right-on-square" width={16} className="text-gray-400 group-hover:text-purple-500" />
                      </a>
                    ) : null}
                  </div>

                  {/* Empty state if no social media */}
                  {!pro.linkedin && !pro.instagram && !pro.facebook && !pro.youtube && !pro.vimeo && !pro.blogArticle ? (
                    <div className="text-center py-8">
                      <Icon icon="heroicons:link-slash" width={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">No social media links available</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Professional Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                  <Icon icon="heroicons:cube" width={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-brand-600">{tours.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Icon icon="heroicons:check-badge" width={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600">Pro</div>
                <div className="text-sm text-gray-600">Verified Status</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Icon icon="heroicons:star" width={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">5.0</div>
                <div className="text-sm text-gray-600">Quality Rating</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Icon icon="heroicons:clock" width={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      {youtubeId ? (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--color-brand-100),_transparent_50%)]"></div>
          
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-200 mb-4">
                <Icon icon="heroicons:play-circle" width={20} />
                Behind the Scenes
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Watch <span className="text-brand-500">{pro.name}</span> in Action
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get an inside look at professional 3D photography techniques and immersive virtual space creation
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <div className="relative group">
                <div className="relative rounded-3xl overflow-hidden border border-gray-200/60 shadow-2xl bg-white p-2">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/20 to-brand-600/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                    <YouTubeEmbed 
                      videoid={youtubeId} 
                      height={500} 
                      params="modestbranding=1&rel=0&autoplay=0&controls=1" 
                    />
                  </div>
                </div>
                
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-6 px-6 py-3 bg-white rounded-2xl border border-gray-200 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Icon icon="heroicons:eye" width={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Professional Showcase</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <Icon icon="heroicons:star" width={16} className="text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Featured Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Portfolio Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_var(--color-brand-50),_transparent_60%)]"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-200 mb-4">
              <Icon icon="heroicons:cube" width={20} />
              3D Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Exceptional Work by <span className="text-brand-500">{pro.name}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore professional-grade 3D virtual tours and experience the digital transformation of real spaces
            </p>
            
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-500">{tours.length}</div>
                <div className="text-sm text-gray-500">Total Projects</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-500">Pro</div>
                <div className="text-sm text-gray-500">Quality Assured</div>
              </div>
            </div>
          </div>
          
          {tours.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {tours.map((t, index) => (
                <a
                  key={t.id}
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative tour-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card bg-base-100 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 transform">
                    
                    <figure className="relative overflow-hidden">
                      <img
                        src={resolvePublicAssetPath(t.assetCover || t.cover) || t.remoteCover || "/cover/placeholder.jpg"}
                        alt={t.title || t.id}
                        className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {t.shortCategory ? (
                        <div className="absolute top-3 left-3">
                          <div className="badge badge-primary badge-sm gap-1">
                            <Icon icon={getCategoryIcon(t.shortCategory)} width={12} />
                            <span>{t.shortCategory}</span>
                          </div>
                        </div>
                      ) : null}
                      
                      {t.device ? (
                        <div className="absolute top-3 right-3">
                          <div className="badge badge-neutral badge-sm gap-1.5">
                            <DeviceIcon device={t.device} width={14} />
                            <span className="font-medium text-xs">{t.device}</span>
                          </div>
                        </div>
                      ) : null}
                      
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="w-10 h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                          <Icon icon="heroicons:play" width={16} className="ml-0.5" />
                        </div>
                      </div>
                    </figure>
                    
                    <div className="card-body p-5">
                      <div className="card-title">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-500 transition-colors mb-2">
                          {t.title || "Untitled Tour"}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {t.description || "Click to explore this space in an immersive 3D virtual tour."}
                      </p>
                      
                      <div className="card-actions justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Icon icon="heroicons:eye" width={14} />
                          <span>3D Virtual Tour</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Click to Explore
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon icon="heroicons:cube" width={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-500">This photographer hasn't uploaded any 3D projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {pro.aboutTheCreator ? (
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,_var(--color-brand-50),_transparent_50%),radial-gradient(circle_at_80%_20%,_var(--color-brand-100),_transparent_50%)]"></div>
          
          <div className="container mx-auto px-6 relative">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-200 mb-4">
                  <Icon icon="heroicons:user" width={20} />
                  Professional Background
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  About <span className="text-brand-500">{pro.name}</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Learn about this professional photographer's journey, expertise, and creative vision
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-brand-600/5 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-2xl p-8 md:p-12">
                  <div className="absolute top-8 left-8 w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                    <Icon icon="heroicons:chat-bubble-left-ellipsis" width={24} className="text-brand-500" />
                  </div>
                  
                  <div className="pt-8">
                    <div className="prose prose-lg prose-gray max-w-none">
                      <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {pro.aboutTheCreator}
                      </div>
                    </div>
                    
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200/50">
                        <Icon icon="heroicons:camera" width={32} className="mx-auto mb-3 text-brand-600" />
                        <h3 className="font-semibold text-gray-900 mb-2">Professional Photography</h3>
                        <p className="text-sm text-gray-600">Specialized in 3D spatial capture technology</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200/50">
                        <Icon icon="heroicons:cube-transparent" width={32} className="mx-auto mb-3 text-brand-600" />
                        <h3 className="font-semibold text-gray-900 mb-2">3D Modeling</h3>
                        <p className="text-sm text-gray-600">Creating immersive virtual experiences</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200/50">
                        <Icon icon="heroicons:sparkles" width={32} className="mx-auto mb-3 text-brand-600" />
                        <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                        <p className="text-sm text-gray-600">Leading industry development trends</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Contact CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-brand-50/30 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--color-brand-100),_transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-32 h-32 bg-brand-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-brand-300/20 rounded-full blur-3xl animate-float"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 font-semibold rounded-full border border-brand-200 mb-6">
                <Icon icon="heroicons:handshake" width={20} />
                Start Collaboration
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-brand-600 to-gray-900 bg-clip-text text-transparent">
                  Ready to Work with {pro.name}?
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                Empower your spaces with professional 3D technology, create stunning virtual experiences that make your projects stand out from the competition.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="heroicons:lightning-bolt" width={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
                <p className="text-gray-600 text-sm">Professional team responds within 24 hours</p>
              </div>
              
              <div className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="heroicons:star" width={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Professional Quality</h3>
                <p className="text-gray-600 text-sm">Industry-leading 3D capture and modeling technology</p>
              </div>
              
              <div className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="heroicons:shield-check" width={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Quality Guarantee</h3>
                <p className="text-gray-600 text-sm">Satisfaction promise with full refund if not satisfied</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://home.realsee.ai/en/contact-us-join-realsee-creators-center"
                className="group px-10 py-5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-600/40 transition-all duration-300 transform hover:-translate-y-1 text-lg"
              >
                <Icon icon="heroicons:chat-bubble-left-right" width={24} className="inline mr-3" />
                Contact for Collaboration
                <Icon icon="heroicons:arrow-right" width={20} className="inline ml-3 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <div className="flex items-center gap-4">
                <div className="w-px h-8 bg-gray-300"></div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-600">2hrs</div>
                    <div className="text-xs text-gray-500">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-600">98%</div>
                    <div className="text-xs text-gray-500">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200/60">
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="heroicons:shield-check" width={16} />
                  <span>ISO Certified</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="heroicons:star" width={16} />
                  <span>5-Star Service</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="heroicons:clock" width={16} />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}