"use client";

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
    <>
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
        <div className="flex h-[320px] w-full items-center justify-center bg-[linear-gradient(135deg,#f8f8f8_0%,#e9e9e9_100%)]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={fileName || "Selected upload preview"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 text-center text-black/55">
              <div className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                Choose image
              </div>
              <p className="text-sm">Click to upload and preview your image</p>
              <p className="text-xs uppercase tracking-[0.24em] text-black/35">
                PNG, JPG, WEBP
              </p>
            </div>
          )}
        </div>
      </button>
      {fileName ? (
        <p className="mt-3 text-sm text-black/55">{fileName}</p>
      ) : null}
    </>
  );
};
