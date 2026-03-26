"use client";

import { useGetNews } from "@/hooks/use-news";
import { News1 } from "../general/news-items";
import { GreenBgTitle } from "../general/title";

export const RecentNews = () => {
  const { news, loading } = useGetNews();
  if (loading) return <span>Loading...</span>;

  return (
    <div>
      <GreenBgTitle title={"Онцлох мэдээ"} />

      <div className="grid grid-cols-2 gap-x-4">
        {news.slice(0, 2).map((ele) => (
          <News1 key={ele.id} data={ele} />
        ))}
      </div>
      <div className="flex flex-col"></div>
    </div>
  );
};
