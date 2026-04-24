"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
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
    setTitle,
    setPoliticalParty,
    resetEditor,
  } = useEditNews();

  const availableCategories = useMemo(
    () =>
      [
        ...new Set(
          fetchedCategories
            .map((item) => (typeof item === "string" ? item : item?.name))
            .filter(Boolean),
        ),
      ],
    [fetchedCategories],
  );

  const toggleCategory = (categoryName) => {
    setCategories((current) =>
      current.includes(categoryName)
        ? current.filter((item) => item !== categoryName)
        : [...current, categoryName],
    );
  };

  const handleSubmit = async () => {
    const res = await uploadNews({
      news,
      status: status === "published",
      categories,
      recommended,
      title: title.trim(),
      thumbnailImage,
      politicalParty: politicalParty.trim(),
    });

    if (res?.success) {
      resetEditor();
    }
  };

  return (
    <aside className="rounded-3xl border border-black/10 bg-sidebar p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex flex-col gap-5">
        <TitleField title={title} setTitle={setTitle} />
        <RecommendedField
          recommended={recommended}
          setRecommended={setRecommended}
        />
        <PoliticalPartyField
          politicalParty={politicalParty}
          setPoliticalParty={setPoliticalParty}
        />
        <StatusField status={status} setStatus={setStatus} />
        <CategoriesField
          categories={categories}
          availableCategories={availableCategories}
          categoriesLoading={categoriesLoading}
          toggleCategory={toggleCategory}
        />
        <PublishButton
          disabled={uploadLoading || !title.trim() || news.length === 0}
          loading={uploadLoading}
          onClick={handleSubmit}
        />
      </div>
    </aside>
  );
};

const TitleField = ({ title, setTitle }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Title</p>
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter a news title"
      />
    </div>
  );
};

const RecommendedField = ({ recommended, setRecommended }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">Recommended</span>
      <Checkbox
        checked={recommended}
        onCheckedChange={(checked) => setRecommended(Boolean(checked))}
      />
    </div>
  );
};

const PoliticalPartyField = ({ politicalParty, setPoliticalParty }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Political party</p>
      <Input
        value={politicalParty}
        onChange={(event) => setPoliticalParty(event.target.value)}
        placeholder="Which party benefits from this news?"
      />
    </div>
  );
};

const StatusField = ({ status, setStatus }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Status</p>
      <Select value={status || "draft"} onValueChange={setStatus}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose status" />
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
  );
};

const CategoriesField = ({
  categories,
  availableCategories,
  categoriesLoading,
  toggleCategory,
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">Categories</p>
        <p className="text-xs text-black/55">
          {categoriesLoading
            ? "Loading categories..."
            : "Choose from the built-in categories"}
        </p>
      </div>

      {availableCategories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((categoryName) => {
            const active = categories.includes(categoryName);

            return (
              <Button
                key={categoryName}
                type="button"
                variant={active ? "default" : "outline"}
                className="h-8"
                onClick={() => toggleCategory(categoryName)}
              >
                {categoryName}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const PublishButton = ({ disabled, loading, onClick }) => {
  return (
    <Button className="h-11" onClick={onClick} disabled={disabled}>
      {loading ? "Saving..." : "Publish news"}
    </Button>
  );
};
