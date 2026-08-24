"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F7941D]/15 text-[#F7941D]">
          <TriangleAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-bold text-[#111111]">
          Unable to load dashboard data
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          The overview could not reach the database. Retrying usually resolves it.
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
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
      </div>
    </div>
  );
}
