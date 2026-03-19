"use client"

import { createContext, useState } from "react";

const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [news, setNews] = useState([])
  const [thumbnail, setThumbnail] = useState()
  const [categories, setCategory] = useState()

  return (
    <NewsContext.Provider value={{ user, setUser }}>
      {children}
    </NewsContext.Provider>
  );
}