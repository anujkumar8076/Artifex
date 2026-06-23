import { NextResponse } from "next/server";
import { getSessionSafe } from "@/auth";
import { saveAssets } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { GeneratedAsset } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSessionSafe();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Persistence is not configured." }, { status: 501 });
  }
  const { projectId, assets } = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    assets?: GeneratedAsset[];
  };
  if (!projectId || !Array.isArray(assets)) {
    return NextResponse.json({ error: "projectId and assets are required." }, { status: 400 });
  }
  await saveAssets(email, projectId, assets);
  return NextResponse.json({ saved: assets.length });
}
