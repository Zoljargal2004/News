import { APIHandler } from "@/lib/api-handler";
import { useState } from "react";
import { toast } from "sonner";

export const useNews = () => {
  const [loading, setLoading] = useState(false);
  const uploadNews = async (news) => {
    setLoading(true);
    const res = await APIHandler("/api/news/create", "POST", news);
    if (res) {
      toast("Амжилттай мэдээ нийтэллээ");
    }
    setLoading(false);
  };

  return { uploadNews, loading };
};
