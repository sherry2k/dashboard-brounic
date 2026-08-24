"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#2E2E2E] bg-[#111111] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#2E2E2E] text-white hover:bg-[#2E2E2E] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="min-w-0">
          <BrandLogo />
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-[#2E2E2E] bg-[#1A1A1A] px-3 py-1.5 md:flex">
          <span className="h-2 w-2 rounded-full bg-[#F7941D] shadow-[0_0_8px_#F7941D]" />
          <span className="text-xs font-medium text-[#F5F5F5]">Live Dashboard</span>
        </div>
        <div className="hidden h-8 w-px bg-[#2E2E2E] md:block" />
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#2E2E2E] text-xs font-bold text-white">
            B
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-none text-white">Admin</p>
            <p className="text-[10px] leading-none text-[#A3A3A3]">Brounic</p>
          </div>
        </div>
      </div>
    </header>
  );
}
