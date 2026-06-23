import { NextResponse } from "next/server";
import { getSessionSafe, isAuthConfigured } from "@/auth";
import { CREDIT_PACKS } from "@/lib/billing/packs";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { ensureProfile } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSessionSafe();
  const email = session?.user?.email ?? null;

  let credits: number | null = null;
  if (email) {
    const profile = await ensureProfile(email);
    credits = profile?.credits ?? null;
  }

  return NextResponse.json({
    authEnabled: isAuthConfigured(),
    supabaseEnabled: isSupabaseConfigured(),
    stripeEnabled: isStripeConfigured(),
    user: session?.user
      ? { email: session.user.email, name: session.user.name, image: session.user.image }
      : null,
    credits,
    packs: CREDIT_PACKS,
  });
}
