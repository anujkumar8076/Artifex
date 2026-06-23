"use client";

import { useState } from "react";
import { Download, Wand2 } from "lucide-react";
import { ASSET_TYPE_MAP, PLATFORM_MAP } from "@/lib/catalog";
import { downloadAsset } from "@/lib/export";
import { useStudio } from "@/lib/store";
import type { GeneratedAsset } from "@/lib/types";

export function AssetCard({ asset, onOpen }: { asset: GeneratedAsset; onOpen: (id: string) => void }) {
  const setPrompt = useStudio((s) => s.setPrompt);
  const setAssetType = useStudio((s) => s.setAssetType);
  const generate = useStudio((s) => s.generate);
  const [busy, setBusy] = useState(false);

  const platformLabel = asset.platforms[0]
    ? PLATFORM_MAP[asset.platforms[0]]?.label
    : "Any engine";

  async function onDownload(e: React.MouseEvent) {
    e.stopPropagation();
    setBusy(true);
    try {
      await downloadAsset(asset);
    } finally {
      setBusy(false);
    }
  }

  function onVariations(e: React.MouseEvent) {
    e.stopPropagation();
    setPrompt(asset.prompt);
    setAssetType(asset.type);
    void generate();
  }

  return (
    <button
      onClick={() => onOpen(asset.id)}
      className="group relative overflow-hidden rounded-[14px] border border-[#20202a] bg-ink-850 text-left transition hover:border-line-strong"
    >
      <div className="relative h-[168px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.imageUrl} alt={asset.title} className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,transparent 50%,rgba(11,11,15,.6))" }}
        />
        <span className="absolute right-[9px] top-[9px] rounded-full border border-brand/30 bg-brand/[0.18] px-[7px] py-[2px] text-[10.5px] font-semibold text-brand-softer">
          {ASSET_TYPE_MAP[asset.type].label}
        </span>

        {/* hover actions */}
        <div className="absolute bottom-[9px] left-[9px] right-[9px] flex gap-[6px] opacity-0 transition-opacity group-hover:opacity-100">
          <span
            onClick={onVariations}
            className="flex flex-1 items-center justify-center gap-[5px] rounded-[7px] border border-line-strong bg-[#14141a]/85 py-[5px] text-[11px] text-[#e9e9f0] backdrop-blur-sm transition hover:border-brand"
          >
            <Wand2 size={12} /> Variations
          </span>
          <span
            onClick={onDownload}
            className="flex items-center justify-center gap-[5px] rounded-[7px] border border-line-strong bg-[#14141a]/85 px-[10px] py-[5px] text-[11px] text-[#e9e9f0] backdrop-blur-sm transition hover:border-brand"
          >
            <Download size={12} /> {busy ? "…" : "Save"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-[11px]">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-[#e9e9f0]">{asset.title}</div>
          <div className="mt-px text-[11px] text-fg-faint">
            {platformLabel} · {asset.format}
          </div>
        </div>
      </div>
    </button>
  );
}

export function GeneratingCard() {
  return (
    <div
      className="overflow-hidden rounded-[14px] border bg-ink-850"
      style={{
        borderColor: "rgba(124,92,255,.4)",
        boxShadow: "0 0 0 1px rgba(124,92,255,.12),0 0 30px rgba(124,92,255,.12)",
      }}
    >
      <div className="relative grid h-[168px] place-items-center overflow-hidden bg-[repeating-linear-gradient(135deg,#16131f,#16131f_9px,#1b1726_9px,#1b1726_18px)]">
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background: "linear-gradient(110deg,transparent 30%,rgba(124,92,255,.18) 50%,transparent 70%)",
            backgroundSize: "200% 100%",
          }}
        />
        <div className="relative text-center">
          <div
            className="mx-auto mb-[10px] h-[34px] w-[34px] animate-spin rounded-full border-[2.5px] border-brand/25"
            style={{ borderTopColor: "#7C5CFF" }}
          />
          <div className="font-mono text-[11px] text-brand-soft">generating…</div>
        </div>
      </div>
      <div className="px-3 py-[11px]">
        <div className="mb-[9px] h-[10px] w-2/3 rounded bg-line" />
        <div className="h-[5px] overflow-hidden rounded-full bg-line">
          <div className="ember-track h-full w-[70%] animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
