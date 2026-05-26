export const SAVED_NEWS_STORAGE_KEY = "newsletter_saved_news";
export const SAVED_NEWS_UPDATED_EVENT = "newsletter_saved_news_updated";

const MAX_SAVED_NEWS = 50;

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString();
};

export const toStoredNewsItem = (news) => {
  return {
    id: String(news?.id || ""),
    title: news?.title || "Гарчиггүй мэдээ",
    thumbnail: news?.thumbnail || "/newpapers.png",
    date: news?.date || formatDate(news?.created_at),
    author: news?.author || news?.author_name || "Newsletter.mn",
    created_at: news?.created_at || null,
  };
};

export const readSavedNews = () => {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const savedNews = JSON.parse(
      storage.getItem(SAVED_NEWS_STORAGE_KEY) || "[]",
    );

    return Array.isArray(savedNews)
      ? savedNews.filter((item) => item?.id).map(toStoredNewsItem)
      : [];
  } catch {
    return [];
  }
};

export const writeSavedNews = (items) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    SAVED_NEWS_STORAGE_KEY,
    JSON.stringify(items.slice(0, MAX_SAVED_NEWS)),
  );
  window.dispatchEvent(new Event(SAVED_NEWS_UPDATED_EVENT));
};

export const isNewsSaved = (newsId) => {
  return readSavedNews().some((item) => String(item.id) === String(newsId));
};

export const toggleSavedNews = (news) => {
  const savedNews = readSavedNews();
  const newsId = String(news?.id || "");

  if (!newsId) {
    return false;
  }

  if (savedNews.some((item) => String(item.id) === newsId)) {
    writeSavedNews(savedNews.filter((item) => String(item.id) !== newsId));
    return false;
  }

  writeSavedNews([toStoredNewsItem(news), ...savedNews]);
  return true;
};
