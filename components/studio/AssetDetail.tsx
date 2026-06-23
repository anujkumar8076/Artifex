"use client";

import { useState } from "react";
import { ArrowRight, Download, Wand2, X } from "lucide-react";
import { ASSET_TYPE_MAP, PLATFORM_MAP } from "@/lib/catalog";
import { downloadAsset, downloadZip } from "@/lib/export";
import { useActiveAssets, useStudio } from "@/lib/store";
import type { AssetFormat } from "@/lib/types";

export function AssetDetail({ onToast }: { onToast: (msg: string) => void }) {
  const selectedAssetId = useStudio((s) => s.selectedAssetId);
  const selectAsset = useStudio((s) => s.selectAsset);
  const removeAsset = useStudio((s) => s.removeAsset);
  const setPrompt = useStudio((s) => s.setPrompt);
  const setAssetType = useStudio((s) => s.setAssetType);
  const generate = useStudio((s) => s.generate);
  const assets = useActiveAssets();
  const [busy, setBusy] = useState<string | null>(null);

  const asset = assets.find((a) => a.id === selectedAssetId);
  if (!asset) return null;

  const close = () => selectAsset(null);

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    try {
      await fn();
    } catch {
      onToast("That export failed — check the console for details.");
    } finally {
      setBusy(null);
    }
  }

  const files =
    asset.format === "GLB"
      ? ["mesh.glb", "albedo.png", "normal.png", "lod.json"]
      : [`${asset.type}.png`, "manifest.json"];

  const FORMATS: { id: AssetFormat; sub: string }[] = [
    { id: "PNG", sub: "renders" },
    { id: "ZIP", sub: "full set" },
    { id: "GLB", sub: "3D mesh" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[2px]" onClick={close}>
      <div
        className="flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-line bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-[10px]">
            <span className="text-[15px] font-semibold">{asset.title}</span>
            <span className="rounded-full border border-brand/30 bg-brand/[0.18] px-2 py-[2px] text-[10.5px] font-semibold text-brand-softer">
              {ASSET_TYPE_MAP[asset.type].label}
            </span>
          </div>
          <button onClick={close} aria-label="Close" className="text-fg-faint transition hover:text-fg">
            <X size={18} />
          </button>
        </div>

        {/* preview */}
        <div className="border-b border-line-soft bg-[radial-gradient(700px_400px_at_50%_30%,#1a1726,#0B0B0F_75%)] p-5">
          <div className="overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.imageUrl} alt={asset.title} className="w-full object-cover" />
          </div>
          <div className="mt-3 flex flex-wrap gap-[6px]">
            <Meta label={`${asset.width}×${asset.height}`} />
            <Meta label={`provider · ${asset.provider}`} />
            {asset.meta?.styleLocked ? <Meta label="style-locked" accent /> : null}
          </div>
        </div>

        {/* export panel */}
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div>
            <div className="mono-label mb-[10px] text-[10px]">File format</div>
            <div className="grid grid-cols-3 gap-[9px]">
              {FORMATS.map((f) => {
                const active = asset.format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() =>
                      run(f.id, () =>
                        f.id === "ZIP" ? downloadZip([asset]) : downloadAsset(asset),
                      )
                    }
                    className="rounded-[10px] border bg-ink-850 px-2 py-3 text-center transition hover:border-brand"
                    style={active ? { borderColor: "#7C5CFF", background: "rgba(124,92,255,.12)" } : { borderColor: "#2b2b38" }}
                  >
                    <div className="text-[13px] font-semibold text-fg">
                      {busy === f.id ? "…" : f.id}
                    </div>
                    <div className="text-[10px] text-fg-faint">{f.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mono-label mb-[10px] text-[10px]">Push to engine</div>
            <div className="flex flex-col gap-[9px]">
              <button
                onClick={() => onToast("Install the Artifex plugin in Roblox Studio to enable one-click push.")}
                className="btn-primary w-full justify-start px-[14px] py-3 text-left"
              >
                <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-white/[0.18] text-[12px] font-bold">
                  R
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-semibold">Push to Roblox Studio</span>
                  <span className="block text-[10.5px] opacity-80">opens in active place</span>
                </span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onToast("Unity export bundles a .unitypackage + prefab — connect your project to enable.")}
                className="btn-ghost w-full justify-start px-[14px] py-3 text-left"
              >
                <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-line text-[12px] font-bold text-[#cfcfda]">
                  U
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-semibold">Unity package</span>
                  <span className="block text-[10.5px] text-fg-faint">.unitypackage + prefab</span>
                </span>
                <Download size={15} className="text-fg-faint" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setPrompt(asset.prompt);
              setAssetType(asset.type);
              void generate();
              close();
            }}
            className="btn-ghost w-full py-[10px] text-[13px]"
          >
            <Wand2 size={14} /> Generate variations
          </button>

          <div className="rounded-[11px] border border-line-soft bg-ink-800 p-[13px]">
            <div className="mb-[6px] flex items-center justify-between">
              <span className="text-[12px] text-fg-dim">Includes</span>
              <span className="text-[11px] text-fg-faint">{files.length} files</span>
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {files.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-line bg-ink-700 px-[7px] py-[3px] font-mono text-[10.5px] text-fg-dim"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              removeAsset(asset.id);
            }}
            className="mt-auto text-left text-[12px] text-fg-faint transition hover:text-red-300"
          >
            Delete asset
          </button>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className="rounded-md border px-[8px] py-[3px] font-mono text-[10.5px]"
      style={
        accent
          ? { borderColor: "rgba(124,92,255,.3)", background: "rgba(124,92,255,.12)", color: "#cdbcff" }
          : { borderColor: "#262630", background: "#15151c", color: "#9a9aa8" }
      }
    >
      {label}
    </span>
  );
}
