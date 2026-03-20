"use client";

import { Button } from "@/components/ui/button";
import { useEditNews } from "@/hooks/provider-news-editor";

export const PanelActions = () => {
  const { setNews } = useEditNews();

  const addParagraphBlock = () => {
    setNews((current) => [...current, { type: "p", value: "" }]);
  };

  const addImageBlock = () => {
    setNews((current) => [
      ...current,
      { type: "image", src: "", file: null },
    ]);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button className="h-14" onClick={addParagraphBlock}>
        Add text block
      </Button>
      <Button className="h-14" variant="outline" onClick={addImageBlock}>
        Add image block
      </Button>
    </div>
  );
};
