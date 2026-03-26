import { useEffect, useState } from "react";
import { toast } from "sonner";
import { APIHandler } from "@/lib/api-handler";

const buildNewsQuery = (filters = {}) => {
  const searchParams = new URLSearchParams();

  if (filters.publishDate) {
    searchParams.set("publish-date", filters.publishDate);
  }

  if (Array.isArray(filters.categoryIds) && filters.categoryIds.length > 0) {
    searchParams.set("category", filters.categoryIds.join(","));
  }

  const query = searchParams.toString();

  return query ? `/api/news?${query}` : "/api/news";
};

export const useGetNews = (filters = {}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);

      const res = await APIHandler(buildNewsQuery(filters), "GET");

      if (res?.data) {
        setNews(res.data);
      }

      setLoading(false);
    };

    getNews();
  }, [filters.publishDate, JSON.stringify(filters.categoryIds || [])]);

  return { news, loading };
};

export const useNews = () => {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) {
      return null;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);

    const res = await APIHandler("/api/general/image", "POST", form);

    if (!res?.success) {
      throw new Error(res?.error || "Image upload failed");
    }

    return res.data?.url || res.data?.data?.url || null;
  };

  const uploadNews = async (payload) => {
    try {
      setLoading(true);

      const thumbnail = await uploadImage(payload.thumbnailImage);
      const news = await Promise.all(
        payload.news.map(async (item) => {
          if (item?.type !== "image") {
            return item;
          }

          const uploadedImage = await uploadImage(item.file);

          return {
            type: "image",
            src: uploadedImage || item.src || "",
          };
        }),
      );

      const res = await APIHandler("/api/news", "POST", {
        news,
        status: payload.status,
        categories: payload.categories,
        recommended: payload.recommended,
        title: payload.title,
        thumbnail,
      });

      if (!res?.success) {
        throw new Error(res?.error || "Failed to create news");
      }

      toast("News created successfully");
      return res;
    } catch (error) {
      toast(error.message || "Failed to create news");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { uploadNews, loading };
};

export const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const res = await APIHandler("/api/news/categories", "GET");

      if (res?.success) {
        setCategories(
          Array.isArray(res.data)
            ? res.data
                .map((item) => (typeof item === "string" ? item : item?.name))
                .filter(Boolean)
            : [],
        );
      }

      setLoading(false);
    };

    getCategories();
  }, []);

  return { categories, loading };
};
