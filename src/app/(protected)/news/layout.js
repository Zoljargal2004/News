"use client";

import { NewsProvider } from "@/hooks/provider-news-editor";

export default function CreateNewsLayout({ children }) {
  return <NewsProvider>{children}</NewsProvider>;
}
