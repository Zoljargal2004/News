"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, Search, X } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { GreenBgTitle } from "@/components/general/title";

const NAV_ITEMS = [
  { href: "/categories/world", label: "Олон улсын" },
  { href: "/categories/politics", label: "Улстөр" },
  { href: "/categories/business", label: "Бизнес" },
  { href: "/categories/society", label: "Нийгэм" },
  { href: "/categories/culture", label: "Бусад" },
];

export const Header = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debouncedSearch = useDebouncedValue(searchText, 450);

  useEffect(() => {
    setSearchText(pathname === "/search" ? searchParams.get("q") || "" : "");
  }, [pathname, searchParams]);

  useEffect(() => {
    const query = debouncedSearch.trim();
    const currentQuery = (searchParams.get("q") || "").trim();

    if (query === currentQuery) {
      return;
    }

    if (!query) {
      if (pathname === "/search" && currentQuery) {
        router.replace("/search");
      }

      return;
    }

    router.replace(`/search?q=${encodeURIComponent(query)}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const res = await fetch("/api/auth/session", { method: "DELETE" });
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
    const query = searchText.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Newsletter.mn home">
          <GreenBgTitle title="Newsletter.mn" className="text-2xl" />
        </Link>

        <nav className="hidden items-center gap-12 text-sm text-black/70 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ))}
          {user?.role === "admin" ? (
            <Link href="/news/create" className="hover:text-black">
              Нийтлэх
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SearchForm
            searchText={searchText}
            setSearchText={setSearchText}
            onSubmit={handleSearchSubmit}
          />
          <img
            src={`https://i.pravatar.cc/80?u=${encodeURIComponent(user?.email || "reader")}`}
            alt=""
            className="size-10 rounded-full object-cover"
          />
          <button
            type="button"
            aria-label="Log out"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex size-8 items-center justify-center rounded-full bg-white text-black/65 shadow-sm transition hover:text-black disabled:opacity-50"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm lg:hidden"
        >
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="mx-auto w-full max-w-6xl space-y-4 px-4 pb-6 sm:px-6 lg:hidden">
          <SearchForm
            searchText={searchText}
            setSearchText={setSearchText}
            onSubmit={handleSearchSubmit}
          />
          <nav className="grid gap-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {user?.role === "admin" ? <Link href="/news/create">Нийтлэх</Link> : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
};

const SearchForm = ({ searchText, setSearchText, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex h-9 w-full items-center gap-2 rounded-full bg-[#d8d8d8] px-4 md:w-52"
    >
      <input
        type="search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Хайх..."
        className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-black/55"
      />
      <Search className="size-4 text-black" />
    </form>
  );
};
