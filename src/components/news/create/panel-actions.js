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
    <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
      <Button className="h-10 rounded-full" onClick={addParagraphBlock}>
        Text block
      </Button>
      <Button
        className="h-10 rounded-full"
        variant="outline"
        onClick={addImageBlock}
      >
        Image block
      </Button>
    </div>
  );
};
