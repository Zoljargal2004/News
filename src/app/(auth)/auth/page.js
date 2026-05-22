import { Auth } from "@/components/auth/auth";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r lg:block">
          <img
            src="/newpapers.png"
            alt="Сонины багц"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <Auth />
        </section>
      </div>
    </main>
  );
}
