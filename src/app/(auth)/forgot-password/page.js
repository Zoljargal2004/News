import { ForgotPassword } from "@/components/auth/forgot-password/inputs";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8f6f1_0%,#fbfbfb_32%,#ffffff_100%)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(138,255,83,0.15),transparent_25%)]" />
          <div className="relative w-full max-w-xl rounded-[40px]  p-8  backdrop-blur md:p-12">
            <ForgotPassword />
          </div>
        </section>
      </div>
    </main>
  );
}
