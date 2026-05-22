"use client";

import { Bookmark, ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEditNews } from "@/hooks/provider-news-editor";

export const FileInput = () => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const { setThumbnailImage } = useEditNews();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    setThumbnailImage(file || null);

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={openPicker}
        className="group relative flex w-full overflow-hidden rounded-3xl bg-[#d9d9d9] text-left transition hover:bg-[#d0d0d0]"
      >
        <div className="flex aspect-[16/9] w-full items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Сонгосон нүүр зураг"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-lg bg-black/55 text-white">
              <ImagePlus className="size-10" />
            </div>
          )}
        </div>
        <span className="absolute bottom-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-white text-black shadow-sm">
          <Bookmark className="size-4 fill-black" />
        </span>
      </button>
      <p className="mt-2 text-right text-xs text-black/30">
        Эх сурвалж оруулна уу.
      </p>
    </div>
  );
};
