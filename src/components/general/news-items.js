"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { politicalParties } from "@/data/political-parties";

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
        <PartyScoreBar scores={data.party_scores} />
      </div>
    </article>
  );
};

export const PartyScoreBar = ({ scores }) => {
  const safeScores = scores || {};
  const totalScore = politicalParties.reduce(
    (total, party) => total + Number(safeScores[party.id] || 0),
    0,
  );

  if (!totalScore) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex overflow-hidden rounded-full bg-black/10">
        {politicalParties.map((party) => {
          const score = Number(safeScores[party.id] || 0);
          const width = (score / totalScore) * 100;

          return (
            <span
              key={party.id}
              title={`${party.label}: ${score}%`}
              className="h-1.5"
              style={{
                width: `${width}%`,
                backgroundColor: party.color,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between gap-2 text-[0.6rem] text-black/35">
        {politicalParties.map((party) => (
          <span key={party.id}>{party.shortLabel}</span>
        ))}
      </div>
    </div>
  );
};

export const News1 = NewsCard;
export const News2 = NewsCard;
