"use client";

import { Box, LayoutDashboard, Layers, Lock, Plus, Shapes, User } from "lucide-react";
import { useStudio } from "@/lib/store";
import type { AssetTypeId } from "@/lib/types";
import { cn } from "@/lib/utils";

const LIBRARY: { label: string; icon: typeof Box; match: (t: AssetTypeId) => boolean }[] = [
  { label: "All assets", icon: Layers, match: () => true },
  { label: "3D models", icon: Box, match: (t) => t === "model3d" },
  { label: "Icons", icon: Shapes, match: (t) => t === "icon" },
  { label: "GUI / HUD", icon: LayoutDashboard, match: (t) => t === "gui" || t === "hud" },
  { label: "Characters", icon: User, match: (t) => t === "character" },
];

export function LeftRail({ onOpenDna }: { onOpenDna: () => void }) {
  const projects = useStudio((s) => s.projects);
  const activeId = useStudio((s) => s.activeProjectId);
  const assetsByProject = useStudio((s) => s.assetsByProject);
  const setActiveProject = useStudio((s) => s.setActiveProject);
  const newProject = useStudio((s) => s.newProject);

  const activeAssets = assetsByProject[activeId] ?? [];

  return (
    <aside className="hidden w-[236px] flex-none flex-col gap-[22px] overflow-y-auto border-r border-line-soft bg-[#0c0c11] p-3 md:flex">
      <button
        onClick={() => newProject()}
        className="flex w-full items-center gap-[9px] rounded-[10px] border border-dashed border-[#3a3552] bg-brand/[0.1] px-3 py-[10px] text-[13.5px] font-semibold text-white transition hover:bg-brand/[0.18]"
      >
        <Plus size={14} className="text-brand-soft" />
        New project
      </button>

      <div>
        <div className="mono-label px-2 pb-2 text-[10px]">Projects</div>
        {projects.map((p) => {
          const count = (assetsByProject[p.id] ?? []).length;
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => setActiveProject(p.id)}
              className={cn(
                "flex w-full items-center gap-[10px] rounded-[9px] px-[9px] py-2 text-left transition hover:bg-ink-700",
                isActive && "bg-ink-700",
              )}
              style={isActive ? { boxShadow: "inset 2px 0 0 #7C5CFF" } : undefined}
            >
              <span
                className="h-2 w-2 flex-none rounded-[3px]"
                style={{ background: isActive ? p.color : "#3a3a47" }}
              />
              <span
                className={cn(
                  "flex-1 truncate text-[13.5px]",
                  isActive ? "font-semibold text-fg" : "font-medium text-fg-dim",
                )}
              >
                {p.name}
              </span>
              <span className="text-[11px] text-fg-ghost">{count}</span>
            </button>
          );
        })}
      </div>

      <div>
        <div className="mono-label px-2 pb-2 text-[10px]">Asset library</div>
        {LIBRARY.map((l) => {
          const count = activeAssets.filter((a) => l.match(a.type)).length;
          return (
            <div
              key={l.label}
              className="flex cursor-pointer items-center gap-[10px] rounded-[9px] px-[9px] py-2 text-fg-dim transition hover:bg-ink-700 hover:text-[#cfcfda]"
            >
              <l.icon size={15} className="text-fg-faint" />
              <span className="flex-1 text-[13.5px]">{l.label}</span>
              <span className="text-[11px] text-fg-ghost">{count}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={onOpenDna}
        className="mt-auto flex items-center gap-[10px] rounded-[11px] border border-line-soft bg-ink-800 p-3 text-left transition hover:border-line-strong"
      >
        <span className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-brand/30 bg-brand/[0.12] text-brand-soft">
          <Lock size={15} />
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold text-fg">Brand DNA</span>
          <span className="block text-[11px] text-fg-faint">Manage Style Lock</span>
        </span>
      </button>
    </aside>
  );
}
