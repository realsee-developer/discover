import React from "react";
import { SearchStateClient } from "./SearchStateClient";

export default function SearchPage() {
  return (
    <main className="bg-base-100 min-h-screen">
      <section className="container mx-auto px-6 py-8">
        <SearchStateClient />
      </section>
    </main>
  );
}


