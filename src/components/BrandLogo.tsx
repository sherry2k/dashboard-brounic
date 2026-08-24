"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (!logoFailed) {
    return (
      <span
        className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white ${
          compact ? "h-8 w-8" : "h-10 w-10"
        }`}
      >
        <img
          src="/logo.png"
          alt="Brounic Group logo"
          className="h-full w-full object-contain p-1"
          onError={() => setLogoFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-[#F7941D] shadow-sm ${
        compact ? "h-8 w-8" : "h-10 w-10"
      }`}
      aria-label="Brounic Group fallback logo"
    >
      <Flame className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-[#111111]`} />
    </span>
  );
}
