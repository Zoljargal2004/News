"use client";

import { News1 } from "@/components/general/news-items";

export const NewsList = ({ news = [], emptyText = "No news found." }) => {
  if (!news.length) {
    return <p>{emptyText}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {news.map((item) => (
        <News1 key={item.id} data={item} />
      ))}
    </div>
  );
};
