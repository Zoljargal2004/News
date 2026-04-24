"use client";

import { GreenBgTitle } from "@/components/general/title";
import { NewsList } from "@/components/news/news-list";
import { useGetNews } from "@/hooks/use-news";

export const SearchPageContent = ({ query }) => {
  const safeQuery = String(query || "").trim();
  const { news, loading } = useGetNews({
    query: safeQuery,
    skip: !safeQuery,
  });

  return (
    <section className="mx-[200] flex flex-col gap-6">
      <GreenBgTitle title="Search" className="text-4xl font-bold" />
      {safeQuery ? <p>Results for: {safeQuery}</p> : <p>Type in the search bar to find news.</p>}
      {loading ? (
        <p>Loading news...</p>
      ) : (
        <NewsList news={news} emptyText="No matching news found." />
      )}
    </section>
  );
};
