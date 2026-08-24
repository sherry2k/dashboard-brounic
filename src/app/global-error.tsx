"use client";

import { Flame, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F5F5] text-[#111111] antialiased">
        <div className="grid min-h-screen place-items-center px-6">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-8 text-center shadow-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F7941D]">
              <Flame className="h-8 w-8 text-[#111111]" />
            </span>
            <h1 className="mt-5 text-xl font-bold text-[#111111]">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              The dashboard could not be loaded. This is usually a temporary
              database or network issue — please try again.
            </p>
            {error?.digest && (
              <p className="mt-3 rounded-lg bg-[#F5F5F5] px-3 py-1.5 text-xs text-[#6B6B6B]">
                Reference: {error.digest}
              </p>
            )}
            <button
              onClick={() => reset()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F7941D] px-5 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#FFB347]"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
            <p className="mt-6 text-xs text-[#A3A3A3]">
              Brounic Group | Fire and Safety
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
