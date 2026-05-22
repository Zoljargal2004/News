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
        <GreenBgTitle title="Хайлт" className="text-3xl font-semibold" />
        <p className="text-sm text-muted-foreground">
          {safeQuery
            ? `"${safeQuery}" хайлтын үр дүн`
            : "Мэдээ хайхын тулд хайлтын талбарт бичнэ үү."}
        </p>
      </header>
      {loading ? (
        <p className="text-sm text-muted-foreground">Мэдээ ачааллаж байна...</p>
      ) : (
        <NewsList news={news} emptyText="Тохирох мэдээ олдсонгүй." />
      )}
    </section>
  );
};
