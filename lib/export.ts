import JSZip from "jszip";
import { PLATFORM_MAP } from "./catalog";
import type { GeneratedAsset } from "./types";
import { slugify } from "./utils";

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Fetch any image source (data: or https:) into a Blob. */
async function sourceToBlob(src: string): Promise<{ blob: Blob; ext: string }> {
  const res = await fetch(src);
  const blob = await res.blob();
  const ext = extFromMime(blob.type) ?? extFromUrl(src) ?? "png";
  return { blob, ext };
}

function extFromMime(mime: string): string | null {
  if (!mime) return null;
  if (mime.includes("svg")) return "svg";
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gltf-binary")) return "glb";
  return null;
}

function extFromUrl(url: string): string | null {
  const m = url.split("?")[0].match(/\.([a-z0-9]{2,4})$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Download a single asset as its primary file (PNG image, or GLB if present). */
export async function downloadAsset(asset: GeneratedAsset): Promise<void> {
  const base = slugify(asset.title);
  if (asset.format === "GLB" && asset.fileUrl) {
    const { blob } = await sourceToBlob(asset.fileUrl);
    triggerDownload(blob, `${base}.glb`);
    return;
  }
  const { blob, ext } = await sourceToBlob(asset.imageUrl);
  triggerDownload(blob, `${base}.${ext}`);
}

/** Bundle one or more assets (plus a manifest) into a single .zip. */
export async function downloadZip(
  assets: GeneratedAsset[],
  zipName = "artifex-assets",
): Promise<void> {
  const zip = new JSZip();
  const used = new Set<string>();

  const manifest = {
    generator: "Artifex",
    exportedAt: new Date().toISOString(),
    count: assets.length,
    assets: [] as Array<Record<string, unknown>>,
  };

  for (const asset of assets) {
    let name = slugify(asset.title);
    let n = name;
    let i = 2;
    while (used.has(n)) n = `${name}_${i++}`;
    used.add(n);
    name = n;

    const { blob, ext } = await sourceToBlob(asset.imageUrl);
    zip.file(`${name}.${ext}`, blob);

    if (asset.format === "GLB" && asset.fileUrl) {
      const { blob: glb } = await sourceToBlob(asset.fileUrl);
      zip.file(`${name}.glb`, glb);
    }

    manifest.assets.push({
      file: `${name}.${ext}`,
      title: asset.title,
      type: asset.type,
      format: asset.format,
      platforms: asset.platforms.map((p) => PLATFORM_MAP[p]?.label ?? p),
      prompt: asset.prompt,
      provider: asset.provider,
      size: `${asset.width}x${asset.height}`,
    });
  }

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file(
    "README.txt",
    "Generated with Artifex — conjure any game asset from a single prompt.\n" +
      "See manifest.json for per-asset metadata.\n",
  );

  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, `${zipName}.zip`);
}
