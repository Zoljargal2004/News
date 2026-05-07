import { getCurrentUser, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateNewsScreen } from "@/components/news/create/create-news-screen";

export default async function CreateNewsPage() {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    redirect("/");
  }

  return <CreateNewsScreen />;
}
