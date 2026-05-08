import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CommentsSection } from "@/components/news/read/comments-section";

const getBaseUrl = async () => {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") || headerStore.get("host") || "";
  const protocol =
    headerStore.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
};

const getNewsById = async (id) => {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/news/read/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  const payload = await res.json();

  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || "Failed to fetch news");
  }

  return payload.data;
};

export default async function Page({ params }) {
  const { id } = await params;
  const news = await getNewsById(id);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <div className="overflow-hidden rounded-lg bg-muted">
        <img
          src={news?.thumbnail || "/newpapers.png"}
          alt={news?.title || "thumbnail"}
          className="aspect-video w-full object-cover"
        />
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          {news?.title}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {news?.author_name ? <span>By {news.author_name}</span> : null}
          {news?.political_party ? (
            <span>Related party: {news.political_party}</span>
          ) : null}
        </div>
      </header>

      <NewsBody body={news?.news || []} />
      <CommentsSection newsId={news.id} />
    </article>
  );
}

const NewsBody = ({ body }) => {
  return (
    <div className="space-y-5 text-base leading-7">
      {body.map((ele, i) => {
        if (ele.type === "p") {
          return (
            <div
              key={i}
              className="[&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: ele.value }}
            />
          );
        }

        if (ele.type === "image") {
          return (
            <div key={i} className="overflow-hidden rounded-lg bg-muted">
              <img src={ele.src} alt="" className="w-full rounded-xl" />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
