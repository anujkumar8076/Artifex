import "server-only";
import Stripe from "stripe";

let cached: Stripe | null | undefined;

/** Returns a Stripe client, or null when STRIPE_SECRET_KEY is unset. */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/** Maps a credit-pack id to its configured Stripe Price id (server-only env). */
export function priceIdFor(packId: string): string | undefined {
  const map: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    studio: process.env.STRIPE_PRICE_STUDIO,
  };
  return map[packId];
}
