import { CategoryPageContent } from "@/components/news/category/category-page-content";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return <CategoryPageContent slug={slug} />;
}
