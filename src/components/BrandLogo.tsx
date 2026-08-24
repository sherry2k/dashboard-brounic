"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {!logoFailed ? (
        <img
          src="/logo.png"
          alt="Brounic Group logo"
          onError={() => setLogoFailed(true)}
          className={`${compact ? "h-9 w-9" : "h-10 w-10"} rounded-xl object-contain bg-white p-1`}
        />
      ) : (
        <span
          className={`${compact ? "h-9 w-9" : "h-10 w-10"} grid place-items-center rounded-xl bg-[#F7941D] shadow-sm`}
        >
          <Flame className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-[#111111]`} />
        </span>
      )}
      {!compact && (
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[17px] font-bold tracking-tight text-white">
            Brounic Group
          </span>
          <span className="text-[#FFB347]">|</span>
          <span className="hidden text-[14px] font-medium tracking-wide text-[#F5F5F5] sm:inline">
            Fire and Safety
          </span>
        </div>
      )}
    </div>
  );
}
