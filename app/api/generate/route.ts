import { NextResponse } from "next/server";
import { generateAssets, getProvider } from "@/lib/generation";
import type { GenerateRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight probe so the client can show "demo" vs "live" mode. */
export async function GET() {
  return NextResponse.json({ provider: getProvider().name });
}

export async function POST(req: Request) {
  let body: Partial<GenerateRequest>;
  try {
    body = (await req.json()) as Partial<GenerateRequest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt || !body.assetType) {
    return NextResponse.json(
      { error: "`prompt` and `assetType` are required." },
      { status: 400 },
    );
  }

  try {
    const result = await generateAssets({
      prompt: String(body.prompt),
      assetType: body.assetType,
      platforms: Array.isArray(body.platforms) ? body.platforms : [],
      batch: typeof body.batch === "number" ? body.batch : 1,
      styleLock: body.styleLock ?? null,
      seed: typeof body.seed === "number" ? body.seed : undefined,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[artifex] generate error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed." },
      { status: 500 },
    );
  }
}
