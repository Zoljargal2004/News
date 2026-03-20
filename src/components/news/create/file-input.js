"use client";

import { ImagePlus } from "lucide-react";
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
    <div className="mt-8">
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
        className="group flex w-full overflow-hidden rounded-[26px] border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex h-[470px] w-full items-center justify-center bg-[linear-gradient(135deg,#f8f8f8_0%,#e9e9e9_100%)]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected upload preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-black/45">
              <div className="rounded-full bg-[var(--secondary-background)] p-6">
                <ImagePlus size={72} />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-black">Upload thumbnail</p>
                <p className="text-sm">Click here to choose an image</p>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
