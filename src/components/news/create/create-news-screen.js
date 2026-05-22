"use client";

import { Pencil } from "lucide-react";
import { FileInput } from "@/components/news/create/file-input";
import { NewsEdit } from "@/components/news/create/news-edit";
import { PanelActions } from "@/components/news/create/panel-actions";
import { CoverageDetails, PanelSidebar } from "@/components/news/create/panel-sidebar";
import { useEditNews } from "@/hooks/provider-news-editor";
import { useCurrentUser } from "@/hooks/use-news";

export const CreateNewsScreen = () => {
  const { title, setTitle } = useEditNews();
  const { user } = useCurrentUser();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <main className="space-y-8">
        <FileInput />

        <section className="mx-auto max-w-3xl space-y-5 text-center">
          <label className="inline-flex max-w-full items-center justify-center gap-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Гарчиг"
              className="min-w-0 bg-transparent text-center text-4xl font-bold outline-none placeholder:text-black/80 sm:text-5xl"
            />
            <Pencil className="size-7 shrink-0 text-black/60" />
          </label>

          <div className="space-y-2 text-sm text-black/55">
            <img
              src={`https://i.pravatar.cc/80?u=${encodeURIComponent(user?.email || "author")}`}
              alt=""
              className="mx-auto size-12 rounded-full object-cover"
            />
            <p>Нийтэлсэн: {user?.name || "Newsletter.mn"}</p>
            <p className="text-xs text-black/35">
              {new Date().toLocaleDateString()} | 1,212,921 уншсан | 12 мин унших
            </p>
          </div>

          <div className="h-px bg-black/70" />
        </section>

        <NewsEdit />
        <PanelActions />
      </main>

      <aside className="space-y-8 lg:sticky lg:top-28">
        <PanelSidebar />
        <CoverageDetails />
      </aside>
    </div>
  );
};
