"use client";

import { useMemo, useState } from "react";

type Card = { id: number; title: string; author: string; img: string; cat: string; rating: number; views: number; time: number };

const ALL: Card[] = Array.from({ length: 36 }).map((_, i) => ({
  id: i + 1,
  title: `Result ${i + 1}`,
  author: i % 2 ? "Sarah Miller" : "Alex Chen",
  img: "https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=200",
  cat: ["Residential", "Commercial", "Hotel", "Restaurant", "Retail"][i % 5],
  rating: 4.5 + ((i % 5) * 0.1),
  views: 100 + i * 7,
  time: Date.now() - i * 86400000,
}));

export function SearchStateClient() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState("Relevance");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = ALL.filter((c) => (activeCat ? c.cat === activeCat : true));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q));
    }
    switch (sort) {
      case "Newest":
        list = list.slice().sort((a, b) => b.time - a.time);
        break;
      case "Views":
        list = list.slice().sort((a, b) => b.views - a.views);
        break;
      case "Rating":
        list = list.slice().sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [query, activeCat, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between mb-8">
        <div className="join w-full lg:max-w-xl">
          <input
            className="input input-bordered join-item w-full"
            placeholder="Search 3D tours, locations, styles..."
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") setPage(1);
            }}
          />
          <button className="btn btn-primary join-item" onClick={() => setPage(1)}>
            <span className="iconify" data-icon="heroicons:magnifying-glass" data-width="20"></span>
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[null, "Residential", "Commercial", "Hotel", "Restaurant", "Retail"].map((c) => (
            <button
              key={c ?? "all"}
              className={`btn btn-sm ${activeCat === c ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setPage(1);
                setActiveCat(c);
              }}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-base-content/70">About {filtered.length} results</div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by</span>
          <select className="select select-bordered select-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
            {['Relevance','Newest','Views','Rating'].map(s => (<option key={s}>{s}</option>))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paged.map((c) => (
          <div key={c.id} className="card bg-base-100 shadow hover:shadow-xl tour-card">
            <figure className="relative">
              <img className="w-full h-48 object-cover" src={c.img} alt={c.title} />
              <div className="absolute top-2 right-2">
                <div className="badge badge-primary">{c.cat}</div>
              </div>
            </figure>
            <div className="card-body p-4">
              <h3 className="card-title text-base">{c.title}</h3>
              <p className="text-sm text-base-content/70">by {c.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="iconify text-warning" data-icon="heroicons:star-solid" data-width="16"></span>
                <span className="text-sm">{c.rating.toFixed(1)}</span>
                <span className="text-sm text-base-content/50">({c.views} views)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="join mt-10 flex justify-center">
        <button className="join-item btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          «
        </button>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
          const n = i + 1;
          return (
            <button key={n} className={`join-item btn ${page === n ? "btn-active" : ""}`} onClick={() => setPage(n)}>
              {n}
            </button>
          );
        })}
        <button className="join-item btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          »
        </button>
      </div>
    </div>
  );
}


