"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GreenBgTitle } from "@/components/general/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileMenu } from "@/components/user/profile-menu";
import { useCurrentUser } from "@/hooks/use-news";

const loadMenuItems = async () => {
  const res = await fetch("/api/user/menu");
  const payload = await res.json();

  return res.ok && payload?.success && Array.isArray(payload.data)
    ? payload.data
    : [];
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("reader");
  const [saving, setSaving] = useState(false);
  const [removingAdmin, setRemovingAdmin] = useState(false);

  useEffect(() => {
    loadMenuItems()
      .then(setMenuItems)
      .catch(() => setMenuItems([]));
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "reader");
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const res = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Мэдээлэл хадгалахад алдаа гарлаа");
      }

      toast("Мэдээлэл амжилттай хадгалагдлаа");
      router.refresh();
    } catch (error) {
      toast(error.message || "Мэдээлэл хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!confirm("Нийтлэгчийн эрхээ хасах уу?")) {
      return;
    }

    try {
      setRemovingAdmin(true);

      const res = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeAdminPrivileges: true }),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Эрх шинэчлэхэд алдаа гарлаа");
      }

      setRole(payload.data?.role || "reader");
      toast("Нийтлэгчийн эрх хасагдлаа");
      router.refresh();
    } catch (error) {
      toast(error.message || "Эрх шинэчлэхэд алдаа гарлаа");
    } finally {
      setRemovingAdmin(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-start">
      <ProfileMenu items={menuItems} />

      <section className="max-w-2xl space-y-6">
        <GreenBgTitle title="Тохиргоо" className="text-3xl font-black italic" />

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-base font-semibold">Хувийн мэдээлэл</h2>
            <p className="mt-1 text-sm text-black/55">
              Нэр болон и-мэйл хаягаа эндээс шинэчилнэ.
            </p>
          </div>

          <label className="block space-y-2 text-sm font-medium">
            <span>Нэр</span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading || saving}
              required
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>И-мэйл</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading || saving}
              required
            />
          </label>

          <Button type="submit" disabled={loading || saving}>
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </form>

        {role === "admin" ? (
          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-base font-semibold">Нийтлэгчийн эрх</h2>
              <p className="mt-1 text-sm leading-6 text-black/55">
                Энэ эрхийг хасвал мэдээ нийтлэх хэсэг болон нийтлэгчийн горим
                харагдахгүй болно.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveAdmin}
              disabled={removingAdmin}
            >
              {removingAdmin ? "Шинэчилж байна..." : "Нийтлэгчийн эрх хасах"}
            </Button>
          </section>
        ) : null}
      </section>
    </div>
  );
}
