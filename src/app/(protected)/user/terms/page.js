"use client";

import { useEffect, useState } from "react";
import { GreenBgTitle } from "@/components/general/title";
import { ProfileMenu } from "@/components/user/profile-menu";

const loadMenuItems = async () => {
  const res = await fetch("/api/user/menu");
  const payload = await res.json();

  return res.ok && payload?.success && Array.isArray(payload.data)
    ? payload.data
    : [];
};

const terms = [
  {
    title: "Бүртгэл ба аюулгүй байдал",
    body: "Хэрэглэгч өөрийн бүртгэлийн мэдээллээ үнэн зөв хадгалж, нууц үгээ бусдад дамжуулахгүй байх үүрэгтэй.",
  },
  {
    title: "Мэдээ унших, хадгалах",
    body: "Сайт дээрх мэдээ, нийтлэлүүдийг зөвхөн мэдээлэл авах зорилгоор ашиглана. Хадгалсан болон сүүлд уншсан мэдээ нь хэрэглэгчийн туршлагыг сайжруулахад ашиглагдана.",
  },
  {
    title: "Нийтлэгчийн хариуцлага",
    body: "Нийтлэгчийн эрхтэй хэрэглэгч нийтэлж буй мэдээний эх сурвалж, агуулга, үнэн зөв байдлыг хариуцна.",
  },
  {
    title: "Хориглох зүйлс",
    body: "Хуурамч мэдээлэл, бусдыг доромжилсон агуулга, зөвшөөрөлгүй сурталчилгаа болон системийн хэвийн ажиллагаанд саад болох үйлдлийг хориглоно.",
  },
  {
    title: "Өөрчлөлт",
    body: "Үйлчилгээний нөхцөл шинэчлэгдэж болох бөгөөд хэрэглэгч сайт ашигласнаар тухайн үеийн нөхцөлийг зөвшөөрсөнд тооцогдоно.",
  },
];

export default function TermsPage() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    loadMenuItems()
      .then(setMenuItems)
      .catch(() => setMenuItems([]));
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-start">
      <ProfileMenu items={menuItems} />

      <section className="max-w-3xl space-y-6">
        <GreenBgTitle
          title="Үйлчилгээний нөхцөл"
          className="text-3xl font-black italic"
        />

        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          {terms.map((item) => (
            <article key={item.title} className="space-y-2">
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="text-sm leading-6 text-black/65">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
