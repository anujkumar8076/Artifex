import { Box, Lock, Layers, Rocket, Sparkles, Wand2 } from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    title: "Style Lock — Brand DNA",
    body: "Pin a palette, art style and reference once. Every asset across every type stays visually consistent — the thing image generators can't do.",
  },
  {
    icon: Layers,
    title: "Whole sets, one prompt",
    body: "Don't generate one icon — generate the entire HUD, icon pack or UI kit as a coherent, matching set.",
  },
  {
    icon: Box,
    title: "Engine-native export",
    body: "Correct specs per platform: GLB and FBX meshes, sprite sheets, 9-slice UI, texture atlases and PBR materials.",
  },
  {
    icon: Rocket,
    title: "Push straight to engine",
    body: "Send assets directly into Roblox Studio, or grab a .unitypackage / UPM bundle — no manual importing.",
  },
  {
    icon: Wand2,
    title: "Iterate in seconds",
    body: "Make it more X, generate variations, upscale, inpaint a region or remove the background — without re-rolling from scratch.",
  },
  {
    icon: Sparkles,
    title: "3D from a prompt",
    body: "Turn an idea or a reference image into a game-ready mesh with PBR textures and auto-LODs.",
  },
];

export function Features() {
  return (
    <section id="product" className="border-b border-line-faint bg-ink-950 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 max-w-[640px]">
          <div className="mono-label mb-3 text-[11px]">Why Artifex</div>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] md:text-[34px]">
            An asset pipeline, not just an image generator
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-fg-dim">
            Artifex is built around the two things game developers actually need: a consistent look
            across a whole project, and assets that drop straight into the engine.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="panel p-6 transition hover:border-line-strong">
              <span className="mb-4 grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-brand/30 bg-brand/[0.12] text-brand-soft">
                <f.icon size={18} />
              </span>
              <h3 className="text-[16px] font-semibold text-fg">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-fg-subtle">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
