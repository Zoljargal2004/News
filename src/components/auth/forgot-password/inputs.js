import Link from "next/link";

export const ForgotPassword = () => {
  return (
    <section className="w-full max-w-md space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Нууц үг сэргээх</h1>
      <p className="text-sm text-muted-foreground">
        Нууц үг сэргээх тохиргоо одоогоор идэвхжээгүй байна. Админаас бүртгэлээ
        шинэчлэхийг хүсэх эсвэл демо хэрэглэгчээр нэвтэрнэ үү.
      </p>
      <Link
        href="/auth"
        className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium transition hover:bg-muted"
      >
        Нэвтрэх хуудас руу буцах
      </Link>
    </section>
  );
};
