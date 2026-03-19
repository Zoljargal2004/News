import { Header } from "@/components/layout/header";


export default function ProtectedLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
