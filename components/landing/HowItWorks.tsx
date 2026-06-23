import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    n: "1",
    title: "Describe it",
    body: "One prompt covers a whole set — characters, icons, UI and thumbnails together.",
  },
  {
    n: "2",
    title: "Lock the style",
    body: "Pin a palette, art style and reference so every future asset stays on-brand.",
  },
  {
    n: "3",
    title: "Ship to engine",
    body: "Export PNG, ZIP or GLB — or push straight into Roblox Studio and Unity.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-b border-line-faint bg-ink-950 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 text-center">
          <div className="mono-label mb-3 text-[11px]">How it works</div>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] md:text-[34px]">
            From idea to engine in three steps
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((st) => (
            <div key={st.n} className="rounded-[13px] border border-[#20202a] bg-[#101016] p-6">
              <div className="mb-3 flex items-center gap-[9px]">
                <span className="grid h-[26px] w-[26px] place-items-center rounded-lg border border-brand/30 bg-brand/[0.14] font-mono text-[12px] font-semibold text-brand-soft">
                  {st.n}
                </span>
                <span className="text-[15px] font-semibold text-[#e9e9f0]">{st.title}</span>
              </div>
              <p className="text-[13.5px] leading-[1.6] text-fg-subtle">{st.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/studio" className="btn-primary px-6 py-3 text-[15px]">
            Open the Studio <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
