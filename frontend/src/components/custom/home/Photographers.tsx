import { Icon } from "@iconify/react";

export function Photographers() {
  const names = ["John Davis", "Sarah Miller", "Mike Rodriguez", "Emma Wilson"];
  return (
    <section className="featured-photographers-section bg-base-100 py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-base-content mb-2">Featured Photographers</h2>
            <p className="text-base-content/70">Discover talented creators in our community</p>
          </div>
            <a href="/photographer" className="btn btn-primary btn-outline">
              View All Photographers
            </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {names.map((name) => (
            <div key={name} className="photographer-card text-center cursor-pointer group">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-accent transition-colors">
                  <img src="https://placehold.co/96x96" alt={name} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">{name}</h3>
              <p className="text-sm text-base-content/70 mb-4">Luxury Real Estate Specialist</p>
              <div className="flex items-center justify-center gap-4 text-sm text-base-content/60">
                <span className="flex items-center gap-1">
                  <Icon icon="heroicons:photo" width={16} /> 24 Tours
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="heroicons:star" width={16} /> 4.9
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


