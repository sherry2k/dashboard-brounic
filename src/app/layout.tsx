import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Brounic Group | Fire and Safety",
  description:
    "Project management dashboard for Brounic Group Fire and Safety: supply & installation, maintenance and AMC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F5F5] text-[#111111] antialiased">
        <Header />
        <Sidebar />
        <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-[#F5F5F5] px-6 py-8 lg:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
