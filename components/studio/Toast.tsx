"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({
  message,
  tone = "info",
  onClose,
}: {
  message: string;
  tone?: "info" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, tone === "error" ? 5000 : 3800);
    return () => clearTimeout(t);
  }, [onClose, tone]);

  return (
    <div className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2">
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[13px] shadow-panel",
          tone === "error"
            ? "border-red-500/40 bg-[#2a1416] text-red-200"
            : "border-line-strong bg-ink-800 text-fg",
        )}
      >
        <span className="leading-snug">{message}</span>
        <button onClick={onClose} aria-label="Dismiss" className="flex-none text-fg-faint transition hover:text-fg">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
