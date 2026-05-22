"use client";

import dynamic from "next/dynamic";
import { ImagePlus } from "lucide-react";
import { useEditNews } from "@/hooks/provider-news-editor";
import { useEffect, useRef } from "react";

const QuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Редактор ачааллаж байна...</p>,
});

export const NewsEdit = () => {
  const { news, setNews } = useEditNews();

  const handleParagraphChange = (index, value) => {
    setNews((currentNews) =>
      currentNews.map((item, itemIndex) =>
        itemIndex === index ? { ...item, value } : item,
      ),
    );
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      {news.length === 0 ? (
        <p className="text-sm text-black/65">Эндээс бичиж эхлэнэ үү...</p>
      ) : null}
      {news.map((ele, i) =>
        ele.type == "p" ? (
          <Editor
            key={i}
            para={ele.value}
            onChange={(value) => handleParagraphChange(i, value)}
          />
        ) : (
          <NewsImageInput
            key={i}
            image={ele}
            onChange={(value) =>
              setNews((currentNews) =>
                currentNews.map((item, itemIndex) =>
                  itemIndex === i ? { ...item, ...value } : item,
                ),
              )
            }
          />
        ),
      )}
    </section>
  );
};

const Editor = ({ para, onChange }) => {
  return (
    <div className="rounded-2xl border border-black/20 bg-white p-3">
      <QuillEditor theme="snow" value={para} onChange={onChange} />
    </div>
  );
};

const NewsImageInput = ({ image, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (image?.src?.startsWith("blob:")) {
        URL.revokeObjectURL(image.src);
      }
    };
  }, [image?.src]);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (image?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(image.src);
    }

    onChange({
      file,
      src: URL.createObjectURL(file),
    });
  };

  return (
    <div className="w-full">
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
        className="group flex w-full overflow-hidden rounded-2xl border border-black/20 bg-[#d9d9d9] text-left transition hover:bg-[#d0d0d0]"
      >
        <div className="flex aspect-video w-full items-center justify-center">
          {image?.src ? (
            <img
              src={image.src}
              alt="Сонгосон агуулгын зураг"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-black/45">
              <ImagePlus className="size-10" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Зураг оруулах
                </p>
                <p className="text-xs">Зураг сонгохын тулд дарна уу</p>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
