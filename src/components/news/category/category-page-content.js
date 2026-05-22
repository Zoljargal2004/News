"use client";

import { GreenBgTitle } from "@/components/general/title";
import { NewsList } from "@/components/news/news-list";
import { useCategories, useGetNews } from "@/hooks/use-news";
import { categoryMatchesSlug, getCategoryDisplayName } from "@/lib/categories";

export const CategoryPageContent = ({ slug }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const category = categories.find((item) => categoryMatchesSlug(item, slug));
  const { news, loading: newsLoading } = useGetNews({
    categoryNames: category?.name ? [category.name] : [],
    skip: !category?.name,
  });

  if (categoriesLoading) {
    return <p className="text-sm text-muted-foreground">Ангилал ачааллаж байна...</p>;
  }

  if (!category) {
    return <p className="text-sm text-muted-foreground">Ангилал олдсонгүй.</p>;
  }

  return (
    <section className="space-y-6">
      <GreenBgTitle
        title={getCategoryDisplayName(category)}
        className="text-3xl font-semibold"
      />
      {newsLoading ? (
        <p className="text-sm text-muted-foreground">Мэдээ ачааллаж байна...</p>
      ) : (
        <NewsList news={news} emptyText="Энэ ангилалд одоогоор мэдээ алга." />
      )}
    </section>
  );
};
