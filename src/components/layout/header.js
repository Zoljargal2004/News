"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Search } from "lucide-react";
import { GreenBgTitle } from "../general/title";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/use-news";
import { slugifyCategory } from "@/lib/categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export const Header = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const debouncedSearch = useDebouncedValue(searchText, 450);

  useEffect(() => {
    if (pathname === "/search") {
      setSearchText(searchParams.get("q") || "");
      return;
    }

    setSearchText("");
  }, [pathname, searchParams]);

  useEffect(() => {
    const trimmedSearch = debouncedSearch.trim();
    const currentSearch = (searchParams.get("q") || "").trim();

    if (trimmedSearch === currentSearch) {
      return;
    }

    if (!trimmedSearch) {
      if (pathname === "/search" && currentSearch) {
        router.replace("/search");
      }

      return;
    }

    router.replace(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const res = await fetch("/api/auth/session", {
        method: "DELETE",
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to sign out");
      }

      toast("Signed out");
      router.push("/auth");
      router.refresh();
    } catch (error) {
      toast(error.message || "Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmedSearch = searchText.trim();

    if (!trimmedSearch) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

  const navItems = categories
    .map((item) => ({
      href: `/categories/${item.slug || slugifyCategory(item.name)}`,
      label: item.name,
    }))
    .filter((item) => item.label);

  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-5 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-black/45">
                Independent Daily Brief
              </p>
              <Link href="/" className="inline-block">
                <GreenBgTitle
                  title="Newsletter.mn"
                  className="text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl"
                />
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85 xl:hidden"
            >
              {open ? "Close" : "Sections"}
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:min-w-[320px] xl:justify-end">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-1 items-center gap-3 rounded-full border border-black/10 bg-(--secondary-background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            >
              <Search size={18} className="text-black/55" />
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Хайх"
                className="w-full bg-transparent text-sm placeholder:text-black/45 focus:outline-none"
              />
            </form>
            <button
              type="button"
              aria-label="Log out"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-foreground transition hover:bg-black hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {user?.role === "admin" ? (
            <Link
              href="/news/create"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/75 transition hover:-translate-y-px hover:border-black/20 hover:bg-(--accent) hover:text-black"
            >
              Write news
            </Link>
          ) : null}

          {navItems
            .filter((item, index) => open || index < 4)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/75 transition hover:-translate-y-px hover:border-black/20 hover:bg-(--accent) hover:text-black"
              >
                {item.label}
              </Link>
            ))}

          {navItems.length > 4 ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              {open ? "Хураах" : "Дэлгэрэнгүй"}
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
