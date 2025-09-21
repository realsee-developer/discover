import { Icon } from "@iconify/react";
type Card = { title: string; author: string; img: string; badge: { text: string; cls: string } };

export function TourGrid() {
  const cards: Card[] = [
    {
      title: "Modern Apartment",
      author: "Alex Chen",
      badge: { text: "VR Ready", cls: "badge-primary" },
      img: "https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=200",
    },
    {
      title: "Cozy Cafe",
      author: "Emma Wilson",
      badge: { text: "360°", cls: "badge-secondary" },
      img: "https://images.unsplash.com/photo-1691067987421-ce180bfcb90c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=200",
    },
    {
      title: "Luxury Villa",
      author: "David Park",
      badge: { text: "4K", cls: "badge-accent" },
      img: "https://images.unsplash.com/photo-1622015663319-e97e697503ee?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=200",
    },
    {
      title: "Contemporary Art Gallery",
      author: "Lisa Zhang",
      badge: { text: "Interactive", cls: "badge-primary" },
      img: "https://images.unsplash.com/photo-1574367157590-3454fe866961?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=200",
    },
  ];

  return (
    <section className="tour-gallery-section bg-base-200 py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-base-content">Explore More 3D Tours</h2>
          <a href="/search" className="btn btn-primary btn-outline">
            View All Tours
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 tour-card cursor-pointer">
              <figure className="relative">
                <img src={card.img} alt={card.title} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2">
                  <div className={`badge ${card.badge.cls}`}>{card.badge.text}</div>
                </div>
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{card.title}</h3>
                <p className="text-sm text-base-content/70">by {card.author}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Icon className="text-warning" icon="heroicons:star-solid" width={16} />
                  <span className="text-sm">4.8</span>
                  <span className="text-sm text-base-content/50">(124 views)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


