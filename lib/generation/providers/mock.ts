import type { GeneratedAsset, GenerateRequest } from "../../types";
import { placeholderImage } from "../placeholder";
import { assembleAsset, clampBatch, makeTitle, type Provider } from "../shared";

// Fully-offline provider. Produces evocative procedural previews so the
// entire product can be developed and demoed without any API keys.
export const mockProvider: Provider = {
  name: "mock",
  async generate(req: GenerateRequest): Promise<GeneratedAsset[]> {
    const batch = clampBatch(req.batch);
    // Small synthetic delay so the loading state is visible in the UI.
    await new Promise((r) => setTimeout(r, 650));

    const palette = req.styleLock?.enabled ? req.styleLock.palette : undefined;

    return Array.from({ length: batch }, (_, i) => {
      const title = makeTitle(req.prompt, i, batch);
      const { dataUrl, width, height } = placeholderImage({
        title,
        type: req.assetType,
        palette,
        seedStr: `${req.prompt}|${i}|${req.seed ?? ""}`,
      });
      return assembleAsset({
        imageUrl: dataUrl,
        req,
        title,
        provider: "mock",
        width,
        height,
      });
    });
  },
};
