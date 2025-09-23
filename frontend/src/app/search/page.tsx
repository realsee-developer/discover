import React from "react";
import { SearchStateClient } from "./SearchStateClient";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) as SearchParams | undefined;
  const initialQuery =
    typeof params?.q === "string"
      ? params.q
      : Array.isArray(params?.q)
        ? params.q[0]
        : "";
  return (
    <main className="bg-transparent min-h-screen">
      <section className="container mx-auto px-6 py-8">
        <SearchStateClient initialQuery={initialQuery} />
      </section>
    </main>
  );
}


