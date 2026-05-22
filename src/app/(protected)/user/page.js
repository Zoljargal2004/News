"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { GreenBgTitle } from "@/components/general/title";
import { VIEWED_NEWS_STORAGE_KEY } from "@/components/news/read/viewed-news-recorder";
import { useCurrentUser } from "@/hooks/use-news";

const getApiData = async (url) => {
  const res = await fetch(url);
  const payload = await res.json();

  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || `Failed to load ${url}`);
  }

  return payload.data;
};

export default function User() {
  const { user } = useCurrentUser();
  const [profileData, setProfileData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [readingItems, setReadingItems] = useState([]);
  const [viewedNews, setViewedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayUser = {
    ...(profileData || {}),
    name: user?.name || profileData?.name || "Reader",
    email: user?.email || profileData?.email || "",
  };
  const latestViewedNews = viewedNews.length ? viewedNews : readingItems;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [profile, menu, savedNews, readingHistory] = await Promise.all([
          getApiData("/api/user/profile"),
          getApiData("/api/user/menu"),
          getApiData("/api/user/saved-news"),
          getApiData("/api/user/reading-history"),
        ]);

        setProfileData(profile);
        setMenuItems(Array.isArray(menu) ? menu : []);
        setSavedItems(Array.isArray(savedNews) ? savedNews : []);
        setReadingItems(Array.isArray(readingHistory) ? readingHistory : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

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

  if (loading) {
    return <p className="text-sm text-black/45">Loading profile...</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-start">
      <ProfileMenu items={menuItems} />

      <section className="min-w-0 space-y-8">
        <ProfileHeader user={displayUser} />
        <NewsShelf title="Хадгалсан мэдээ" items={savedItems} />
        <NewsShelf title="Сүүлд уншсан" items={latestViewedNews} />
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

const NewsShelf = ({ title, items }) => {
  return (
    <section className="space-y-4">
      <GreenBgTitle title={title} className="text-3xl font-black italic" />
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <ProfileNewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-black/45">No profile news yet.</p>
      )}
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
