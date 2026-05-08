import Link from "next/link";

export const ForgotPassword = () => {
  return (
    <section className="w-full max-w-md space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
      <p className="text-sm text-muted-foreground">
        Password reset is not configured yet. Ask an admin to update your
        account or sign in with a demo user.
      </p>
      <Link
        href="/auth"
        className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium transition hover:bg-muted"
      >
        Back to sign in
      </Link>
    </section>
  );
};
