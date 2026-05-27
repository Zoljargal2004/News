"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, Bookmark, CirclePlus } from "lucide-react";
import { GreenBgTitle } from "@/components/general/title";
import { ProfileMenu } from "@/components/user/profile-menu";
import {
  VIEWED_NEWS_STORAGE_KEY,
  VIEWED_NEWS_UPDATED_EVENT,
} from "@/components/news/read/viewed-news-recorder";
import { useCurrentUser } from "@/hooks/use-news";
import {
  isNewsSaved,
  readSavedNews,
  SAVED_NEWS_UPDATED_EVENT,
  toggleSavedNews,
  toStoredNewsItem,
} from "@/lib/user-news-storage";

const getApiData = async (url) => {
  const res = await fetch(url);
  const payload = await res.json();

  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || `Failed to load ${url}`);
  }

  return payload.data;
};

const normalizeProfileNewsItem = (item) => {
  const storedItem = toStoredNewsItem(item);

  return {
    ...item,
    ...storedItem,
    author: item?.author || item?.author_name || storedItem.author,
    date:
      item?.date ||
      (item?.created_at ? new Date(item.created_at).toLocaleDateString() : ""),
  };
};

const readViewedNews = () => {
  try {
    const storedItems = JSON.parse(
      localStorage.getItem(VIEWED_NEWS_STORAGE_KEY) || "[]",
    );

    return Array.isArray(storedItems)
      ? storedItems.filter((item) => item?.id).map(normalizeProfileNewsItem)
      : [];
  } catch {
    return [];
  }
};

export default function User() {
  const { user, loading: userLoading } = useCurrentUser();
  const [profileData, setProfileData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
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

  useEffect(() => {
    if (userLoading) {
      return;
    }

    const loadProfileData = async () => {
      try {
        const [profile, menu, publishedNews, draftNews] = await Promise.all([
          getApiData("/api/user/profile"),
          getApiData("/api/user/menu"),
          getApiData("/api/user/published-news"),
          getApiData("/api/user/draft-news"),
        ]);

        setProfileData(profile);
        setMenuItems(Array.isArray(menu) ? menu : []);
        setPublishedItems(
          Array.isArray(publishedNews)
            ? publishedNews.map(normalizeProfileNewsItem)
            : [],
        );
        setDraftItems(
          Array.isArray(draftNews) ? draftNews.map(normalizeProfileNewsItem) : [],
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userLoading]);

  useEffect(() => {
    const syncLocalNews = () => {
      setSavedItems(readSavedNews().map(normalizeProfileNewsItem));
      setViewedNews(readViewedNews());
    };

    syncLocalNews();
    window.addEventListener(SAVED_NEWS_UPDATED_EVENT, syncLocalNews);
    window.addEventListener(VIEWED_NEWS_UPDATED_EVENT, syncLocalNews);
    window.addEventListener("storage", syncLocalNews);

    return () => {
      window.removeEventListener(SAVED_NEWS_UPDATED_EVENT, syncLocalNews);
      window.removeEventListener(VIEWED_NEWS_UPDATED_EVENT, syncLocalNews);
      window.removeEventListener("storage", syncLocalNews);
    };
  }, []);

  if (loading || userLoading) {
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
        ) : null}
        <NewsShelf title="Сүүлд уншсан" items={viewedNews} />
      </section>
    </div>
  );
}

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
        </div>
      </div>

      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm">
        Нийтлэгчийн горим: {user.authorMode ? "асаалттай" : "унтраалттай"}
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
  const [saved, setSaved] = useState(false);
  const href = `/news/read/${item.id}`;

  useEffect(() => {
    const syncSavedState = () => {
      setSaved(isNewsSaved(item.id));
    };

    syncSavedState();
    window.addEventListener(SAVED_NEWS_UPDATED_EVENT, syncSavedState);
    window.addEventListener("storage", syncSavedState);

    return () => {
      window.removeEventListener(SAVED_NEWS_UPDATED_EVENT, syncSavedState);
      window.removeEventListener("storage", syncSavedState);
    };
  }, [item.id]);

  const handleSaveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSaved(toggleSavedNews(item));
  };

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link
          href={href}
          className="block overflow-hidden rounded-lg bg-[#d9d9d9]"
        >
          <img
            src={item.thumbnail || "/newpapers.png"}
            alt={item.title}
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
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
      <h2 className="mt-2 line-clamp-3 text-xs font-semibold leading-tight">
        <Link href={href}>{item.title}</Link>
      </h2>
      <p className="mt-2 text-[0.65rem] text-black/35">
        {item.date} | Зохиогч: {item.author}
      </p>
    </article>
  );
};
