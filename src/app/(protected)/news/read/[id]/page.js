import { headers } from "next/headers";
import { notFound } from "next/navigation";

const getBaseUrl = async () => {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") || headerStore.get("host") || "";
  const protocol =
    headerStore.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

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
    <div className="flex w-full flex-col items-center gap-8">
      <div className="h-[470] w-full overflow-hidden rounded-3xl">
        <img
          src={news?.thumbnail}
          alt={news?.title || "thumbnail"}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-center text-6xl font-bold">{news?.title}</span>
      <NewsBody body={news?.news || []} />
    </div>
  );
}

const NewsBody = ({ body }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {body.map((ele, i) => {
        if (ele.type === "p") {
          return <span key={i} dangerouslySetInnerHTML={{ __html: ele.value }} />;
        }

        if (ele.type === "image") {
          return (
            <div key={i}>
              <img src={ele.src} alt="" className="w-full rounded-xl" />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
