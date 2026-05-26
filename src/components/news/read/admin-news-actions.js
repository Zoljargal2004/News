"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useNews } from "@/hooks/use-news";

export const AdminNewsActions = ({ newsId }) => {
  const router = useRouter();
  const { deleteNews, loading } = useNews();

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this news article?");

    if (!confirmed) {
      return;
    }

    const res = await deleteNews(newsId);

    if (res?.success) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/news/edit/${newsId}`}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-black/30 px-4 text-sm font-medium transition hover:bg-white"
      >
        <Pencil className="size-4" />
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-red-300 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        <Trash2 className="size-4" />
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};
