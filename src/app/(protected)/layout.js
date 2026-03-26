import { Header } from "@/components/layout/header";


export default function ProtectedLayout({ children }) {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      {children}
    </div>
  );
}
