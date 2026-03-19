"use client";

import { createContext, useContext, useState } from "react";

const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [news, setNews] = useState([]);
  const [thumbnail, setThumbnail] = useState();
  const [categories, setCategory] = useState([]);
  const [status, setStatus] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [title, setTitle] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null)

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
        setCategory,
        setStatus,
        setRecommended,
        setTitle,
        setThumbnailImage
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export const useEditNews = () => {
  const res = useContext(NewsContext);
  if(!res) throw new Error("use EditNews not bein used in its provider")
  return res;
};
