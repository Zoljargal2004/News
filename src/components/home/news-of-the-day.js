"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronsUp } from "lucide-react";
import { NewsCard, PartyScoreBar } from "@/components/general/news-items";
import { GreenBgTitle } from "@/components/general/title";
import { useGetNews } from "@/hooks/use-news";
import { politicalParties } from "@/data/political-parties";

const SECTION_CONFIG = [
  { title: "Онцлох мэдээ", helper: "Шинэчилсэн мэдээ" },
  { title: "Шинэхэн мэдээ", helper: "Өнөөдрийн сонголт" },
  { title: "Олон улсын мэдээ", helper: "Гадаад ертөнц" },
  { title: "Танд санал болгох", helper: "Илүү олон нийтлэл" },
];

export const TodaysNews = () => {
  const [selectedParty, setSelectedParty] = useState("all");
  const { news, loading } = useGetNews({
    politicalParty: selectedParty === "all" ? "" : selectedParty,
  });

  if (loading) {
    return <p className="text-sm text-black/45">Loading news...</p>;
  }

  const today = news.slice(0, 4);

  return (
    <div className="space-y-12">
      <PartyFilter
        selectedParty={selectedParty}
        setSelectedParty={setSelectedParty}
      />

      {!news.length ? (
        <p className="text-sm text-black/45">No news found for this filter.</p>
      ) : null}

      {news.length ? (
        <>
      <section className="space-y-5">
        <SectionTitle title="Өнөөдрийн мэдээ" helper="2026.05.08" center />
        <div className="grid gap-4 lg:grid-cols-[1fr_1.65fr_1fr] lg:items-start">
          {today[0] ? <NewsCard data={today[0]} /> : null}
          {today[1] ? (
            <article className="group overflow-hidden rounded-2xl bg-white shadow-sm">
              <Link href={`/news/read/${today[1].id}`} className="relative block">
                <img
                  src={today[1].thumbnail || "/newpapers.png"}
                  alt={today[1].title}
                  className="aspect-[16/7] w-full object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 shadow-sm">
                  <h2 className="text-xl font-semibold leading-tight">
                    {today[1].title}
                  </h2>
                  <Meta item={today[1]} />
                  <div className="mt-3">
                    <PartyScoreBar scores={today[1].party_scores} />
                  </div>
                </div>
              </Link>
            </article>
          ) : null}
          {today[2] ? <NewsCard data={today[2]} /> : null}
        </div>
      </section>

      {SECTION_CONFIG.map((section, index) => {
        const start = 4 + index * 6;
        const items = news.slice(start, start + 6);
        const fallbackItems = items.length ? items : news.slice(0, 6);

        return (
          <NewsSection
            key={section.title}
            title={section.title}
            helper={section.helper}
            items={fallbackItems}
            lead={index !== SECTION_CONFIG.length - 1}
          />
        );
      })}

      <div className="flex flex-col items-center gap-2 pb-4">
        <ChevronsUp className="size-9 text-black/75" />
        <GreenBgTitle title="Жаахан дээрээс нь буцах" className="text-sm" />
      </div>
        </>
      ) : null}
    </div>
  );
};

const PartyFilter = ({ selectedParty, setSelectedParty }) => {
  const filterItems = [
    { id: "all", label: "Бүх мэдээ", shortLabel: "All", color: "#111111" },
    ...politicalParties,
  ];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <GreenBgTitle title="Намын хамаарлаар шүүх" className="text-3xl" />
          <p className="mt-2 text-sm text-black/45">
            Мэдээг АН, төвийг сахисан, МАН хамаарлаар харна.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterItems.map((party) => {
          const active = selectedParty === party.id;

          return (
            <button
              key={party.id}
              type="button"
              onClick={() => setSelectedParty(party.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black/70 hover:border-black/30"
              }`}
            >
              <span
                className="mr-2 inline-block size-2 rounded-full"
                style={{ backgroundColor: party.color }}
              />
              {party.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

const NewsSection = ({ title, helper, items, lead }) => {
  const [first, second, third, ...rest] = items;

  return (
    <section className="space-y-5">
      <SectionTitle title={title} helper={helper} />
      {lead ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr]">
          {first ? <NewsCard data={first} variant="large" /> : null}
          {second ? <NewsCard data={second} /> : null}
          {third ? <NewsCard data={third} /> : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(lead ? rest : items).slice(0, 16).map((item) => (
          <NewsCard key={`${title}-${item.id}`} data={item} />
        ))}
      </div>
    </section>
  );
};

const SectionTitle = ({ title, helper, center = false }) => {
  return (
    <div
      className={`flex items-end gap-3 ${center ? "justify-center text-center" : ""}`}
    >
      <GreenBgTitle title={title} className="text-3xl sm:text-4xl" />
      {helper ? <span className="pb-1 text-xs text-black/40">{helper}</span> : null}
    </div>
  );
};

const Meta = ({ item }) => {
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-[0.68rem] text-black/35">
      {item.created_at ? (
        <span>{new Date(item.created_at).toLocaleDateString()}</span>
      ) : null}
      {item.author_name ? <span>Author: {item.author_name}</span> : null}
      <span>2 min read</span>
    </div>
  );
};
