import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/billing/stripe";
import { addCredits } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text(); // raw body required for signature verification
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const email = (s.metadata?.email as string | undefined) ?? s.customer_email ?? undefined;
    const credits = parseInt((s.metadata?.credits as string | undefined) ?? "0", 10);
    if (email && credits > 0) {
      await addCredits(email, credits);
    }
  }

  return NextResponse.json({ received: true });
}
