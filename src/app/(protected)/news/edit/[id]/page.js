import { notFound, redirect } from "next/navigation";
import { CreateNewsScreen } from "@/components/news/create/create-news-screen";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isObjectId, News, serializeNews } from "@/lib/models";

export default async function EditNewsPage({ params }) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    redirect("/");
  }

  const { id } = await params;

  if (!isObjectId(id)) {
    notFound();
  }

  await connectDB();

  const news = await News.findById(id)
    .populate("author_id", "name email")
    .populate("categories", "name")
    .lean();

  if (!news) {
    notFound();
  }

  return <CreateNewsScreen initialNews={serializeNews(news)} />;
}
