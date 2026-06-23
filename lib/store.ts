import { create } from "zustand";
import type { CreditPack } from "./billing/packs";
import {
  ASSET_TYPE_MAP,
  DEFAULT_PALETTE,
  DEFAULT_STYLE_TAGS,
} from "./catalog";
import { placeholderImage } from "./generation/placeholder";
import type {
  AssetTypeId,
  GeneratedAsset,
  GenerateResponse,
  PlatformId,
  StyleLock,
} from "./types";
import { uid } from "./utils";

export interface Project {
  id: string;
  name: string;
  color: string;
}

function seedAsset(
  title: string,
  type: AssetTypeId,
  platforms: PlatformId[],
  ageMs: number,
): GeneratedAsset {
  const { dataUrl, width, height } = placeholderImage({
    title,
    type,
    palette: DEFAULT_PALETTE,
    seedStr: title,
  });
  const def = ASSET_TYPE_MAP[type];
  return {
    id: uid("seed"),
    title,
    type,
    platforms,
    format: def.defaultFormat,
    imageUrl: dataUrl,
    prompt: title,
    provider: "mock",
    createdAt: Date.now() - ageMs,
    status: "done",
    width,
    height,
    meta: { styleLocked: true },
  };
}

const PROJECTS: Project[] = [
  { id: "p_frostspire", name: "Frostspire Online", color: "#7C5CFF" },
  { id: "p_neondrift", name: "Neon Drift Racing", color: "#FF6A3D" },
  { id: "p_pocket", name: "Pocket Dungeon", color: "#5DCAA5" },
  { id: "p_skybound", name: "Skybound co-op", color: "#85B7EB" },
];

/** Credit cost per asset — 3D is pricier than 2D, like real model pricing. */
function costFor(type: AssetTypeId, batch: number): number {
  const per = type === "model3d" || type === "character" ? 40 : 10;
  return per * batch;
}

/** Map a Supabase asset row back into the client GeneratedAsset shape. */
function rowToAsset(r: Record<string, any>): GeneratedAsset {
  return {
    id: String(r.id),
    title: r.title ?? "Asset",
    type: r.type,
    platforms: Array.isArray(r.platforms) ? r.platforms : [],
    format: r.format ?? "PNG",
    imageUrl: r.image_url,
    fileUrl: r.file_url ?? undefined,
    prompt: r.prompt ?? "",
    provider: r.provider ?? "",
    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
    status: "done",
    width: r.width ?? 0,
    height: r.height ?? 0,
    meta: r.meta ?? {},
  };
}

const SEED: GeneratedAsset[] = [
  seedAsset("Frost dragon boss", "character", ["roblox"], 9000),
  seedAsset("Dragon health bar", "hud", ["roblox"], 8000),
  seedAsset("Ice shard icon", "icon", ["unity"], 7000),
  seedAsset("Frozen throne", "model3d", ["blender"], 6000),
  seedAsset("Boss intro thumb", "thumbnail", ["roblox"], 5000),
  seedAsset("Rune spellbook", "icon", ["uefn"], 4000),
  seedAsset("Glacier minion", "character", ["unreal"], 3000),
];

interface StudioState {
  projects: Project[];
  activeProjectId: string;
  assetsByProject: Record<string, GeneratedAsset[]>;

  prompt: string;
  assetType: AssetTypeId;
  selectedPlatforms: PlatformId[];
  styleLock: StyleLock;
  batch: number;

  isGenerating: boolean;
  generatingCount: number;
  error: string | null;
  provider: string | null;
  configuredProvider: string | null;
  credits: number;
  selectedAssetId: string | null;

  // account / billing
  user: { email?: string | null; name?: string | null; image?: string | null } | null;
  authEnabled: boolean;
  stripeEnabled: boolean;
  supabaseEnabled: boolean;
  packs: CreditPack[];
  cloudLoaded: boolean;

  // actions
  loadProvider: () => Promise<void>;
  loadAccount: () => Promise<void>;
  loadCloud: () => Promise<void>;
  setPrompt: (v: string) => void;
  setAssetType: (t: AssetTypeId) => void;
  togglePlatform: (p: PlatformId) => void;
  toggleStyleLock: () => void;
  setBatch: (n: number) => void;
  setActiveProject: (id: string) => void;
  newProject: (name?: string) => Promise<void>;
  selectAsset: (id: string | null) => void;
  removeAsset: (id: string) => void;
  clearError: () => void;
  generate: () => Promise<void>;
}

export const useStudio = create<StudioState>((set, get) => ({
  projects: PROJECTS,
  activeProjectId: PROJECTS[0].id,
  assetsByProject: { [PROJECTS[0].id]: SEED },

  prompt:
    "A stylized low-poly frost dragon boss with icy blue scales and glowing runes — plus a matching health-bar HUD and a battle thumbnail",
  assetType: "character",
  selectedPlatforms: ["roblox", "unity"],
  styleLock: {
    enabled: true,
    palette: DEFAULT_PALETTE,
    styleTags: DEFAULT_STYLE_TAGS,
    referenceName: "frostspire_keyart.png",
  },
  batch: 4,

  isGenerating: false,
  generatingCount: 0,
  error: null,
  provider: null,
  configuredProvider: null,
  credits: 2480,
  selectedAssetId: null,

  user: null,
  authEnabled: false,
  stripeEnabled: false,
  supabaseEnabled: false,
  packs: [],
  cloudLoaded: false,

  loadProvider: async () => {
    try {
      const res = await fetch("/api/generate");
      if (res.ok) {
        const d = (await res.json()) as { provider?: string };
        if (d.provider) set({ configuredProvider: d.provider });
      }
    } catch {
      /* non-fatal */
    }
  },
  loadAccount: async () => {
    try {
      const res = await fetch("/api/account");
      if (!res.ok) return;
      const d = (await res.json()) as {
        authEnabled?: boolean;
        stripeEnabled?: boolean;
        supabaseEnabled?: boolean;
        packs?: CreditPack[];
        user?: StudioState["user"];
        credits?: number | null;
      };
      set({
        authEnabled: !!d.authEnabled,
        stripeEnabled: !!d.stripeEnabled,
        supabaseEnabled: !!d.supabaseEnabled,
        packs: d.packs ?? [],
        user: d.user ?? null,
        ...(typeof d.credits === "number" ? { credits: d.credits } : {}),
      });
    } catch {
      /* non-fatal */
    }
  },
  loadCloud: async () => {
    const s = get();
    if (!(s.user && s.supabaseEnabled) || s.cloudLoaded) return;
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) return;
      const d = (await res.json()) as {
        synced?: boolean;
        projects?: Array<Record<string, any>>;
        assets?: Array<Record<string, any>>;
      };
      if (!d.synced) return;

      const projects: Project[] = (d.projects ?? []).map((p) => ({
        id: String(p.id),
        name: p.name,
        color: p.color || "#7C5CFF",
      }));

      if (projects.length === 0) {
        // Brand-new user — start them with one cloud project.
        set({ cloudLoaded: true });
        await get().newProject("My assets");
        return;
      }

      const assetsByProject: Record<string, GeneratedAsset[]> = {};
      for (const p of projects) assetsByProject[p.id] = [];
      for (const row of d.assets ?? []) {
        const pid = String(row.project_id);
        if (assetsByProject[pid]) assetsByProject[pid].push(rowToAsset(row));
      }

      set({
        projects,
        assetsByProject,
        activeProjectId: projects[0].id,
        cloudLoaded: true,
        selectedAssetId: null,
      });
    } catch {
      /* non-fatal — stay in local mode */
    }
  },
  setPrompt: (v) => set({ prompt: v }),
  setAssetType: (t) => set({ assetType: t }),
  togglePlatform: (p) =>
    set((s) => ({
      selectedPlatforms: s.selectedPlatforms.includes(p)
        ? s.selectedPlatforms.filter((x) => x !== p)
        : [...s.selectedPlatforms, p],
    })),
  toggleStyleLock: () =>
    set((s) => ({ styleLock: { ...s.styleLock, enabled: !s.styleLock.enabled } })),
  setBatch: (n) => set({ batch: Math.max(1, Math.min(8, n)) }),

  setActiveProject: (id) => set({ activeProjectId: id, selectedAssetId: null }),
  newProject: async (name) => {
    const s = get();
    let id = uid("p");
    let pname = name?.trim() || `Untitled project ${s.projects.length + 1}`;
    let color = "#7C5CFF";

    if (s.user && s.supabaseEnabled) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: pname, color }),
        });
        if (res.ok) {
          const d = (await res.json()) as { project?: { id: string; name: string; color: string } };
          if (d.project?.id) {
            id = String(d.project.id);
            pname = d.project.name ?? pname;
            color = d.project.color ?? color;
          }
        }
      } catch {
        /* fall back to a local project */
      }
    }

    set((st) => ({
      projects: [{ id, name: pname, color }, ...st.projects],
      activeProjectId: id,
      assetsByProject: { ...st.assetsByProject, [id]: [] },
      selectedAssetId: null,
    }));
  },
  selectAsset: (id) => set({ selectedAssetId: id }),
  removeAsset: (id) =>
    set((s) => {
      const list = s.assetsByProject[s.activeProjectId] ?? [];
      return {
        assetsByProject: {
          ...s.assetsByProject,
          [s.activeProjectId]: list.filter((a) => a.id !== id),
        },
        selectedAssetId: s.selectedAssetId === id ? null : s.selectedAssetId,
      };
    }),
  clearError: () => set({ error: null }),

  generate: async () => {
    const s = get();
    if (s.isGenerating) return;
    if (!s.prompt.trim()) {
      set({ error: "Describe what you want to generate first." });
      return;
    }
    const cost = costFor(s.assetType, s.batch);
    if (s.credits < cost) {
      set({ error: `Not enough credits — this needs ${cost}, you have ${s.credits}.` });
      return;
    }
    set({ isGenerating: true, generatingCount: s.batch, error: null });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: s.prompt,
          assetType: s.assetType,
          platforms: s.selectedPlatforms,
          batch: s.batch,
          styleLock: s.styleLock.enabled ? s.styleLock : null,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `Generation failed (${res.status})`);
      }
      const data = (await res.json()) as GenerateResponse;
      set((st) => {
        const list = st.assetsByProject[st.activeProjectId] ?? [];
        return {
          assetsByProject: {
            ...st.assetsByProject,
            [st.activeProjectId]: [...data.assets, ...list],
          },
          provider: data.provider,
          configuredProvider: data.provider,
          credits: Math.max(0, st.credits - cost),
        };
      });

      // Persist to Supabase when signed in (fire-and-forget).
      const after = get();
      if (after.user && after.supabaseEnabled) {
        void fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: after.activeProjectId, assets: data.assets }),
        }).catch(() => {});
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      set({ isGenerating: false, generatingCount: 0 });
    }
  },
}));

/** Convenience selector for the active project's assets. */
export function useActiveAssets(): GeneratedAsset[] {
  return useStudio((s) => s.assetsByProject[s.activeProjectId] ?? []);
}
