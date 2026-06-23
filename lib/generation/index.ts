import "server-only";

import type { GenerateRequest } from "../types";
import { mockProvider } from "./providers/mock";
import { openaiProvider } from "./providers/openai";
import { replicateProvider } from "./providers/replicate";
import { clampBatch, type Provider } from "./shared";

const PROVIDERS: Record<string, Provider> = {
  mock: mockProvider,
  openai: openaiProvider,
  replicate: replicateProvider,
};

function hasKeyFor(name: string): boolean {
  if (name === "openai") return !!process.env.OPENAI_API_KEY;
  if (name === "replicate") return !!process.env.REPLICATE_API_TOKEN;
  return true;
}

/** Resolve the active provider from env, falling back to mock when unconfigured. */
export function getProvider(): Provider {
  const requested = (process.env.GENERATION_PROVIDER || "mock").toLowerCase();
  const provider = PROVIDERS[requested];
  if (!provider) {
    console.warn(`[artifex] unknown GENERATION_PROVIDER "${requested}", using mock.`);
    return mockProvider;
  }
  if (!hasKeyFor(requested)) {
    console.warn(
      `[artifex] GENERATION_PROVIDER="${requested}" but its API key is missing — using mock. ` +
        `Set the key in .env.local to enable real generation.`,
    );
    return mockProvider;
  }
  return provider;
}

export async function generateAssets(req: GenerateRequest) {
  const provider = getProvider();
  const safeReq: GenerateRequest = { ...req, batch: clampBatch(req.batch) };
  const assets = await provider.generate(safeReq);
  return { assets, provider: provider.name };
}
