"use client";

import { cn } from "@/lib/utils";

export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-[7px] whitespace-nowrap rounded-[9px] border px-[13px] py-2 text-[13px] font-medium transition",
        active
          ? "border-brand bg-brand/[0.16] text-fg"
          : "border-line bg-[#0e0e13] text-fg-dim hover:border-line-strong hover:text-[#cfcfda]",
        className,
      )}
      style={active ? { boxShadow: "0 0 0 1px rgba(124,92,255,.2)" } : undefined}
    >
      {children}
    </button>
  );
}
