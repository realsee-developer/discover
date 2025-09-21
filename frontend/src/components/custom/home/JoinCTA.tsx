export function JoinCTA() {
  return (
    <section className="join-community-section bg-gradient-to-r from-primary/20 to-accent/20 py-20">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-base-content mb-6">Become a Realsee Creator</h2>
          <p className="text-xl text-base-content/80 mb-8">
            Join our community of talented photographers and 3D creators. Share your work, connect with clients, and showcase your skills to a global audience.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <span className="iconify text-primary text-2xl" data-icon="heroicons:users" data-width="32"></span>
              <span className="text-lg">Global Community</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="iconify text-accent text-2xl" data-icon="heroicons:camera" data-width="32"></span>
              <span className="text-lg">Professional Tools</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="iconify text-secondary text-2xl" data-icon="heroicons:currency-dollar" data-width="32"></span>
              <span className="text-lg">Monetize Your Work</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg px-12">
            <span className="iconify" data-icon="heroicons:rocket-launch" data-width="20"></span>
            Join Creator Center
          </button>
        </div>
      </div>
    </section>
  );
}


