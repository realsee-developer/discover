import React from "react";
import { PlayerClient } from "./PlayerClient";

export default function ViewerPage() {
  return (
    <main className="min-h-screen bg-base-100">
      <section className="container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Player */}
        <div className="lg:col-span-8">
          <PlayerClient />
          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="btn btn-sm btn-primary">
              <span className="iconify" data-icon="heroicons:arrows-pointing-out" data-width="16"></span>
              Fullscreen
            </button>
            <button className="btn btn-sm">
              <span className="iconify" data-icon="heroicons:camera" data-width="16"></span>
              Snapshot
            </button>
            <button className="btn btn-sm">
              <span className="iconify" data-icon="heroicons:share" data-width="16"></span>
              Share
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Luxury Modern Home</h2>
              <p className="text-sm text-base-content/70">Stunning residence with panoramic city views</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://placehold.co/40x40?text=JD" alt="John Davis" />
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">John Davis</div>
                  <div className="text-base-content/60">Photographer</div>
                </div>
              </div>
              <div className="divider"></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><span className="iconify" data-icon="heroicons:home" data-width="16"></span> Residential</div>
                <div className="flex items-center gap-2"><span className="iconify" data-icon="heroicons:map-pin" data-width="16"></span> New York</div>
                <div className="flex items-center gap-2"><span className="iconify" data-icon="heroicons:calendar" data-width="16"></span> 2025-09-01</div>
                <div className="flex items-center gap-2"><span className="iconify" data-icon="heroicons:video-camera" data-width="16"></span> 4K</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary btn-sm w-full">Contact Photographer</button>
                <button className="btn btn-outline btn-sm w-full">Save</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow mt-6">
            <div className="card-body">
              <h3 className="card-title text-base">About this tour</h3>
              <p className="text-sm text-base-content/80">
                Explore the immersive 3D tour of this modern luxury home featuring open spaces, high-end finishes, and breathtaking skyline.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}


