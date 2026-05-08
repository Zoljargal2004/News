import "./globals.css";
import "react-quill-new/dist/quill.snow.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Newsletter.mn",
  description: "A minimal news app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
