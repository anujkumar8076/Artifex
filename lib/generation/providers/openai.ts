import type { GeneratedAsset, GenerateRequest } from "../../types";
import { ASSET_TYPE_MAP } from "../../catalog";
import { buildPrompt } from "../../prompt";
import { assembleAsset, clampBatch, makeTitle, type Provider } from "../shared";

function sizeFor(typeId: GenerateRequest["assetType"]): string {
  const def = ASSET_TYPE_MAP[typeId];
  if (def.width > def.height) return "1536x1024";
  if (def.height > def.width) return "1024x1536";
  return "1024x1024";
}

// OpenAI-compatible image generation. Works with OpenAI's gpt-image-1 /
// dall-e-3, and any OpenAI-compatible image endpoint via OPENAI_BASE_URL.
export const openaiProvider: Provider = {
  name: "openai",
  async generate(req: GenerateRequest): Promise<GeneratedAsset[]> {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set");

    const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
    const batch = clampBatch(req.batch);
    const prompt = buildPrompt(req);
    const size = sizeFor(req.assetType);

    // dall-e-3 only supports n=1; gpt-image-1 supports batching.
    const isDalle3 = model.includes("dall-e-3");
    const rounds = isDalle3 ? batch : 1;
    const nPer = isDalle3 ? 1 : batch;

    const urls: string[] = [];
    for (let round = 0; round < rounds; round++) {
      const res = await fetch(`${base}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ model, prompt, n: nPer, size }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenAI ${res.status}: ${text.slice(0, 400)}`);
      }
      const json = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
      for (const item of json.data ?? []) {
        if (item.b64_json) urls.push(`data:image/png;base64,${item.b64_json}`);
        else if (item.url) urls.push(item.url);
      }
    }

    return urls.map((imageUrl, i) =>
      assembleAsset({
        imageUrl,
        req,
        title: makeTitle(req.prompt, i, urls.length),
        provider: "openai",
      }),
    );
  },
};
