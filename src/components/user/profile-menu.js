"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ProfileMenu = ({ items = [] }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const res = await fetch("/api/auth/session", { method: "DELETE" });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Гарахад алдаа гарлаа");
      }

      toast("Системээс гарлаа");
      router.push("/auth");
      router.refresh();
    } catch (error) {
      toast(error.message || "Гарахад алдаа гарлаа");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="rounded-2xl bg-[#d9d9d9] px-5 py-3 text-center text-xs text-black/75 lg:sticky lg:top-28">
      {items.map((item, index) => {
        const isLogout = item?.action === "logout";
        const active = item?.href && pathname === item.href;
        const className = `block w-full py-4 transition hover:text-black ${
          active ? "font-semibold text-black" : ""
        } ${index !== items.length - 1 ? "border-b border-black/30" : ""}`;

        if (isLogout) {
          return (
            <button
              key={item.label}
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={`${className} disabled:opacity-50`}
            >
              {loggingOut ? "Гарч байна..." : item.label}
            </button>
          );
        }

        return (
          <Link key={item.label} href={item.href || "/user"} className={className}>
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
};
