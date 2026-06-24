import type { GeneratedAsset, GenerateRequest } from "../../types";
import { buildPrompt } from "../../prompt";
import { assembleAsset, clampBatch, makeTitle, type Provider } from "../shared";

// Google Gemini image generation via the Generative Language API.
// Free tier: get a key at https://aistudio.google.com/apikey
export const geminiProvider: Provider = {
  name: "gemini",
  async generate(req: GenerateRequest): Promise<GeneratedAsset[]> {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");

    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation";
    const batch = clampBatch(req.batch);
    const prompt = buildPrompt(req);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const assets: GeneratedAsset[] = [];
    for (let i = 0; i < batch; i++) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini ${res.status}: ${text.slice(0, 400)}`);
      }
      const json = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
        }>;
      };
      const parts = json.candidates?.[0]?.content?.parts ?? [];
      const img = parts.find((p) => p.inlineData?.data)?.inlineData;
      if (!img?.data) {
        throw new Error("Gemini returned no image — this model may not support image output.");
      }
      assets.push(
        assembleAsset({
          imageUrl: `data:${img.mimeType || "image/png"};base64,${img.data}`,
          req,
          title: makeTitle(req.prompt, i, batch),
          provider: "gemini",
        }),
      );
    }
    return assets;
  },
};
