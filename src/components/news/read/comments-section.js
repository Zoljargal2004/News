"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-news";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const CommentsSection = ({ newsId }) => {
  const { user } = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/news/read/${newsId}/comments`, {
          cache: "no-store",
        });
        const payload = await res.json();

        if (!res.ok || !payload?.success) {
          throw new Error(payload?.error || "Сэтгэгдэл татахад алдаа гарлаа");
        }

        setComments(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        toast(error.message || "Сэтгэгдэл татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [newsId]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast("Сэтгэгдэл оруулна уу");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/news/read/${newsId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Сэтгэгдэл нийтлэхэд алдаа гарлаа");
      }

      setComments((current) => [payload.data, ...current]);
      setContent("");
    } catch (error) {
      toast(error.message || "Сэтгэгдэл нийтлэхэд алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t pt-8">
      <h2 className="text-xl font-semibold">Сэтгэгдэл</h2>

      {user ? (
        <div className="mt-4 space-y-3">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Сэтгэгдэл бичих"
          />
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Нийтэлж байна..." : "Сэтгэгдэл нийтлэх"}
          </Button>
        </div>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Сэтгэгдэл ачааллаж байна...</p>
      ) : null}

      {!loading && comments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Одоогоор сэтгэгдэл алга.</p>
      ) : null}

      <div className="mt-6 space-y-5">
        {comments.map((comment) => (
          <article key={comment.id} className="border-t pt-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <strong>{comment.user_name}</strong>
              <span className="text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p>{comment.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
