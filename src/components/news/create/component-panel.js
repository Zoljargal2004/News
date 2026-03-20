"use client";

import { PanelActions } from "@/components/news/create/panel-actions";
import { PanelSidebar } from "@/components/news/create/panel-sidebar";

export const Components = () => {
  return (
    <section className="mt-6 grid gap-4 pb-10 lg:grid-cols-[1fr_320px] lg:items-start">
      <PanelActions />
      <PanelSidebar />
    </section>
  );
};
