import { NextResponse } from "next/server";
import { getSessionSafe } from "@/auth";
import { createProject, listAssets, listProjects } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSessionSafe();
  const email = session?.user?.email;
  if (!email || !isSupabaseConfigured()) {
    return NextResponse.json({ synced: false, projects: [], assets: [] });
  }
  const [projects, assets] = await Promise.all([listProjects(email), listAssets(email)]);
  return NextResponse.json({ synced: true, projects, assets });
}

export async function POST(req: Request) {
  const session = await getSessionSafe();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Persistence is not configured." }, { status: 501 });
  }
  const { name, color } = (await req.json().catch(() => ({}))) as { name?: string; color?: string };
  const project = await createProject(email, name?.trim() || "Untitled project", color || "#7C5CFF");
  return NextResponse.json({ project });
}
