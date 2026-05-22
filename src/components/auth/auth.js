"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export const Auth = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isLogin = mode === "login";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const endpoint = isLogin ? "/api/auth/session" : "/api/auth/user";
    const body = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      setLoading(true);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Нэвтрэлт амжилтгүй боллоо");
      }

      toast(isLogin ? "Нэвтэрлээ" : "Бүртгэл үүсгэлээ");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast(error.message || "Нэвтрэлт амжилтгүй боллоо");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Newsletter.mn</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {isLogin ? "Тавтай морил" : "Бүртгэл үүсгэх"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? "Мэдээ унших, сэтгэгдэл бичих, мэдээгээ удирдахын тулд нэвтэрнэ үү."
            : "Мэдээ уншиж, сэтгэгдэл бичиж эхлэхийн тулд бүртгүүлнэ үү."}
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin ? (
          <Field label="Нэр" icon={<User2 className="size-4" />}>
            <Input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Таны нэр"
              autoComplete="name"
              required
            />
          </Field>
        ) : null}

        <Field label="Имэйл" icon={<Mail className="size-4" />}>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </Field>

        <Field label="Нууц үг" icon={<Lock className="size-4" />}>
          <Input
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Нууц үг"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={6}
          />
        </Field>

        <Button type="submit" className="h-10 w-full" disabled={loading}>
          {loading ? "Түр хүлээнэ үү..." : isLogin ? "Нэвтрэх" : "Бүртгэл үүсгэх"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {isLogin ? "Бүртгэлгүй юу?" : "Бүртгэлтэй юу?"}{" "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          disabled={loading}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
        </button>
      </p>
    </section>
  );
};

const Field = ({ label, icon, children }) => {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          {icon}
        </span>
        <div className="[&_input]:pl-9">{children}</div>
      </div>
    </label>
  );
};
