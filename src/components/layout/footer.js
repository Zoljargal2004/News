import { GreenBgTitle } from "@/components/general/title";
import Link from "next/link";


export const Footer = () => {
  return (
    <footer className="mt-16 bg-[#292929] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-5">
          <GreenBgTitle title="Newsletter.mn" className="text-2xl" />
          <div className="space-y-3 text-sm text-white/75">
            <Link href="/about" className="block transition hover:text-white">Бидний тухай</Link>
            <Link href="/advertise">Сурталчилгаа байрлуулах</Link>
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
            <Link href="https://www.instagram.com/" className="block hover:text-white transition">Facebook</Link>
            <Link href="https://www.instagram.com/" className="block hover:text-white transition">Instagram</Link>
            <Link href="https://www.x.com/" className="block hover:text-white transition">X</Link>
            <Link href="https://www.Youtube.com/" className="block hover:text-white transition">Youtube</Link>
          </div>
        </div>

        <div className="space-y-5">
          <GreenBgTitle title="Бусад" className="text-2xl" />
          <div className="space-y-3 text-sm text-white/75">
            <p>Мэдээлэл</p>
            <p>Үйлчилгээний нөхцөл</p>
            <p>Нууцлалын бодлого</p>
            <p>Тусламж</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-white/65">
        <p>
          © 2026 Newsletter.mn. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </footer>
  );
};
