// Shared domain types used by both the client (studio UI) and the
// server (generation API). Keep this file free of React / Node imports.

export type AssetTypeId =
  | "thumbnail"
  | "icon"
  | "gui"
  | "model3d"
  | "character"
  | "hud";

export type AssetFormat = "PNG" | "GLB" | "ZIP";

export type PlatformId =
  | "roblox"
  | "uefn"
  | "minecraft"
  | "unity"
  | "unreal"
  | "blender";

export interface StyleLock {
  enabled: boolean;
  /** Locked hex palette, e.g. ["#8FC9FF", "#2A4A7A", ...] */
  palette: string[];
  /** Art-direction tags, e.g. ["Stylized low-poly", "Soft rim lighting"] */
  styleTags: string[];
  /** Optional anchor reference image name. */
  referenceName?: string;
}

export interface GenerateRequest {
  prompt: string;
  assetType: AssetTypeId;
  platforms: PlatformId[];
  batch: number;
  styleLock: StyleLock | null;
  /** Optional deterministic seed. */
  seed?: number;
}

export interface GeneratedAsset {
  id: string;
  title: string;
  type: AssetTypeId;
  platforms: PlatformId[];
  format: AssetFormat;
  /** Preview image — a data: URL (mock/openai) or a remote https URL. */
  imageUrl: string;
  /** Optional downloadable binary (e.g. a .glb) when the provider returns one. */
  fileUrl?: string;
  prompt: string;
  provider: string;
  createdAt: number;
  status: "done" | "error";
  width: number;
  height: number;
  meta?: Record<string, string | number | boolean>;
}

export interface GenerateResponse {
  assets: GeneratedAsset[];
  provider: string;
}
