import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CommentsSection } from "@/components/news/read/comments-section";
import { ViewedNewsRecorder } from "@/components/news/read/viewed-news-recorder";
import { politicalParties } from "@/data/political-parties";

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
    throw new Error(payload?.error || "Мэдээ татахад алдаа гарлаа");
  }

  return payload.data;
};

export default async function Page({ params }) {
  const { id } = await params;
  const news = await getNewsById(id);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <ViewedNewsRecorder news={news} />

      <div className="overflow-hidden rounded-lg bg-muted">
        <img
          src={news?.thumbnail || "/newpapers.png"}
          alt={news?.title || "зураг"}
          className="aspect-video w-full object-cover"
        />
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          {news?.title}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {news?.author_name ? <span>Нийтэлсэн: {news.author_name}</span> : null}
          {news?.political_party ? (
            <span>Холбогдох нам: {news.political_party}</span>
          ) : null}
        </div>
        <ArticlePartyIndicator scores={news?.party_scores} />
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

const ArticlePartyIndicator = ({ scores }) => {
  const safeScores = scores || {};
  const totalScore = politicalParties.reduce(
    (total, party) => total + Number(safeScores[party.id] || 0),
    0,
  );

  if (!totalScore) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Улс төрийн индикатор</h2>
        <span className="text-xs text-muted-foreground">Нийт оноо: {totalScore}</span>
      </div>

      <div className="flex overflow-hidden rounded-full bg-black/10">
        {politicalParties.map((party) => {
          const score = Number(safeScores[party.id] || 0);
          const width = (score / totalScore) * 100;

          return (
            <span
              key={party.id}
              title={`${party.label}: ${score}%`}
              className="h-2.5"
              style={{
                width: `${width}%`,
                backgroundColor: party.color,
              }}
            />
          );
        })}
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        {politicalParties.map((party) => {
          const score = Number(safeScores[party.id] || 0);

          return (
            <div key={party.id} className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: party.color }}
              />
              <span className="font-medium text-foreground">{party.shortLabel}</span>
              <span>{score}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
