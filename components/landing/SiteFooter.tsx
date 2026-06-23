import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const COLUMNS: { heading: string; links: string[] }[] = [
  { heading: "Product", links: ["Studio", "Style Lock", "Exports", "Pricing"] },
  { heading: "Platforms", links: ["Roblox", "UEFN", "Unity", "Unreal", "Blender"] },
  { heading: "Company", links: ["About", "Docs", "Changelog", "GitHub"] },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink-950 px-6 pb-12 pt-16 md:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-[280px]">
            <Logo />
            <p className="mt-4 text-[13.5px] leading-[1.6] text-fg-subtle">
              An AI design platform for game developers. Conjure any game asset from a single prompt.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="mono-label mb-4 text-[10px]">{col.heading}</div>
              <ul className="space-y-[10px]">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="/studio" className="text-[13.5px] text-fg-dim transition hover:text-fg">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line-soft pt-8 sm:flex-row">
          <span className="font-mono text-[11px] tracking-[0.05em] text-[#3a3a47]">
            ARTIFEX · CONJURE ANY GAME ASSET FROM A SINGLE PROMPT
          </span>
          <span className="text-[12px] text-fg-faint">© {new Date().getFullYear()} Artifex. MIT licensed.</span>
        </div>
      </div>
    </footer>
  );
}
