import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const user = await getCurrentUser(sql);

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="flex flex-col gap-8">
      <Header user={user} />
      {children}
    </div>
  );
}
