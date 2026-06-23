import { NextResponse } from "next/server";
import { getSessionSafe } from "@/auth";
import { PACK_MAP } from "@/lib/billing/packs";
import { getStripe, priceIdFor } from "@/lib/billing/stripe";
import { ensureProfile } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 501 });
  }

  const session = await getSessionSafe();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Sign in to buy credits." }, { status: 401 });
  }

  const { packId } = (await req.json().catch(() => ({}))) as { packId?: string };
  const pack = packId ? PACK_MAP[packId] : undefined;
  const price = packId ? priceIdFor(packId) : undefined;
  if (!pack || !price) {
    return NextResponse.json({ error: "Unknown or unconfigured credit pack." }, { status: 400 });
  }

  await ensureProfile(email);
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    customer_email: email,
    success_url: `${base}/studio?purchase=success`,
    cancel_url: `${base}/studio?purchase=cancel`,
    metadata: { email, packId: pack.id, credits: String(pack.credits) },
  });

  return NextResponse.json({ url: checkout.url });
}
