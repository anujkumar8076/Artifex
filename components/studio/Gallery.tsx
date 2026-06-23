"use client";

import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { downloadZip } from "@/lib/export";
import { useActiveAssets, useStudio } from "@/lib/store";
import { AssetCard, GeneratingCard } from "./AssetCard";
import { EmptyState } from "./EmptyState";

export function Gallery({ onOpenAsset }: { onOpenAsset: (id: string) => void }) {
  const assets = useActiveAssets();
  const isGenerating = useStudio((s) => s.isGenerating);
  const generatingCount = useStudio((s) => s.generatingCount);
  const projects = useStudio((s) => s.projects);
  const activeId = useStudio((s) => s.activeProjectId);
  const activeName = projects.find((p) => p.id === activeId)?.name ?? "Project";

  const [zipping, setZipping] = useState(false);

  const ghosts = useMemo(
    () => Array.from({ length: Math.max(1, generatingCount) }),
    [generatingCount],
  );

  async function exportAll() {
    if (!assets.length) return;
    setZipping(true);
    try {
      await downloadZip(assets, `${activeName.replace(/\s+/g, "_").toLowerCase()}_assets`);
    } finally {
      setZipping(false);
    }
  }

  const empty = assets.length === 0 && !isGenerating;

  return (
    <div className="flex-1 overflow-y-auto bg-ink-950 p-4 md:px-6 md:py-5">
      {empty ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-semibold">Results</span>
              <span className="text-[12.5px] text-fg-faint">
                {assets.length} asset{assets.length === 1 ? "" : "s"} · {activeName}
              </span>
            </div>
            <button
              onClick={exportAll}
              disabled={zipping || !assets.length}
              className="btn-ghost px-[11px] py-[6px] text-[12.5px] disabled:opacity-50"
            >
              <Package size={14} />
              {zipping ? "Zipping…" : "Export all"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {isGenerating && ghosts.map((_, i) => <GeneratingCard key={`g${i}`} />)}
            {assets.map((a) => (
              <AssetCard key={a.id} asset={a} onOpen={onOpenAsset} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
