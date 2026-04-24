import { SearchPageContent } from "@/components/news/search/search-page-content";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;

  return <SearchPageContent query={params?.q || ""} />;
}
