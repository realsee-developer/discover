"use client";

import { useMemo, useState } from "react";
import { getVrs, getVrTags, resolvePublicAssetPath } from "@/data/db";

const ALL = getVrs();
const CATEGORY_TAGS = getVrTags().filter((t) => t.type === "category");

export function SearchStateClient() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState("Relevance");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = ALL.filter((v) => {
      if (!activeCat) return true;
      const cat = v.category || v.shortCategory;
      return (cat || "").toLowerCase() === activeCat.toLowerCase();
    });
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((v) =>
        (v.title || "").toLowerCase().includes(q) || (v.description || "").toLowerCase().includes(q),
      );
    }
    if (sort === "Newest") {
      list = list.slice().sort((a, b) => (b.id > a.id ? 1 : -1));
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
          <button
            className={`btn btn-sm ${activeCat === null ? "btn-primary" : "btn-outline"}`}
            onClick={() => {
              setPage(1);
              setActiveCat(null);
            }}
          >
            All
          </button>
          {CATEGORY_TAGS.map((t) => (
            <button
              key={t.id}
              className={`btn btn-sm ${activeCat === t.label ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setPage(1);
                setActiveCat(t.label);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-base-content/70">About {filtered.length} results</div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by</span>
          <select className="select select-bordered select-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
            {['Relevance','Newest'].map(s => (<option key={s}>{s}</option>))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paged.map((v) => (
          <div key={v.id} className="card bg-base-100 shadow hover:shadow-xl tour-card">
            <figure className="relative">
              <img className="w-full h-48 object-cover" src={resolvePublicAssetPath(v.assetCover || v.cover) || v.remoteCover || "/file.svg"} alt={v.title || v.id} />
              <div className="absolute top-2 right-2">
                <div className="badge badge-primary">{v.shortCategory || v.category}</div>
              </div>
            </figure>
            <div className="card-body p-4">
              <h3 className="card-title text-base">{v.title || v.id}</h3>
              {v.device ? (<p className="text-sm text-base-content/70">Device: {v.device}</p>) : null}
              
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


