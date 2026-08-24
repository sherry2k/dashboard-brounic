"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import Link from "next/link";

function LogoMark() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[#F7941D] shadow-sm">
      {logoFailed ? (
        <Flame className="h-6 w-6 text-[#111111]" />
      ) : (
        // Upload your logo to: public/logo.png. Next.js serves it as /logo.png.
        <img
          src="/logo.png"
          alt="Brounic Group logo"
          className="h-full w-full object-contain p-1"
          onError={() => setLogoFailed(true)}
        />
      )}
    </span>
  );
}

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#2E2E2E] bg-[#111111] px-6">
      <Link href="/" className="flex items-center gap-3">
        <LogoMark />
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold tracking-tight text-white">
            Brounic Group
          </span>
          <span className="text-[#FFB347]">|</span>
          <span className="text-[14px] font-medium tracking-wide text-[#F5F5F5]">
            Fire and Safety
          </span>
        </div>
      </Link>

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
