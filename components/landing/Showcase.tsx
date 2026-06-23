import { DEFAULT_PALETTE } from "@/lib/catalog";
import { placeholderImage } from "@/lib/generation/placeholder";
import type { AssetTypeId } from "@/lib/types";

interface Item {
  title: string;
  type: AssetTypeId;
  platform: string;
  file: string;
}

const ITEMS: Item[] = [
  { title: "Frost knight helm", type: "model3d", platform: "Unity", file: "frost_helm.glb" },
  { title: "Health & mana HUD", type: "hud", platform: "Roblox", file: "hud_set.png" },
  { title: "Loot crate icon", type: "icon", platform: "UEFN", file: "loot_crate.png" },
  { title: "Tavern keeper", type: "character", platform: "Unreal", file: "tavern_npc.glb" },
  { title: "Battle pass key art", type: "thumbnail", platform: "Roblox", file: "battlepass_s4.png" },
  { title: "Inventory grid", type: "gui", platform: "Unity", file: "inventory_ui.png" },
  { title: "Ember greatsword", type: "model3d", platform: "Blender", file: "ember_sword.glb" },
  { title: "Quest scroll icon", type: "icon", platform: "Minecraft", file: "quest_scroll.png" },
];

const TYPE_LABEL: Record<AssetTypeId, string> = {
  thumbnail: "Thumbnail",
  icon: "Icon",
  gui: "GUI set",
  model3d: "3D model",
  character: "Character",
  hud: "HUD",
};

export function Showcase() {
  return (
    <section className="border-b border-line-faint bg-ink-950 px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mono-label mb-2 text-[11px]">One prompt, one consistent set</div>
            <h2 className="text-[26px] font-bold tracking-[-0.02em] md:text-[30px]">
              Built for the games you ship
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {ITEMS.map((s) => {
            const { dataUrl } = placeholderImage({
              title: s.title,
              type: s.type,
              palette: DEFAULT_PALETTE,
              seedStr: s.title,
            });
            return (
              <div
                key={s.title}
                className="overflow-hidden rounded-[14px] border border-[#20202a] bg-ink-850 transition hover:border-line-strong"
              >
                <div className="relative h-[150px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={dataUrl} alt={s.title} className="h-full w-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg,transparent 55%,rgba(11,11,15,.55))" }}
                  />
                  <span className="absolute bottom-[9px] left-[10px] rounded-md bg-black/40 px-[7px] py-[3px] font-mono text-[10px] text-[#c9c9d6] backdrop-blur-sm">
                    {s.file}
                  </span>
                  <span className="absolute right-[10px] top-[9px] rounded-full border border-brand/30 bg-brand/[0.18] px-2 py-[3px] text-[10.5px] font-semibold text-brand-softer">
                    {TYPE_LABEL[s.type]}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-[11px]">
                  <span className="text-[13px] font-semibold text-[#e9e9f0]">{s.title}</span>
                  <span className="text-[11px] text-fg-faint">{s.platform}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
