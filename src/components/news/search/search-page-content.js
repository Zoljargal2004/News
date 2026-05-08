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
    <section className="space-y-6">
      <header className="space-y-2">
        <GreenBgTitle title="Search" className="text-3xl font-semibold" />
        <p className="text-sm text-muted-foreground">
          {safeQuery
            ? `Results for "${safeQuery}"`
            : "Type in the search bar to find news."}
        </p>
      </header>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading news...</p>
      ) : (
        <NewsList news={news} emptyText="No matching news found." />
      )}
    </section>
  );
};
