import { GreenBgTitle } from "@/components/general/title";

export const Footer = () => {
  return (
    <footer className="mt-16 bg-[#292929] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-5">
          <GreenBgTitle title="Newsletter.mn" className="text-2xl" />
          <div className="space-y-3 text-sm text-white/75">
            <p>Бидний тухай</p>
            <p>Сурталчилгаа байрлуулах</p>
          </div>
          <div className="space-y-3">
            <GreenBgTitle title="Холбоо барих" className="text-xl" />
            <div className="space-y-2 text-sm text-white/75">
              <p>+976 9999 0000</p>
              <p>newsletter@newsletter.mn</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <GreenBgTitle title="Бусад медиа" className="text-2xl" />
          <div className="space-y-3 text-sm text-white/75">
            <p>facebook.com/newslettermn</p>
            <p>instagram.com/newslettermn</p>
            <p>x.com/newslettermn</p>
            <p>youtube.com/newslettermn</p>
          </div>
        </div>

        <div className="space-y-5">
          <GreenBgTitle title="Something" className="text-2xl" />
          <div className="space-y-3 text-sm text-white/75">
            <p>Something</p>
            <p>Other thing</p>
            <p>the other thing</p>
            <p>Anything haha</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-white/65">
        <p>
          © 2026 Newsletter.mn. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
