"use client";

import { GreenBgTitle } from "@/components/general/title";
import { NewsList } from "@/components/news/news-list";
import { useCategories, useGetNews } from "@/hooks/use-news";
import { categoryMatchesSlug } from "@/lib/categories";

export const CategoryPageContent = ({ slug }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const category = categories.find((item) => categoryMatchesSlug(item, slug));
  const { news, loading: newsLoading } = useGetNews({
    categoryNames: category?.name ? [category.name] : [],
    skip: !category?.name,
  });

  if (categoriesLoading) {
    return <p className="text-sm text-muted-foreground">Loading category...</p>;
  }

  if (!category) {
    return <p className="text-sm text-muted-foreground">Category not found.</p>;
  }

  return (
    <section className="space-y-6">
      <GreenBgTitle title={category.name} className="text-3xl font-semibold" />
      {newsLoading ? (
        <p className="text-sm text-muted-foreground">Loading news...</p>
      ) : (
        <NewsList news={news} emptyText="No news in this category yet." />
      )}
    </section>
  );
};
