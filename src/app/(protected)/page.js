import { TodaysNews } from "@/components/home/news-of-the-day";
import { RecentNews } from "@/components/home/recent-news";
import { TredingNews } from "@/components/home/trending-news";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col mx-[200]">
      <TodaysNews/>
      <TredingNews/>
      <RecentNews/>
    </div>
  );
}
