"use client";

import dynamic from "next/dynamic";
import { ImagePlus } from "lucide-react";
import { useEditNews } from "@/hooks/provider-news-editor";
import { useEffect, useRef } from "react";

const QuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
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
    <section className=" flex flex-col gap-8 mb-16">
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
    <div className="p-8 border-2 rounded-2xl">
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
        className="group flex w-full overflow-hidden rounded-[26px] border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex h-[470px] w-full items-center justify-center bg-[linear-gradient(135deg,#f8f8f8_0%,#e9e9e9_100%)]">
          {image?.src ? (
            <img
              src={image.src}
              alt="Selected content preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-black/45">
              <div className="rounded-full bg-[var(--secondary-background)] p-6">
                <ImagePlus size={72} />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-black">
                  Upload image
                </p>
                <p className="text-sm">Click here to choose an image</p>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
