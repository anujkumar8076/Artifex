import Link from "next/link";
import { CornerDownLeft } from "lucide-react";
import { PLATFORMS } from "@/lib/catalog";
import { SiteNav } from "./SiteNav";

const HERO_BG =
  "radial-gradient(1100px 520px at 50% -8%,rgba(124,92,255,.16),transparent 60%),radial-gradient(700px 400px at 88% 6%,rgba(255,106,61,.07),transparent 60%),#0B0B0F";
const MASK = "radial-gradient(900px 520px at 50% 0%,#000,transparent 72%)";

export function Hero() {
  return (
    <section className="relative border-b border-line-faint" style={{ background: HERO_BG }}>
      <div
        className="grid-bg pointer-events-none absolute inset-0"
        style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      />
      <div className="relative mx-auto max-w-[1240px] px-6 md:px-10">
        <SiteNav />

        <div className="relative pb-[18px] pt-[60px] text-center md:pt-[70px]">
          <div className="mb-[30px] inline-flex items-center gap-2 rounded-full border border-line bg-ink-850 px-[13px] py-[6px] text-[12.5px] text-fg-muted">
            <span className="h-[6px] w-[6px] rounded-full bg-brand" style={{ boxShadow: "0 0 8px #7C5CFF" }} />
            Now generating consistent 3D models · public beta
          </div>

          <h1 className="mx-auto max-w-[880px] text-[40px] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-[56px] md:text-[64px]">
            Conjure any game asset
            <br />
            from a single prompt.
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] text-[17px] leading-[1.55] text-fg-dim md:text-[19px]">
            Thumbnails, icons, GUIs, 3D models and characters — all visually consistent, all from one
            prompt. Export to every engine, or push straight into Roblox Studio.
          </p>

          {/* prompt mockup */}
          <div className="mx-auto mt-[42px] max-w-[680px] text-left">
            <div
              className="rounded-2xl border border-line-strong bg-ink-850 px-[18px] pb-[14px] pt-[18px]"
              style={{
                boxShadow:
                  "0 24px 60px rgba(0,0,0,.5),0 0 0 1px rgba(124,92,255,.08),0 0 40px rgba(124,92,255,.12)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="brand-mark mt-px grid h-[26px] w-[26px] flex-none place-items-center rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3v18M3 12h18" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-[15px] leading-[1.5] text-[#cfcfda] md:text-base">
                  A stylized low-poly frost dragon boss, icy blue scales, glowing runes — plus its health
                  bar HUD and a battle thumbnail
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-[14px]">
                <div className="flex gap-[7px]">
                  {["Character", "HUD", "+ Thumbnail"].map((t) => (
                    <span
                      key={t}
                      className="rounded-[7px] border border-line-strong bg-[#0e0e13] px-[9px] py-[5px] font-mono text-[11px] text-fg-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link href="/studio" className="btn-primary px-4 py-[9px] text-sm">
                  Generate <CornerDownLeft size={13} className="opacity-70" />
                </Link>
              </div>
            </div>
          </div>

          {/* platform row */}
          <div className="mt-10">
            <div className="mono-label mb-[18px] text-[11px]">Exports natively to</div>
            <div className="flex flex-wrap items-center justify-center gap-[14px]">
              {PLATFORMS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-[9px] rounded-[11px] border border-line bg-[#101016] px-[15px] py-[9px] text-sm font-semibold text-[#c3c3d0] transition hover:border-line-strong"
                >
                  <span className="block h-[18px] w-[18px] rounded-[5px]" style={{ background: p.swatch }} />
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
