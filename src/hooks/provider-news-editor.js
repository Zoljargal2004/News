"use client";

import { createContext, useContext, useState } from "react";

const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [news, setNews] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("draft");
  const [recommended, setRecommended] = useState(false);
  const [title, setTitle] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null);

  const resetEditor = () => {
    setNews([]);
    setThumbnail("");
    setCategories([]);
    setStatus("draft");
    setRecommended(false);
    setTitle("");
    setThumbnailImage(null);
  };

  return (
    <NewsContext.Provider
      value={{
        news,
        thumbnail,
        categories,
        status,
        recommended,
        title,
        thumbnailImage,
        setNews,
        setThumbnail,
        setCategory: setCategories,
        setCategories,
        setStatus,
        setRecommended,
        setTitle,
        setThumbnailImage,
        resetEditor,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export const useEditNews = () => {
  const res = useContext(NewsContext);

  if (!res) {
    throw new Error("useEditNews must be used within NewsProvider");
  }

  return res;
};
