"use client";

import { PanelActions } from "@/components/news/create/panel-actions";
import { PanelSidebar } from "@/components/news/create/panel-sidebar";

export const Components = () => {
  return (
    <section className="grid gap-5 pb-10 lg:grid-cols-[1fr_300px] lg:items-start">
      <PanelActions />
      <PanelSidebar />
    </section>
  );
};
