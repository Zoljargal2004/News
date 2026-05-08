"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

export const NewsCard = ({ data, variant = "default" }) => {
  const href = `/news/read/${data.id}`;
  const large = variant === "large";

  return (
    <article className="group">
      <Link
        href={href}
        className="relative block overflow-hidden rounded-2xl bg-[#d9d9d9]"
      >
        <img
          src={data?.thumbnail || "/newpapers.png"}
          alt={data?.title || "News thumbnail"}
          className={`${large ? "aspect-[16/9]" : "aspect-[4/3]"} w-full object-cover transition duration-300 group-hover:scale-[1.03]`}
        />
        <span className="absolute bottom-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-white text-black shadow-sm">
          <Bookmark className="size-3.5 fill-black" />
        </span>
      </Link>
      <div className="mt-3 space-y-2">
        <h3
          className={`${large ? "text-2xl" : "text-sm"} font-semibold leading-tight`}
        >
          <Link href={href}>{data.title}</Link>
        </h3>
        <div className="flex flex-wrap gap-2 text-[0.68rem] text-black/35">
          {data.created_at ? (
            <span>{new Date(data.created_at).toLocaleDateString()}</span>
          ) : null}
          {data.author_name ? <span>{data.author_name}</span> : null}
          {data.created_at ? (
            <span>{large ? "2 min read" : "1 min read"}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export const News1 = NewsCard;
export const News2 = NewsCard;
