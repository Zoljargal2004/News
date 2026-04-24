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
    return <p>Loading category...</p>;
  }

  if (!category) {
    return <p>Category not found.</p>;
  }

  return (
    <section className="mx-[200] flex flex-col gap-6">
      <GreenBgTitle title={category.name} className="text-4xl font-bold" />
      {newsLoading ? (
        <p>Loading news...</p>
      ) : (
        <NewsList news={news} emptyText="No news in this category yet." />
      )}
    </section>
  );
};
