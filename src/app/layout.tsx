import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Brounic Group | Fire and Safety",
  description:
    "Project management dashboard for Brounic Group Fire and Safety: new projects, supply and installation, maintenance and AMC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F5F5] text-[#111111] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
