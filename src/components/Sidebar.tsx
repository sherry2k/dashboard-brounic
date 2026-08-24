"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageOpen,
  Wrench,
  CalendarCheck,
  X,
} from "lucide-react";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  {
    href: "/supply",
    label: "New Project",
    subLabel: "Supply and Installation",
    icon: PackageOpen,
  },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/amc", label: "AMC", icon: CalendarCheck },
];

export default function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <aside
      className={`fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-[#111111]/30 bg-[#2E2E2E] transition-transform duration-300 lg:w-64 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div>
          <p className="text-sm font-bold text-white">Brounic Group</p>
          <p className="text-xs text-[#B8B8B8]">Fire and Safety</p>
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-[#111111]/30"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-3 py-4 lg:py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B8B8B8]">
          Management
        </p>
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-[#F7941D] text-[#111111] shadow-[0_4px_16px_rgba(247,148,29,0.25)]"
                  : "text-[#F5F5F5] hover:bg-[#111111]/30 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  active ? "text-[#111111]" : "text-[#FFB347] group-hover:text-[#F7941D]"
                }`}
              />
              <span className="flex flex-col leading-tight">
                <span>{item.label}</span>
                {item.subLabel && (
                  <span
                    className={`mt-0.5 text-[11px] font-medium ${
                      active ? "text-[#111111]/75" : "text-[#D8D8D8]"
                    }`}
                  >
                    {item.subLabel}
                  </span>
                )}
              </span>
            </Link>
          );
        })}

        <div className="mt-8 px-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B8B8B8]">
            Brand Theme
          </p>
          <div className="rounded-xl border border-[#111111]/30 bg-[#111111]/25 p-3">
            <p className="text-xs font-medium text-white">Professional Mode</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#D8D8D8]">
              Dark grey menu, black header and orange CTAs keep the Brounic dashboard clean and professional.
            </p>
            <div className="mt-3 flex gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-[#F7941D]" />
              <span className="h-1.5 w-3 rounded-full bg-[#111111]" />
              <span className="h-1.5 w-3 rounded-full bg-[#FFB347]" />
            </div>
          </div>
        </div>
      </nav>

      <div className="border-t border-[#111111]/30 p-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F7941D]/15 ring-1 ring-[#F7941D]/25">
            <span className="text-[11px] font-bold text-[#FFB347]">BG</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Brounic Group</p>
            <p className="text-[10px] text-[#D8D8D8]">Fire and Safety • v2</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
