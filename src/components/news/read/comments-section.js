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

  return new Intl.DateTimeFormat("en-US", {
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
          throw new Error(payload?.error || "Failed to fetch comments");
        }

        setComments(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        toast(error.message || "Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [newsId]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast("Comment is required");
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
        throw new Error(payload?.error || "Failed to create comment");
      }

      setComments((current) => [payload.data, ...current]);
      setContent("");
    } catch (error) {
      toast(error.message || "Failed to create comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h2>Comments</h2>

      {user ? (
        <div>
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment"
          />
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Posting..." : "Post comment"}
          </Button>
        </div>
      ) : null}

      {loading ? <p>Loading comments...</p> : null}

      {!loading && comments.length === 0 ? <p>No comments yet.</p> : null}

      {comments.map((comment) => (
        <article key={comment.id}>
          <p>
            <strong>{comment.user_name}</strong>
            {comment.user_role ? ` (${comment.user_role})` : ""}
          </p>
          <p>{formatDate(comment.created_at)}</p>
          <p>{comment.content}</p>
        </article>
      ))}
    </section>
  );
};
