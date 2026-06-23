import { cn } from "@/lib/utils";

export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("grid place-items-center rounded-[9px] brand-mark", className)}
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 18px rgba(124,92,255,.5), inset 0 1px 0 rgba(255,255,255,.25)",
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,.12)" />
        <path
          d="M12 7c1.7 1.6 3 3.1 3 5a3 3 0 0 1-6 0c0-1.1.5-2 1.2-2.7-.1 1 .4 1.7 1 1.7.7 0 1-.7.8-1.7.6.5 0-2 0-2.3Z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

export function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-[11px]", className)}>
      <LogoMark size={size} />
      <span className="text-[18px] font-bold tracking-[-0.02em] text-fg">Artifex</span>
    </div>
  );
}
