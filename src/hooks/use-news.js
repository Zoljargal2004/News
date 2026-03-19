import { APIHandler } from "@/lib/api-handler";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useNews = () => {
  const [loading, setLoading] = useState(false);
  const uploadNews = async (news) => {
    setLoading(true);
    const res = await APIHandler("/api/news/create", "POST", news);
    if (res.seccess) {
      toast("Амжилттай мэдээ нийтэллээ");
    }
    setLoading(false);
  };

  return { uploadNews, loading };
};

export const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const getCategories = async () => {
      setLoading(false);
      const res = APIHandler("/api/news/categories", "GET");
      if (res.success) {
        setCategories(res.data);
      }
      setLoading(true);
    };
    getCategories();
  }, []);

  return { categories, loading };
};
