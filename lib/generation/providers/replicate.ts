import type { GeneratedAsset, GenerateRequest } from "../../types";
import { ASSET_TYPE_MAP } from "../../catalog";
import { buildPrompt } from "../../prompt";
import { assembleAsset, clampBatch, makeTitle, type Provider } from "../shared";

function aspectFor(typeId: GenerateRequest["assetType"]): string {
  const def = ASSET_TYPE_MAP[typeId];
  if (def.width > def.height) return "16:9";
  if (def.height > def.width) return "9:16";
  return "1:1";
}

// Replicate provider — good for both image models (Flux, SDXL) and, with a
// different model id, image-to-3D. Uses `Prefer: wait` to avoid polling.
export const replicateProvider: Provider = {
  name: "replicate",
  async generate(req: GenerateRequest): Promise<GeneratedAsset[]> {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error("REPLICATE_API_TOKEN is not set");

    const model = process.env.REPLICATE_IMAGE_MODEL || "black-forest-labs/flux-schnell";
    const batch = clampBatch(req.batch);

    const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: {
          prompt: buildPrompt(req),
          num_outputs: batch,
          aspect_ratio: aspectFor(req.assetType),
          output_format: "png",
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Replicate ${res.status}: ${text.slice(0, 400)}`);
    }

    const json = (await res.json()) as { output?: string[] | string; error?: string };
    if (json.error) throw new Error(`Replicate: ${json.error}`);

    const output = Array.isArray(json.output) ? json.output : json.output ? [json.output] : [];
    return output.map((imageUrl, i) =>
      assembleAsset({
        imageUrl,
        req,
        title: makeTitle(req.prompt, i, output.length),
        provider: "replicate",
      }),
    );
  },
};
