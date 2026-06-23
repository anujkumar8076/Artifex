import type { AssetFormat, AssetTypeId, PlatformId } from "./types";

export interface AssetTypeDef {
  id: AssetTypeId;
  label: string;
  /** lucide-react icon name, mapped to a component in the client. */
  icon: string;
  description: string;
  defaultFormat: AssetFormat;
  /** Native pixel dimensions used for previews + real generation. */
  width: number;
  height: number;
}

export const ASSET_TYPES: AssetTypeDef[] = [
  { id: "thumbnail", label: "Thumbnail", icon: "Image", description: "Store & marketing key art", defaultFormat: "PNG", width: 1280, height: 720 },
  { id: "icon", label: "Icon", icon: "Shapes", description: "Crisp item & ability icons", defaultFormat: "PNG", width: 640, height: 640 },
  { id: "gui", label: "GUI set", icon: "LayoutDashboard", description: "Menus, panels & frames", defaultFormat: "PNG", width: 960, height: 720 },
  { id: "model3d", label: "3D model", icon: "Box", description: "Game-ready mesh + PBR", defaultFormat: "GLB", width: 800, height: 800 },
  { id: "character", label: "Character", icon: "User", description: "Heroes, NPCs & bosses", defaultFormat: "GLB", width: 800, height: 800 },
  { id: "hud", label: "HUD", icon: "Heart", description: "Bars, overlays & indicators", defaultFormat: "PNG", width: 1024, height: 576 },
];

export const ASSET_TYPE_MAP: Record<AssetTypeId, AssetTypeDef> = Object.fromEntries(
  ASSET_TYPES.map((t) => [t.id, t]),
) as Record<AssetTypeId, AssetTypeDef>;

export interface PlatformDef {
  id: PlatformId;
  label: string;
  /** Brand swatch shown in the UI. */
  swatch: string;
  /** Short export descriptor. */
  export: string;
}

export const PLATFORMS: PlatformDef[] = [
  { id: "roblox", label: "Roblox", swatch: "#E2231A", export: "Push to Studio · PNG / Mesh" },
  { id: "uefn", label: "UEFN", swatch: "#5a5a66", export: "Fortnite · PNG / GLB" },
  { id: "minecraft", label: "Minecraft", swatch: "#5B8B3A", export: "Textures · PNG" },
  { id: "unity", label: "Unity", swatch: "#7d7d8a", export: ".unitypackage · GLB" },
  { id: "unreal", label: "Unreal", swatch: "#9a9aa8", export: "FBX / GLB · materials" },
  { id: "blender", label: "Blender", swatch: "#E87D0D", export: "GLB · ready to edit" },
];

export const PLATFORM_MAP: Record<PlatformId, PlatformDef> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p]),
) as Record<PlatformId, PlatformDef>;

/** A sensible default "Brand DNA" so Style Lock is meaningful on first run. */
export const DEFAULT_PALETTE = ["#8FC9FF", "#2A4A7A", "#7C5CFF", "#FF6A3D", "#0E1118"];
export const DEFAULT_STYLE_TAGS = [
  "Stylized low-poly",
  "Soft rim lighting",
  "Glowing rune accents",
];
