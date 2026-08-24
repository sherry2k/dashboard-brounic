"use client";

import { useState, type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setMenuOpen(true)} />
      {menuOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 top-16 z-20 bg-[#111111]/55 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="mt-16 min-h-[calc(100vh-4rem)] bg-[#F5F5F5] px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-8">
        {children}
      </main>
    </>
  );
}
