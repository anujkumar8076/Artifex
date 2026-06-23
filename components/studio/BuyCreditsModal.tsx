"use client";

import { useState } from "react";
import { Check, X, Zap } from "lucide-react";
import { CREDIT_PACKS } from "@/lib/billing/packs";
import { useStudio } from "@/lib/store";

export function BuyCreditsModal({ onClose }: { onClose: () => void }) {
  const storePacks = useStudio((s) => s.packs);
  const stripeEnabled = useStudio((s) => s.stripeEnabled);
  const user = useStudio((s) => s.user);
  const [busy, setBusy] = useState<string | null>(null);
  const packs = storePacks.length ? storePacks : CREDIT_PACKS;

  async function buy(packId: string) {
    if (!user) {
      useStudio.setState({ error: "Sign in to buy credits." });
      onClose();
      return;
    }
    setBusy(packId);
    try {
      const r = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const d = (await r.json()) as { url?: string; error?: string };
      if (r.ok && d.url) {
        window.location.href = d.url;
        return;
      }
      useStudio.setState({ error: d.error || "Could not start checkout." });
      onClose();
    } catch {
      useStudio.setState({ error: "Could not start checkout." });
      onClose();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-line bg-ink-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line-soft px-6 py-[18px]">
          <div className="flex items-center gap-[10px]">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] border border-brand/30 bg-brand/[0.12] text-brand-soft">
              <Zap size={16} />
            </span>
            <div>
              <div className="text-[16px] font-semibold">Buy credits</div>
              <div className="text-[12px] text-fg-faint">Credits never expire · spend them on any asset type</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-fg-faint transition hover:text-fg">
            <X size={18} />
          </button>
        </div>

        {!stripeEnabled && (
          <div className="border-b border-line-soft bg-[#1a1422] px-6 py-3 text-[12.5px] text-[#d9b48a]">
            Billing isn&apos;t connected yet — add your Stripe keys to enable real checkout. These are preview packs.
          </div>
        )}

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {packs.map((p) => {
            const featured = p.id === "pro";
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-[14px] border bg-ink-850 p-5"
                style={featured ? { borderColor: "#7C5CFF", boxShadow: "0 0 0 1px rgba(124,92,255,.2)" } : { borderColor: "#23232e" }}
              >
                {featured && (
                  <span className="mb-2 inline-flex w-fit rounded-full bg-brand/[0.18] px-2 py-[2px] text-[10.5px] font-semibold text-brand-softer">
                    Most popular
                  </span>
                )}
                <div className="text-[15px] font-semibold">{p.name}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[26px] font-bold">${p.priceUsd}</span>
                </div>
                <div className="mt-1 flex items-center gap-[6px] text-[13px] text-brand-soft">
                  <Check size={14} /> {p.credits.toLocaleString()} credits
                </div>
                <div className="mt-1 text-[12px] text-fg-faint">{p.blurb}</div>
                <button
                  onClick={() => buy(p.id)}
                  disabled={busy === p.id}
                  className={featured ? "btn-primary mt-4 py-[9px] text-[13px]" : "btn-ghost mt-4 py-[9px] text-[13px]"}
                >
                  {busy === p.id ? "Starting…" : "Buy"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
