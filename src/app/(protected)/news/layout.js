"use client";

import { NewsProvider } from "@/hooks/provider-news-editor";

export default function CreateNewsLayout({ children }) {
  return (
    <NewsProvider>
      <div className="mx-[200]">{children}</div>
    </NewsProvider>
  );
}
