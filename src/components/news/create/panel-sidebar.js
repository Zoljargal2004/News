"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditNews } from "@/hooks/provider-news-editor";
import { useCategories, useNews } from "@/hooks/use-news";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GreenBgTitle } from "@/components/general/title";

const STATUS_OPTIONS = [
  { value: "published", label: "Public" },
  { value: "draft", label: "Draft" },
];

export const PanelSidebar = () => {
  const { categories: fetchedCategories, loading: categoriesLoading } =
    useCategories();
  const { uploadNews, loading: uploadLoading } = useNews();
  const {
    news,
    categories,
    status,
    recommended,
    title,
    thumbnailImage,
    politicalParty,
    setCategories,
    setStatus,
    setRecommended,
    setPoliticalParty,
    resetEditor,
  } = useEditNews();
  const [sources, setSources] = useState("");

  const availableCategories = useMemo(
    () =>
      [
        ...new Set(
          fetchedCategories
            .map((item) => (typeof item === "string" ? item : item?.name))
            .filter(Boolean),
        ),
      ].slice(0, 16),
    [fetchedCategories],
  );

  const toggleCategory = (categoryName) => {
    setCategories((current) =>
      current.includes(categoryName)
        ? current.filter((item) => item !== categoryName)
        : [...current, categoryName],
    );
  };

  const handleSubmit = async (publish = true) => {
    const res = await uploadNews({
      news,
      status: publish,
      categories,
      recommended,
      title: title.trim(),
      thumbnailImage,
      politicalParty: politicalParty.trim(),
      sources,
    });

    if (res?.success) {
      resetEditor();
      setSources("");
    }
  };

  return (
    <section className="rounded-3xl bg-[#d9d9d9] p-6">
      <div className="space-y-6">
        <PanelHeading title="Status & Visibility" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">Visibility</span>
          <Select value={status || "draft"} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-28 rounded-full border-black/70 bg-transparent">
              <SelectValue placeholder="Public" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATUS_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center justify-between gap-3 text-sm">
          Recommended
          <Checkbox
            checked={recommended}
            onCheckedChange={(checked) => setRecommended(Boolean(checked))}
          />
        </label>

        <div className="space-y-2">
          <p className="text-sm">Political party</p>
          <Input
            value={politicalParty}
            onChange={(event) => setPoliticalParty(event.target.value)}
            placeholder="Optional"
            className="h-9 rounded-full border-black/40 bg-transparent"
          />
        </div>

        <PanelHeading title="Categories" />
        <div className="grid grid-cols-2 gap-3">
          {categoriesLoading ? (
            <p className="col-span-2 text-xs text-black/45">Loading...</p>
          ) : (
            availableCategories.map((categoryName) => {
              const active = categories.includes(categoryName);

              return (
                <button
                  key={categoryName}
                  type="button"
                  onClick={() => toggleCategory(categoryName)}
                  className={`h-8 rounded-full border border-black/70 px-3 text-xs transition ${
                    active ? "bg-black text-white" : "bg-transparent text-black"
                  }`}
                >
                  {categoryName}
                </button>
              );
            })
          )}
        </div>

        <PanelHeading title="Sources" />
        <Textarea
          value={sources}
          onChange={(event) => setSources(event.target.value)}
          placeholder="Upload sources..."
          className="min-h-28 resize-none rounded-xl border-black/70 bg-transparent text-xs"
        />

        <div className="space-y-2 text-center">
          <Button
            type="button"
            className="h-8 rounded-none bg-transparent px-4 text-sm font-bold italic text-black shadow-none hover:bg-transparent"
            disabled={uploadLoading || !title.trim() || news.length === 0}
            onClick={() => handleSubmit(true)}
          >
            <GreenBgTitle title={uploadLoading ? "Publishing..." : "Publish"} />
          </Button>
          <button
            type="button"
            disabled={uploadLoading || !title.trim() || news.length === 0}
            onClick={() => handleSubmit(false)}
            className="block w-full text-sm font-bold italic underline disabled:opacity-50"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </section>
  );
};

export const CoverageDetails = () => {
  const rows = [
    ["Мэдээллийг бусад сургууд:", 16],
    ["АН намтай:", 3],
    ["МАН намтай:", 7],
    ["ХН намтай:", 1],
    ["Төвийг сахисан:", 5],
    ["Ерөнхий нам баримтлал:", 16],
  ];

  return (
    <section className="rounded-3xl bg-[#d9d9d9] p-6">
      <PanelHeading title="Coverage Details" />
      <div className="mt-4 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-black/70 p-3">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {["АН", "МАН", "ХН"].map((title, index) => (
            <div key={title} className="space-y-2">
              <p>{title}</p>
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-7 rounded-full ${
                    index === 0
                      ? "bg-red-400"
                      : index === 1
                        ? "bg-indigo-400"
                        : "bg-yellow-300"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs">Төвийг сахисан</p>
        <div className="mt-2 flex justify-center gap-1 rounded-full bg-white py-2">
          {["bg-red-400", "bg-yellow-400", "bg-green-400", "bg-blue-500"].map(
            (color, index) => (
              <span key={index} className={`size-5 rounded-full ${color}`} />
            ),
          )}
        </div>
        <p className="mt-3 border-b border-black/60 pb-2 text-center text-xs text-black/45">
          Энэ мэдээллийг бусад сайт дээрх холбоос тус бүрийг харах
        </p>
      </div>

      <p className="mt-4 flex gap-2 text-xs text-black/45">
        <Info className="mt-0.5 size-4 shrink-0" />
        Бус мэдээллийг хэрхэн хуваарьладаг талаар мэдээлэл авах
      </p>
    </section>
  );
};

const PanelHeading = ({ title }) => {
  return (
    <div className="space-y-3 text-center">
      <div className="flex items-center justify-center gap-2 text-sm font-bold">
        {title}
        <ChevronDown className="size-3" />
      </div>
      <div className="mx-auto h-px w-36 bg-black/70" />
    </div>
  );
};
