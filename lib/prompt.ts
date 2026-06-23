import { ASSET_TYPE_MAP, PLATFORM_MAP } from "./catalog";
import type { GenerateRequest } from "./types";

/** Per-asset-type framing appended to the user's prompt for real providers. */
const TYPE_FRAMING: Record<string, string> = {
  thumbnail: "a high-impact game thumbnail / key art, dramatic composition, strong focal subject",
  icon: "a single crisp game icon, centered, clean silhouette, readable at small sizes, subtle inner glow",
  gui: "a game UI / GUI panel set, clean frames and slots, cohesive interface kit, flat-but-rich",
  model3d: "a single game-ready 3D asset rendered on a neutral studio background, three-quarter view, soft studio lighting",
  character: "a single game character / creature, full body, three-quarter hero pose, neutral studio background",
  hud: "a game HUD element set — bars, overlays and indicators — clean, layered, screen-ready",
};

/**
 * Compose the final text prompt sent to a real generation provider,
 * weaving in asset-type framing, locked Brand DNA, and platform intent.
 */
export function buildPrompt(req: GenerateRequest): string {
  const type = ASSET_TYPE_MAP[req.assetType];
  const parts: string[] = [req.prompt.trim()];

  parts.push(TYPE_FRAMING[req.assetType] ?? `a game ${type.label.toLowerCase()}`);

  if (req.styleLock?.enabled) {
    if (req.styleLock.styleTags.length) {
      parts.push(`art style: ${req.styleLock.styleTags.join(", ")}`);
    }
    if (req.styleLock.palette.length) {
      parts.push(`strictly use this color palette: ${req.styleLock.palette.join(", ")}`);
    }
    if (req.styleLock.referenceName) {
      parts.push("match the lighting, edge style and material feel of the locked reference");
    }
  }

  if (req.platforms.length) {
    const names = req.platforms.map((p) => PLATFORM_MAP[p]?.label ?? p).join(", ");
    parts.push(`optimized for ${names}`);
  }

  parts.push("no text, no watermark, no signature, transparent or clean background");

  return parts.join(". ");
}
