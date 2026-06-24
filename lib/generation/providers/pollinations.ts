import { ASSET_TYPE_MAP } from "../../catalog";
import { buildPrompt } from "../../prompt";
import type { GeneratedAsset, GenerateRequest } from "../../types";
import { hashStr } from "../../utils";
import { assembleAsset, clampBatch, makeTitle, type Provider } from "../shared";

// Pollinations — free, keyless AI image generation (Flux). Great for instantly
// seeing real output with zero setup. Community service; not for production SLAs.
export const pollinationsProvider: Provider = {
  name: "pollinations",
  async generate(req: GenerateRequest): Promise<GeneratedAsset[]> {
    const batch = clampBatch(req.batch);
    const prompt = buildPrompt(req);
    const def = ASSET_TYPE_MAP[req.assetType];
    const base = hashStr(prompt + (req.seed ?? ""));
    // Pollinations now gates anonymous use behind Turnstile; a free token
    // (https://auth.pollinations.ai) bypasses it.
    const token = process.env.POLLINATIONS_TOKEN;

    return Array.from({ length: batch }, (_, i) => {
      const seed = (base + i * 7919) % 1_000_000;
      const url =
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
        `?width=${def.width}&height=${def.height}&seed=${seed}&nologo=true&model=flux` +
        (token ? `&token=${token}` : "");
      return assembleAsset({
        imageUrl: url,
        req,
        title: makeTitle(req.prompt, i, batch),
        provider: "pollinations",
        width: def.width,
        height: def.height,
      });
    });
  },
};
