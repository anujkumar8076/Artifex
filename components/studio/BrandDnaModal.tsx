"use client";

import { X } from "lucide-react";
import { useStudio } from "@/lib/store";

const PALETTE_NAMES = ["Glacier", "Deep frost", "Rune violet", "Ember core", "Void black"];

export function BrandDnaModal({ onClose }: { onClose: () => void }) {
  const styleLock = useStudio((s) => s.styleLock);
  const toggleStyleLock = useStudio((s) => s.toggleStyleLock);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="w-full max-w-[860px] overflow-hidden rounded-2xl border border-line bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line-soft bg-gradient-to-b from-[#13101c] to-ink-900 px-6 py-[18px]">
          <div className="flex items-center gap-3">
            <span
              className="brand-mark grid h-9 w-9 place-items-center rounded-[10px]"
              style={{ boxShadow: "0 0 18px rgba(124,92,255,.45)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="1.7" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#fff" strokeWidth="1.7" />
              </svg>
            </span>
            <div>
              <div className="text-[17px] font-semibold">Brand DNA</div>
              <div className="text-[12.5px] text-fg-faint">Locked across this project · every generation stays on-brand</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleStyleLock}
              className="flex items-center gap-[9px] rounded-[9px] border px-[13px] py-[7px] text-[12.5px] transition"
              style={{
                borderColor: styleLock.enabled ? "rgba(124,92,255,.3)" : "#262630",
                background: styleLock.enabled ? "rgba(124,92,255,.12)" : "#101016",
                color: styleLock.enabled ? "#b9a6ff" : "#9a9aa8",
              }}
            >
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{
                  background: styleLock.enabled ? "#7C5CFF" : "#3a3a47",
                  boxShadow: styleLock.enabled ? "0 0 8px #7C5CFF" : "none",
                }}
              />
              {styleLock.enabled ? "Lock active" : "Lock off"}
            </button>
            <button onClick={onClose} aria-label="Close" className="text-fg-faint transition hover:text-fg">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="grid md:grid-cols-3">
          {/* palette */}
          <div className="border-line-soft p-[22px] md:border-r">
            <div className="mono-label mb-[14px] text-[10px]">Locked palette</div>
            <div className="flex flex-col gap-[10px]">
              {styleLock.palette.map((hex, i) => (
                <div key={hex + i} className="flex items-center gap-[11px]">
                  <span
                    className="h-[34px] w-[34px] rounded-[9px] border border-white/10"
                    style={{ background: hex }}
                  />
                  <div>
                    <div className="text-[13px] font-medium text-[#e9e9f0]">
                      {PALETTE_NAMES[i] ?? `Color ${i + 1}`}
                    </div>
                    <div className="font-mono text-[11px] text-fg-faint">{hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* art style */}
          <div className="border-line-soft p-[22px] md:border-r">
            <div className="mono-label mb-[14px] text-[10px]">Art style</div>
            <div className="flex flex-col gap-[9px]">
              {styleLock.styleTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-[9px] rounded-[9px] border border-brand/35 bg-brand/[0.1] px-3 py-[9px]"
                >
                  <span className="h-[7px] w-[7px] rounded-[2px] bg-brand" />
                  <span className="text-[13px] font-medium text-[#e9e9f0]">{tag}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="mb-2 text-[12px] text-fg-dim">Consistency strength</div>
              <div className="h-[6px] overflow-hidden rounded-full bg-line">
                <div className="ember-track h-full" style={{ width: "88%" }} />
              </div>
              <div className="mt-[6px] text-[11px] text-fg-faint">High · 88% adherence</div>
            </div>
          </div>

          {/* reference */}
          <div className="p-[22px]">
            <div className="mono-label mb-[14px] text-[10px]">Reference image</div>
            <div className="relative grid h-[130px] place-items-center overflow-hidden rounded-xl border border-line bg-[repeating-linear-gradient(135deg,#1a1d2b,#1a1d2b_9px,#21253a_9px,#21253a_18px)]">
              <span className="font-mono text-[11px] text-fg-dim">
                {styleLock.referenceName ?? "no reference"}
              </span>
              <span className="absolute left-2 top-2 rounded-full border border-brand/30 bg-brand/20 px-[7px] py-[2px] text-[10px] text-brand-soft">
                anchor
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-[1.5] text-fg-subtle">
              Every asset borrows lighting, edge style and material feel from this anchor frame.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
