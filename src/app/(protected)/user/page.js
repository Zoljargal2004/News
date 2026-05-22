"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, Bookmark, CirclePlus } from "lucide-react";
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
  const [publishedItems, setPublishedItems] = useState([]);
  const [draftItems, setDraftItems] = useState([]);
  const [viewedNews, setViewedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorMode = user?.role === "admin";
  const displayUser = {
    ...(profileData || {}),
    name: user?.name || profileData?.name || "Уншигч",
    email: user?.email || profileData?.email || "",
    authorMode,
  };
  const latestViewedNews = viewedNews.length ? viewedNews : readingItems;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [
          profile,
          menu,
          savedNews,
          readingHistory,
          publishedNews,
          draftNews,
        ] = await Promise.all([
          getApiData("/api/user/profile"),
          getApiData("/api/user/menu"),
          getApiData("/api/user/saved-news"),
          getApiData("/api/user/reading-history"),
          getApiData("/api/user/published-news"),
          getApiData("/api/user/draft-news"),
        ]);

        setProfileData(profile);
        setMenuItems(Array.isArray(menu) ? menu : []);
        setSavedItems(Array.isArray(savedNews) ? savedNews : []);
        setReadingItems(Array.isArray(readingHistory) ? readingHistory : []);
        setPublishedItems(Array.isArray(publishedNews) ? publishedNews : []);
        setDraftItems(Array.isArray(draftNews) ? draftNews : []);
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
    return <p className="text-sm text-black/45">Профайл ачааллаж байна...</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-start">
      <ProfileMenu items={menuItems} />

      <section className="min-w-0 space-y-8">
        <ProfileHeader user={displayUser} />
        <NewsShelf title="Хадгалсан мэдээ" items={savedItems} />
        {authorMode ? (
          <>
            <NewsShelf
              title="Таны нийтэлсэн мэдээ"
              items={publishedItems}
              showCreateCard
            />
            <NewsShelf title="Ноорог мэдээ" items={draftItems} />
          </>
        ) : (
          <NewsShelf title="Сүүлд уншсан" items={latestViewedNews} />
        )}
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
          alt={`${user.name} профайл зураг`}
          className="size-20 rounded-full border-4 border-white object-cover shadow-sm"
        />
        <div>
          <div className="flex items-center gap-2">
            <GreenBgTitle
              title={user.name}
              className="text-3xl font-black italic leading-none"
            />
            {user.authorMode ? (
              <BadgeCheck className="size-5 fill-blue-500 text-white" />
            ) : null}
          </div>
          <p className="mt-2 text-sm text-black/55">{user.email}</p>
          <p className="text-sm text-black/55">{user.phone}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm">
        Зохиогчийн горим: {user.authorMode ? "асаалттай" : "унтраалттай"}
      </div>
    </div>
  );
};

const NewsShelf = ({ title, items, showCreateCard = false }) => {
  return (
    <section className="space-y-4">
      <GreenBgTitle title={title} className="text-3xl font-black italic" />
      {items.length || showCreateCard ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {showCreateCard ? <CreateNewsCard /> : null}
          {items.map((item) => (
            <ProfileNewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-black/45">Одоогоор профайлын мэдээ алга.</p>
      )}
    </section>
  );
};

const CreateNewsCard = () => {
  return (
    <article className="group min-w-0">
      <Link
        href="/news/create"
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-black/25 bg-[#d9d9d9] text-center text-black/65 transition hover:border-black/45 hover:text-black"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
          <CirclePlus className="size-7" />
        </span>
        <span className="px-4 text-xs font-semibold">Шинээр нийтлэл бичих</span>
      </Link>
      <p className="mt-2 text-[0.65rem] text-black/35">Мэдээ үүсгэх</p>
    </article>
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
        {item.date} | Зохиогч: {item.author}
      </p>
    </article>
  );
};
