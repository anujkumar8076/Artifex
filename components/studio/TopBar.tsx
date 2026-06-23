"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { useStudio } from "@/lib/store";

export function TopBar({ onNewAsset }: { onNewAsset: () => void }) {
  const projects = useStudio((s) => s.projects);
  const activeId = useStudio((s) => s.activeProjectId);
  const credits = useStudio((s) => s.credits);
  const configuredProvider = useStudio((s) => s.configuredProvider);
  const active = projects.find((p) => p.id === activeId);
  const live = configuredProvider && configuredProvider !== "mock";

  return (
    <header className="flex h-14 flex-none items-center justify-between border-b border-line-soft bg-ink-800 px-4">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Home">
          <LogoMark size={28} />
        </Link>
        <div className="flex items-center gap-[7px] text-[13px] text-fg-subtle">
          <span className="font-medium text-[#cfcfda]">{active?.name ?? "Project"}</span>
          <span className="text-[#3a3a47]">/</span>
          <span className="hidden sm:inline">Boss assets</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {configuredProvider && (
          <span
            className="hidden items-center gap-[6px] rounded-full border px-[10px] py-[5px] text-[11px] font-medium sm:inline-flex"
            style={
              live
                ? { borderColor: "rgba(124,92,255,.3)", background: "rgba(124,92,255,.12)", color: "#b9a6ff" }
                : { borderColor: "#262630", background: "#101016", color: "#9a9aa8" }
            }
            title={live ? `Live generation · ${configuredProvider}` : "Demo mode · procedural previews (set an API key for live generation)"}
          >
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: live ? "#7C5CFF" : "#5C5C6B", boxShadow: live ? "0 0 8px #7C5CFF" : "none" }}
            />
            {live ? "Live" : "Demo mode"}
          </span>
        )}
        <div className="flex items-center gap-2 rounded-[9px] border border-line bg-ink-850 px-3 py-[6px]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" stroke="#FF6A3D" strokeWidth="1.6" />
          </svg>
          <span className="text-[13px] font-semibold text-[#cfcfda]">{credits.toLocaleString()}</span>
          <span className="hidden text-[12px] text-fg-faint sm:inline">credits</span>
        </div>
        <button onClick={onNewAsset} className="btn-primary px-[14px] py-2 text-[13px]">
          <Plus size={13} />
          <span className="hidden sm:inline">New asset</span>
        </button>
        <div
          className="grid h-[30px] w-[30px] place-items-center rounded-full text-[12px] font-bold text-white"
          style={{ backgroundImage: "linear-gradient(150deg,#FF6A3D,#7C5CFF)" }}
        >
          M
        </div>
      </div>
    </header>
  );
}
