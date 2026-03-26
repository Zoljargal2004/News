"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetOneNews } from "@/hooks/use-news";

export default function Page() {
  const { id } = useParams();

  const { getNews, loading, error } = useGetOneNews();

  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getNews(id);
        setNews(data);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  console.log(news);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full h-[470] overflow-hidden rounded-3xl">
        <img
          src={news?.thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-bold text-6xl">{news.title}</span>
      <NewsBody body={news.news} />
    </div>
  );
}

const NewsBody = ({ body }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {body.map((ele, i) => {
        if (ele.type === "p") {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: ele.value }}
            />
          );
        } else if (ele.type === "image") {
          return (
            <div key={i}>
              <img src={ele.src} className="w-full rounded-xl" />
            </div>
          );
        }
      })}
    </div>
  );
};