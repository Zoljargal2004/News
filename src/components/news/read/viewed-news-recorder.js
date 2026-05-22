"use client";

import { useEffect } from "react";

const VIEWED_NEWS_STORAGE_KEY = "newsletter_viewed_news";
const MAX_VIEWED_NEWS = 10;

export const ViewedNewsRecorder = ({ news }) => {
  useEffect(() => {
    if (!news?.id) {
      return;
    }

    const viewedItem = {
      id: news.id,
      title: news.title || "Untitled news",
      thumbnail: news.thumbnail || "/newpapers.png",
      date: news.created_at
        ? new Date(news.created_at).toLocaleDateString()
        : "",
      author: news.author_name || "Newsletter.mn",
      viewedAt: new Date().toISOString(),
    };

    try {
      const currentItems = JSON.parse(
        localStorage.getItem(VIEWED_NEWS_STORAGE_KEY) || "[]",
      );
      const withoutCurrent = Array.isArray(currentItems)
        ? currentItems.filter((item) => String(item.id) !== String(news.id))
        : [];

      localStorage.setItem(
        VIEWED_NEWS_STORAGE_KEY,
        JSON.stringify([viewedItem, ...withoutCurrent].slice(0, MAX_VIEWED_NEWS)),
      );
    } catch {
      localStorage.setItem(VIEWED_NEWS_STORAGE_KEY, JSON.stringify([viewedItem]));
    }
  }, [news]);

  return null;
};

export { VIEWED_NEWS_STORAGE_KEY };
