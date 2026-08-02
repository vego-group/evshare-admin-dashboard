import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/provider";
import ToastSuccessListener from "@/provider/toast-success-listener";

export const metadata: Metadata = {
  title: "Admin EV Share - Electric Mobility Platform",
  description:
    "Manage and track electric mobility assets efficiently with the EV Share admin dashboard. Collaborate with merchants to enhance user experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <QueryProvider>
          <ToastSuccessListener />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
