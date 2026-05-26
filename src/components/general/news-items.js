"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { politicalParties } from "@/data/political-parties";
import {
  isNewsSaved,
  SAVED_NEWS_UPDATED_EVENT,
  toggleSavedNews,
} from "@/lib/user-news-storage";

export const NewsCard = ({ data, variant = "default" }) => {
  const href = `/news/read/${data.id}`;
  const large = variant === "large";
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const syncSavedState = () => {
      setSaved(isNewsSaved(data?.id));
    };

    syncSavedState();
    window.addEventListener(SAVED_NEWS_UPDATED_EVENT, syncSavedState);
    window.addEventListener("storage", syncSavedState);

    return () => {
      window.removeEventListener(SAVED_NEWS_UPDATED_EVENT, syncSavedState);
      window.removeEventListener("storage", syncSavedState);
    };
  }, [data?.id]);

  const handleSaveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSaved(toggleSavedNews(data));
  };

  return (
    <article className="group">
      <div className="relative">
        <Link
          href={href}
          className="block overflow-hidden rounded-2xl bg-[#d9d9d9]"
        >
          <img
            src={data?.thumbnail || "/newpapers.png"}
            alt={data?.title || "Мэдээний зураг"}
            className={`${large ? "aspect-[16/9]" : "aspect-[4/3]"} w-full object-cover transition duration-300 group-hover:scale-[1.03]`}
          />
        </Link>
        <button
          type="button"
          aria-label={saved ? "Хадгалснаас хасах" : "Хадгалах"}
          aria-pressed={saved}
          onClick={handleSaveClick}
          className="absolute bottom-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-white text-black shadow-sm transition hover:scale-105"
        >
          <Bookmark className={`size-3.5 ${saved ? "fill-black" : ""}`} />
        </button>
      </div>
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
            <span>{large ? "2 мин унших" : "1 мин унших"}</span>
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
