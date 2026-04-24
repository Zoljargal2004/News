"use client";

import { Components } from "@/components/news/create/component-panel";
import { FileInput } from "@/components/news/create/file-input";
import { NewsEdit } from "@/components/news/create/news-edit";

export const CreateNewsScreen = () => {
  return (
    <div className="mx-auto flex w-full max-w-[870] flex-col pb-10">
      <FileInput />
      <NewsEdit />
      <Components />
    </div>
  );
};
