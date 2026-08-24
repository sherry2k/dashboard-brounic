"use client";

import { Flame, Menu } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#2E2E2E] bg-[#111111] px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] text-white transition-colors hover:border-[#F7941D]/50 hover:text-[#F7941D] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F7941D] shadow-sm">
            <Flame className="h-6 w-6 text-[#111111]" />
          </span>
          <div className="flex flex-col leading-tight sm:flex-row sm:items-center sm:gap-2">
            <span className="text-[16px] font-bold tracking-tight text-white sm:text-[17px]">
              Brounic Group
            </span>
            <span className="hidden text-[#FFB347] sm:inline">|</span>
            <span className="text-[12px] font-medium tracking-wide text-[#F5F5F5] sm:text-[14px]">
              Fire and Safety
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
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
