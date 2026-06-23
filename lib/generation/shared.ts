import { ASSET_TYPE_MAP } from "../catalog";
import type { GeneratedAsset, GenerateRequest } from "../types";
import { uid } from "../utils";

export interface Provider {
  name: string;
  generate(req: GenerateRequest): Promise<GeneratedAsset[]>;
}

function titleFromPrompt(prompt: string): string {
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  if (!words.length) return "Untitled asset";
  const t = words.join(" ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function makeTitle(prompt: string, index: number, batch: number): string {
  const base = titleFromPrompt(prompt);
  return batch > 1 ? `${base} · v${index + 1}` : base;
}

export function assembleAsset(opts: {
  imageUrl: string;
  fileUrl?: string;
  req: GenerateRequest;
  title: string;
  provider: string;
  width?: number;
  height?: number;
}): GeneratedAsset {
  const def = ASSET_TYPE_MAP[opts.req.assetType];
  return {
    id: uid("asset"),
    title: opts.title,
    type: opts.req.assetType,
    platforms: opts.req.platforms,
    format: def.defaultFormat,
    imageUrl: opts.imageUrl,
    fileUrl: opts.fileUrl,
    prompt: opts.req.prompt,
    provider: opts.provider,
    createdAt: Date.now(),
    status: "done",
    width: opts.width ?? def.width,
    height: opts.height ?? def.height,
    meta: {
      styleLocked: !!opts.req.styleLock?.enabled,
    },
  };
}

export function clampBatch(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(8, Math.round(n)));
}
