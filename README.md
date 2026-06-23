# Artifex

**Conjure any game asset from a single prompt.**

Artifex is an AI design platform for game developers. Describe what you're
building and it generates a *visually consistent* set of assets — thumbnails,
icons, GUIs/HUDs, 3D models and characters — and exports them to the engines
you actually use: Roblox, Fortnite UEFN, Minecraft, Unity, Unreal and Blender.

> Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS. Runs fully
> offline in **mock mode** with zero configuration, and switches to **real
> generation** the moment you add an API key.

---

## ✨ What makes it different

- **Style Lock / Brand DNA** — pin a palette, art style and reference image once,
  and every asset across every type stays on-brand. This is the thing raw image
  generators can't do.
- **Whole sets, one prompt** — generate a matching kit (the entire HUD, a full
  icon pack) instead of a single image.
- **Engine-native export** — PNG, a bundled ZIP (with a `manifest.json`), and GLB,
  plus first-class "push to Roblox Studio" and "Unity package" flows.
- **Iterate fast** — variations, re-rolls and per-asset downloads from the gallery.
- **Provider-agnostic** — swap the generation backend (mock → OpenAI → Replicate →
  your own) without touching the UI.

## 🚀 Quickstart

```bash
cd artifex
npm install
npm run dev
# open http://localhost:3000  (landing)  ·  /studio  (the app)
```

That's it — no keys required. The app boots in **mock mode** and produces
procedural placeholder previews so you can click through the entire product.

### Turning on real generation

Copy the example env file and pick a provider:

```bash
cp .env.example .env.local
```

```ini
# .env.local
GENERATION_PROVIDER=openai          # mock | openai | replicate
OPENAI_API_KEY=sk-...               # for provider=openai
# REPLICATE_API_TOKEN=r8_...        # for provider=replicate
```

Restart `npm run dev`. If a provider is selected but its key is missing, Artifex
logs a warning and safely falls back to mock mode, so it never hard-fails.

## 🧱 Project structure

```
artifex/
├─ app/
│  ├─ page.tsx                 # marketing landing page
│  ├─ studio/page.tsx          # the Studio app (client)
│  ├─ api/generate/route.ts    # generation endpoint
│  └─ layout.tsx, globals.css
├─ components/
│  ├─ landing/                 # Hero, Showcase, Features, HowItWorks, Footer
│  ├─ studio/                  # TopBar, LeftRail, Composer, Gallery, AssetDetail, BrandDnaModal
│  └─ ui/                      # Logo, Chip, AssetIcon
└─ lib/
   ├─ catalog.ts               # asset types + platforms + default Brand DNA
   ├─ store.ts                 # Zustand studio state (+ self-seeding demo data)
   ├─ prompt.ts                # composes the final generation prompt
   ├─ export.ts                # PNG / ZIP (JSZip) / GLB download utilities
   └─ generation/
      ├─ index.ts              # server-side provider selector
      ├─ placeholder.ts        # isomorphic procedural preview generator
      └─ providers/            # mock.ts, openai.ts, replicate.ts
```

### Adding a generation provider

Implement the `Provider` interface from `lib/generation/shared.ts` and register
it in `lib/generation/index.ts`:

```ts
export const myProvider: Provider = {
  name: "myprovider",
  async generate(req) {
    // call your model, return GeneratedAsset[]
  },
};
```

The `assembleAsset()` helper builds a well-formed asset from an image URL, so a
new provider is usually ~30 lines.

## 🌐 Deploy

Any Node host works. The fastest path is Vercel — push this folder to a GitHub
repo, then:

```bash
npm i -g vercel
vercel            # preview deploy
vercel --prod     # production deploy
```

Or one-click (replace `YOUR_REPO` after pushing to GitHub):

```
https://vercel.com/new/clone?repository-url=https://github.com/YOUR_REPO&env=GENERATION_PROVIDER,OPENAI_API_KEY
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

In the Vercel project settings, add `GENERATION_PROVIDER` and the matching API
key (`OPENAI_API_KEY` or `REPLICATE_API_TOKEN`) as environment variables.
Generation runs in a Node serverless route (`runtime = "nodejs"`); with no key
set, the deployment still works in demo mode.

## 🗺️ Roadmap (good first contributions)

- [ ] Real image→3D (GLB) provider wired through `generate3D`
- [ ] Async job queue + webhooks for long renders
- [ ] Auth + per-user projects (the store is already project-scoped)
- [ ] Roblox Studio companion plugin (Open Cloud) for true one-click push
- [ ] Sprite-sheet / 9-slice / texture-atlas post-processors
- [ ] Credits + billing (Stripe) for the hosted edition

## 🤝 Open source & licensing

Artifex is **MIT licensed** and designed as an **open-core** project: the studio
UI, export pipeline and provider adapters are free and self-hostable; a hosted
edition can layer on managed generation, billing and collaboration. Bring your
own keys to self-host, or run the hosted build for zero-setup credits.

Contributions welcome — see the roadmap above, open an issue, or send a PR.

---

Made with Artifex — *an asset pipeline, not just an image generator.*
