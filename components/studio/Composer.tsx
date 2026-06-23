"use client";

import { useRef, useState } from "react";
import { Minus, Plus, Sparkles, Upload } from "lucide-react";
import { AssetIcon } from "@/components/ui/AssetIcon";
import { Chip } from "@/components/ui/Chip";
import { ASSET_TYPES, PLATFORMS } from "@/lib/catalog";
import { useStudio } from "@/lib/store";

export function Composer() {
  const prompt = useStudio((s) => s.prompt);
  const setPrompt = useStudio((s) => s.setPrompt);
  const assetType = useStudio((s) => s.assetType);
  const setAssetType = useStudio((s) => s.setAssetType);
  const selectedPlatforms = useStudio((s) => s.selectedPlatforms);
  const togglePlatform = useStudio((s) => s.togglePlatform);
  const styleLock = useStudio((s) => s.styleLock);
  const toggleStyleLock = useStudio((s) => s.toggleStyleLock);
  const batch = useStudio((s) => s.batch);
  const setBatch = useStudio((s) => s.setBatch);
  const isGenerating = useStudio((s) => s.isGenerating);
  const generate = useStudio((s) => s.generate);

  const [refName, setRefName] = useState<string | null>(styleLock.referenceName ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-none border-b border-line-soft bg-gradient-to-b from-[#0f0f15] to-ink-950 p-4 md:px-6 md:py-[22px]">
      <div className="panel border-line-strong bg-ink-850 p-4">
        <textarea
          id="composer-input"
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the asset set you want — a character, its HUD, icons and a thumbnail…"
          className="w-full resize-none border-none bg-transparent text-[15px] leading-[1.5] text-[#eaeaf1] outline-none md:text-base"
        />

        {/* asset type chips */}
        <div className="mt-[14px] flex flex-wrap items-center gap-[9px]">
          <span className="mr-[2px] text-[11.5px] text-fg-faint">Asset</span>
          {ASSET_TYPES.map((t) => (
            <Chip key={t.id} active={assetType === t.id} onClick={() => setAssetType(t.id)}>
              <AssetIcon name={t.icon} size={14} />
              {t.label}
            </Chip>
          ))}
        </div>

        {/* platform chips */}
        <div className="mt-[11px] flex flex-wrap items-center gap-[9px]">
          <span className="mr-[2px] text-[11.5px] text-fg-faint">Target</span>
          {PLATFORMS.map((p) => (
            <Chip
              key={p.id}
              active={selectedPlatforms.includes(p.id)}
              onClick={() => togglePlatform(p.id)}
            >
              <span className="h-[10px] w-[10px] rounded-[3px]" style={{ background: p.swatch }} />
              {p.label}
            </Chip>
          ))}
        </div>

        {/* controls row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-[14px] border-t border-line pt-[14px]">
          <div className="flex flex-wrap items-center gap-4">
            {/* style lock */}
            <button
              onClick={toggleStyleLock}
              className="flex items-center gap-[9px] rounded-[9px] border px-[10px] py-[6px] transition"
              style={{
                borderColor: styleLock.enabled ? "rgba(124,92,255,.4)" : "#262630",
                background: styleLock.enabled ? "rgba(124,92,255,.08)" : "#0e0e13",
              }}
            >
              <span
                className="relative h-[22px] w-[38px] rounded-full transition-colors"
                style={{
                  background: styleLock.enabled
                    ? "linear-gradient(90deg,#7C5CFF,#534AB7)"
                    : "#262630",
                }}
              >
                <span
                  className="absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-all"
                  style={{
                    left: styleLock.enabled ? "18px" : "2px",
                    boxShadow: "0 1px 3px rgba(0,0,0,.4)",
                  }}
                />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[13px] font-semibold text-[#e9e9f0]">Style Lock</span>
                <span className="block text-[10.5px] text-fg-faint">
                  {styleLock.enabled ? "Brand DNA active" : "Off"}
                </span>
              </span>
            </button>

            {/* reference upload */}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-[9px] rounded-[9px] border border-dashed border-line-strong bg-[#0e0e13] px-[11px] py-[7px] transition hover:border-brand"
            >
              <span className="grid h-[30px] w-[30px] place-items-center rounded-[7px] bg-[repeating-linear-gradient(135deg,#1a1a22,#1a1a22_5px,#1f1f29_5px,#1f1f29_10px)] text-fg-subtle">
                <Upload size={13} />
              </span>
              <span className="text-left leading-tight">
                <span className="block max-w-[120px] truncate text-[13px] font-medium text-[#cfcfda]">
                  {refName ?? "Reference"}
                </span>
                <span className="block text-[10.5px] text-fg-faint">
                  {refName ? "anchor set" : "drop image"}
                </span>
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setRefName(e.target.files?.[0]?.name ?? null)}
            />

            {/* batch */}
            <div className="flex items-center gap-[10px] rounded-[9px] border border-line bg-[#0e0e13] px-[10px] py-[6px]">
              <span className="text-[12.5px] text-fg-dim">Batch</span>
              <button
                onClick={() => setBatch(batch - 1)}
                aria-label="Fewer"
                className="grid h-[22px] w-[22px] place-items-center rounded-md border border-line-strong bg-ink-700 text-[#cfcfda] transition hover:border-fg-faint"
              >
                <Minus size={13} />
              </button>
              <span className="w-[14px] text-center font-mono text-[14px] text-white">{batch}</span>
              <button
                onClick={() => setBatch(batch + 1)}
                aria-label="More"
                className="grid h-[22px] w-[22px] place-items-center rounded-md border border-line-strong bg-ink-700 text-[#cfcfda] transition hover:border-fg-faint"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <button
            onClick={() => void generate()}
            disabled={isGenerating}
            className="btn-primary px-[26px] py-3 text-[15px]"
          >
            <Sparkles size={16} />
            {isGenerating ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
