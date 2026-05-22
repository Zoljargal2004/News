"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GreenBgTitle } from "@/components/general/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  placement: "homepage",
  budget: "",
  message: "",
};

export default function AdvertisePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const res = await fetch("/api/advertising", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Хүсэлт илгээхэд алдаа гарлаа");
      }

      toast("Сурталчилгааны хүсэлт илгээгдлээ");
      setForm(initialForm);
    } catch (error) {
      toast(error.message || "Хүсэлт илгээхэд алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <GreenBgTitle title="Сурталчилгаа байрлуулах" className="text-4xl" />
        <p className="text-sm leading-6 text-muted-foreground">
          Сурталчилгааны хүсэлтээ бидэнд илгээнэ үү. Манай баг таны мэдээллийг
          шалгаад байршуулах сонголтуудын талаар холбогдох болно.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder="Байгууллагын нэр"
            required
          />
          <Input
            value={form.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            placeholder="Холбоо барих хүний нэр"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Имэйл"
            required
          />
          <Input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Утас"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            value={form.placement}
            onChange={(event) => updateField("placement", event.target.value)}
            placeholder="Байршил"
          />
          <Input
            value={form.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            placeholder="Төсөв"
          />
        </div>

        <Textarea
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Ямар төрлийн сурталчилгаа байршуулах хүсэлтэйгээ бичнэ үү"
          required
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Илгээж байна..." : "Хүсэлт илгээх"}
        </Button>
      </form>
    </section>
  );
}
