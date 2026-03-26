"use client";

import { useGetNews } from "@/hooks/use-news";
import { Carousel } from "antd";

export const TodaysNews = () => {
  const { news, loading } = useGetNews({
    publishDate: new Date().toISOString().split("T")[0],
  });

  if (loading) return <div>Loading...</div>;

  return (
    <Carousel autoplay className="w-[80%] mx-auto">
      {news?.map((ele) => (
        <div
          key={ele.id}
          className="w-full mx-auto bg-red-50 rounded-4xl overflow-hidden"
        >
          <img
            src={ele.thumbnail}
            alt={ele.title}
            className="w-full h-[300] object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
};
