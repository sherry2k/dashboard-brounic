"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageOpen,
  Wrench,
  CalendarCheck,
} from "lucide-react";
import BrandLogo from "./BrandLogo";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/supply", label: "Supply & Installation", icon: PackageOpen },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/amc", label: "AMC", icon: CalendarCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-[#2E2E2E] bg-[#111111]">
      <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
          Management
        </p>
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-[#F7941D] text-[#111111] shadow-[0_4px_16px_rgba(247,148,29,0.25)]"
                  : "text-[#A3A3A3] hover:bg-[#2E2E2E] hover:text-white"
              }`}
            >
              <item.icon
                className={`h-[18px] w-[18px] transition-colors ${
                  active ? "text-[#111111]" : "text-[#6B6B6B] group-hover:text-[#FFB347]"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-8 px-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
            Quick Stats
          </p>
          <div className="rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] p-3">
            <p className="text-xs font-medium text-[#F5F5F5]">Professional Mode</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#6B6B6B]">
              Orange highlights mark CTAs and critical actions. Black & dark grey keep it professional.
            </p>
            <div className="mt-3 flex gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-[#F7941D]" />
              <span className="h-1.5 w-3 rounded-full bg-[#2E2E2E]" />
              <span className="h-1.5 w-3 rounded-full bg-[#2E2E2E]" />
            </div>
          </div>
        </div>
      </nav>

      <div className="border-t border-[#2E2E2E] p-4">
        <div className="flex items-center gap-2.5">
          <BrandLogo compact />
          <div>
            <p className="text-xs font-semibold text-white">Brounic Group</p>
            <p className="text-[10px] text-[#6B6B6B]">Fire and Safety • v2</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
