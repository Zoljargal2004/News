"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { GreenBgTitle } from "@/components/general/title";
import { VIEWED_NEWS_STORAGE_KEY } from "@/components/news/read/viewed-news-recorder";
import { useCurrentUser } from "@/hooks/use-news";
import {
  profileMenuItems,
  profileUser,
  readingHistory,
  savedNews,
} from "@/data/user-page-data";

export default function User() {
  const { user } = useCurrentUser();
  const [viewedNews, setViewedNews] = useState([]);
  const displayUser = {
    ...profileUser,
    name: user?.name || profileUser.name,
    email: user?.email || profileUser.email,
  };
  const latestViewedNews = viewedNews.length ? viewedNews : readingHistory;

  useEffect(() => {
    try {
      const storedItems = JSON.parse(
        localStorage.getItem(VIEWED_NEWS_STORAGE_KEY) || "[]",
      );

      setViewedNews(Array.isArray(storedItems) ? storedItems : []);
    } catch {
      setViewedNews([]);
    }
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-start">
      <ProfileMenu items={profileMenuItems} />

      <section className="min-w-0 space-y-8">
        <ProfileHeader user={displayUser} />
        <NewsShelf title="Хадгалсан мэдээ" items={savedNews} />
        <NewsShelf
          title="Сүүлд уншсан"
          items={latestViewedNews}
        />
      </section>
    </div>
  );
}

const ProfileMenu = ({ items }) => {
  return (
    <aside className="rounded-2xl bg-[#d9d9d9] px-5 py-3 text-center text-xs text-black/75 lg:sticky lg:top-28">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          className={`block w-full py-4 transition hover:text-black ${
            index === 0 ? "font-semibold text-black" : ""
          } ${index !== items.length - 1 ? "border-b border-black/30" : ""}`}
        >
          {item}
        </button>
      ))}
    </aside>
  );
};

const ProfileHeader = ({ user }) => {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={`${user.name} profile`}
          className="size-20 rounded-full border-4 border-white object-cover shadow-sm"
        />
        <div>
          <GreenBgTitle
            title={user.name}
            className="text-3xl font-black italic leading-none"
          />
          <p className="mt-2 text-sm text-black/55">{user.email}</p>
          <p className="text-sm text-black/55">{user.phone}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm">
        Author mode: {user.authorMode ? "on" : "off"}
      </div>
    </div>
  );
};

const NewsShelf = ({ title, items, helper }) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <GreenBgTitle title={title} className="text-3xl font-black italic" />
        {helper ? (
          <span className="pb-1 text-xs text-black/45">{helper}</span>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <ProfileNewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

const ProfileNewsCard = ({ item }) => {
  return (
    <article className="group min-w-0">
      <Link
        href={`/news/read/${item.id}`}
        className="relative block overflow-hidden rounded-lg bg-[#d9d9d9]"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-white text-black shadow-sm">
          <Bookmark className="size-3.5 fill-black" />
        </span>
      </Link>
      <h2 className="mt-2 line-clamp-3 text-xs font-semibold leading-tight">
        <Link href={`/news/read/${item.id}`}>{item.title}</Link>
      </h2>
      <p className="mt-2 text-[0.65rem] text-black/35">
        {item.date} | Author: {item.author}
      </p>
    </article>
  );
};
