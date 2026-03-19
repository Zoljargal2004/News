"use client";

import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const FileInput = () => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

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

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFileName(file.name);
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
        className="group  bg-secondary-background flex w-full overflow-hidden rounded-[26px] border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex h-[470] w-full items-center justify-center bg-[linear-gradient(135deg,#f8f8f8_0%,#e9e9e9_100%)]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={fileName || "Selected upload preview"}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus size={94} />
          )}
        </div>
      </button>
      
    </div>
  );
};
