"use client";

import { News1 } from "@/components/general/news-items";

export const NewsList = ({ news = [], emptyText = "Мэдээ олдсонгүй." }) => {
  if (!news.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <News1 key={item.id} data={item} />
      ))}
    </div>
  );
};
