// Client-safe credit-pack metadata (no secrets / no env access here).
// The Stripe price id for each pack is resolved server-side in the checkout route.

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceUsd: number;
  blurb: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", name: "Starter", credits: 1000, priceUsd: 9, blurb: "~100 images or 25 models" },
  { id: "pro", name: "Pro", credits: 5000, priceUsd: 39, blurb: "Most popular for solo devs" },
  { id: "studio", name: "Studio", credits: 20000, priceUsd: 129, blurb: "For teams shipping fast" },
];

export const PACK_MAP = Object.fromEntries(CREDIT_PACKS.map((p) => [p.id, p])) as Record<string, CreditPack>;
