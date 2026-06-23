import "server-only";
import { getSupabase } from "./supabase/server";
import type { GeneratedAsset } from "./types";

export interface Profile {
  email: string;
  credits: number;
  stripe_customer_id: string | null;
}

/** New accounts start with a small free credit grant. */
export const SIGNUP_CREDITS = 200;

export async function ensureProfile(email: string): Promise<Profile | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("profiles").select("*").eq("email", email).maybeSingle();
  if (data) return data as Profile;
  const { data: created } = await sb
    .from("profiles")
    .insert({ email, credits: SIGNUP_CREDITS })
    .select("*")
    .single();
  return (created as Profile) ?? null;
}

export async function addCredits(email: string, amount: number): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await ensureProfile(email);
  const { error } = await sb.rpc("increment_credits", { p_email: email, p_amount: amount });
  if (error) {
    // Fallback if the SQL function isn't installed (non-atomic).
    const { data } = await sb.from("profiles").select("credits").eq("email", email).single();
    const current = (data?.credits as number | undefined) ?? 0;
    await sb.from("profiles").update({ credits: current + amount }).eq("email", email);
  }
}

export async function setStripeCustomer(email: string, customerId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("profiles").update({ stripe_customer_id: customerId }).eq("email", email);
}

// ── Project / asset persistence (ready for client wiring) ──────────────

export async function listProjects(email: string) {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("projects")
    .select("*")
    .eq("user_email", email)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createProject(email: string, name: string, color: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("projects")
    .insert({ user_email: email, name, color })
    .select("*")
    .single();
  return data;
}

export async function saveAssets(email: string, projectId: string, assets: GeneratedAsset[]) {
  const sb = getSupabase();
  if (!sb || !assets.length) return;
  const rows = assets.map((a) => ({
    id: a.id,
    user_email: email,
    project_id: projectId,
    type: a.type,
    title: a.title,
    format: a.format,
    image_url: a.imageUrl,
    file_url: a.fileUrl ?? null,
    prompt: a.prompt,
    provider: a.provider,
    width: a.width,
    height: a.height,
    meta: a.meta ?? {},
  }));
  await sb.from("assets").upsert(rows);
}
