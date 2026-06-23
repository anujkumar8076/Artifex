"use client";

import { useStudio } from "@/lib/store";
import { LogoMark } from "@/components/ui/Logo";

const STARTERS = [
  "A cozy farming sim — crops, tool icons and an inventory UI",
  "A sci-fi shooter HUD with ammo, shields and a minimap",
  "A fantasy RPG icon pack — potions, weapons and runes",
  "A tower defense set — towers, enemies and a wave banner",
];

export function EmptyState() {
  const setPrompt = useStudio((s) => s.setPrompt);
  const generate = useStudio((s) => s.generate);

  function start(p: string) {
    setPrompt(p);
    void generate();
  }

  return (
    <div className="grid place-items-center px-6 py-16">
      <div className="w-full max-w-[560px] text-center">
        <LogoMark size={60} className="mx-auto mb-6 animate-float rounded-[18px]" />
        <h2 className="text-[26px] font-bold tracking-[-0.02em] md:text-[30px]">
          Start your first asset set
        </h2>
        <p className="mx-auto mt-3 max-w-[460px] text-[15px] leading-[1.55] text-fg-dim">
          Describe what you&apos;re building. Artifex generates a matching set — and locks the style so
          everything after stays consistent.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-[9px]">
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => start(s)}
              className="max-w-full truncate rounded-full border border-line bg-[#101016] px-[13px] py-[7px] text-[12.5px] text-fg-dim transition hover:border-brand hover:text-[#cfcfda]"
            >
              {s.split("—")[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
