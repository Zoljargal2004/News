import { TredingNews } from "@/components/home/trending-news";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <TredingNews/>
    </div>
  );
}
