"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Apple, Check, Facebook, Lock, Mail, User2 } from "lucide-react";
import { GreenBgTitle } from "@/components/general/title";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SOCIALS = [
  {
    label: "Google",
    content: <span className="text-2xl font-black text-[#EA4335]">G</span>,
  },
  {
    label: "Facebook",
    content: <Facebook className="size-7 fill-[#1877F2] text-[#1877F2]" />,
  },
  {
    label: "X",
    content: <span className="text-2xl font-semibold">X</span>,
  },
  {
    label: "Apple",
    content: <Apple className="size-7 fill-black text-black" />,
  },
];

export const Auth = () => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isLogin = mode === "login";

  const submitAuth = async ({ endpoint, body, successMessage }) => {
    try {
      setLoading(true);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Authentication failed");
      }

      toast(successMessage);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex w-full max-w-[460px] flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <GreenBgTitle
          title="newsletter.mn"
          className="text-5xl font-black italic leading-none tracking-tight text-[#222]"
        />
        <div className="space-y-2">
          <h1 className="text-5xl font-semibold tracking-tight text-[#2C2C2C]">
            {isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
          </h1>
          <p className="text-lg text-[#606060]">
            {isLogin
              ? "Цахим шуудан, нууц үгээ ашиглан үргэлжлүүлнэ үү"
              : "Шинэ хэрэглэгчийн бүртгэлээ үүсгээд шууд эхлээрэй"}
          </p>
        </div>
      </div>

      <div className="w-full space-y-5">
        {isLogin ? (
          <LoginForm
            loading={loading}
            onSubmit={(values) =>
              submitAuth({
                endpoint: "/api/auth/session",
                body: values,
                successMessage: "Successfully signed in",
              })
            }
          />
        ) : (
          <RegisterForm
            loading={loading}
            onSubmit={(values) =>
              submitAuth({
                endpoint: "/api/auth/user",
                body: values,
                successMessage: "Account created successfully",
              })
            }
          />
        )}

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#DBDBDB]" />
            <span className="text-sm text-[#7A7A7A]">эсвэл</span>
            <div className="h-px flex-1 bg-[#DBDBDB]" />
          </div>

          <div className="flex items-center justify-center gap-4">
            {SOCIALS.map((item) => (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                className="flex size-14 items-center justify-center rounded-full border border-[#E7E7E7] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5"
              >
                {item.content}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          disabled={loading}
          className="text-lg font-semibold text-[#1D1D1D]"
        >
          <GreenBgTitle
            title={isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
            className="text-2xl font-black italic"
          />
        </button>
        <p className="text-lg text-[#606060]">
          {isLogin
            ? "Шинэ хэрэглэгч бол эндээс эхлээрэй"
            : "Бүртгэлтэй бол нэвтэрч орно уу"}
        </p>
      </div>
    </section>
  );
};

const LoginForm = ({ loading, onSubmit }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Field
        label="Цахим шуудан/ Утасны дугаар"
        icon={<Mail className="size-5 text-[#6E6E6E]" />}
      >
        <Input
          type="email"
          placeholder="newuser@email.com"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="h-[60px] rounded-full border-0 bg-[#D9D9D9] px-6 text-base shadow-none placeholder:text-[#7F7F7F] focus-visible:ring-2 focus-visible:ring-[#8AFF53]/40"
        />
      </Field>

      <Field
        label="Нууц үг"
        icon={<Lock className="size-5 text-[#6E6E6E]" />}
      >
        <Input
          type="password"
          placeholder="****************"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          className="h-[60px] rounded-full border-0 bg-[#D9D9D9] px-6 text-base shadow-none placeholder:text-[#7F7F7F] focus-visible:ring-2 focus-visible:ring-[#8AFF53]/40"
        />
      </Field>

      <div className="flex items-center justify-between gap-4 text-sm text-[#5D5D5D]">
        <label className="flex items-center gap-2">
          <Checkbox defaultChecked className="border-[#8AFF53] data-checked:bg-[#8AFF53] data-checked:text-black" />
          <span>Намайг сана</span>
        </label>
        <button type="button" className="hover:underline">
          Нууц үг мартсан?
        </button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-full bg-[#1E1E1E] text-base font-semibold text-white hover:bg-[#2A2A2A]"
      >
        {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
      </Button>
    </form>
  );
};

const RegisterForm = ({ loading, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      toast("Please accept the terms to continue");
      return;
    }

    await onSubmit(form);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Field
        label="Нэр"
        icon={<User2 className="size-5 text-[#6E6E6E]" />}
      >
        <Input
          placeholder="Таны нэр"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="h-[60px] rounded-full border-0 bg-[#D9D9D9] px-6 text-base shadow-none placeholder:text-[#7F7F7F] focus-visible:ring-2 focus-visible:ring-[#8AFF53]/40"
        />
      </Field>

      <Field
        label="Цахим шуудан"
        icon={<Mail className="size-5 text-[#6E6E6E]" />}
      >
        <Input
          type="email"
          placeholder="name@email.com"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="h-[60px] rounded-full border-0 bg-[#D9D9D9] px-6 text-base shadow-none placeholder:text-[#7F7F7F] focus-visible:ring-2 focus-visible:ring-[#8AFF53]/40"
        />
      </Field>

      <Field
        label="Нууц үг"
        icon={<Lock className="size-5 text-[#6E6E6E]" />}
      >
        <Input
          type="password"
          placeholder="Шинэ нууц үг"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          className="h-[60px] rounded-full border-0 bg-[#D9D9D9] px-6 text-base shadow-none placeholder:text-[#7F7F7F] focus-visible:ring-2 focus-visible:ring-[#8AFF53]/40"
        />
      </Field>

      <label className="flex items-start gap-3 rounded-3xl bg-[#F3F3F3] px-5 py-4 text-sm text-[#5D5D5D]">
        <Checkbox
          checked={acceptedTerms}
          onCheckedChange={(value) => setAcceptedTerms(Boolean(value))}
          className="mt-0.5 border-[#8AFF53] data-checked:bg-[#8AFF53] data-checked:text-black"
        />
        <span>Үйлчилгээний нөхцөл болон нууцлалын бодлогыг зөвшөөрч байна.</span>
      </label>

      <Button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-full bg-[#1E1E1E] text-base font-semibold text-white hover:bg-[#2A2A2A]"
      >
        <Check className="size-5" />
        {loading ? "Бүртгэж байна..." : "Бүртгэл үүсгэх"}
      </Button>
    </form>
  );
};

const Field = ({ label, icon, children }) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-lg font-medium text-[#3F3F3F]">{label}</span>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
          {icon}
        </div>
        <div className="[&_input]:pl-14">{children}</div>
      </div>
    </label>
  );
};
