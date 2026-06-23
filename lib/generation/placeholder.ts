import { ASSET_TYPE_MAP } from "../catalog";
import type { AssetTypeId } from "../types";
import { hashStr, rng } from "../utils";

// Isomorphic, dependency-free procedural preview generator.
// Produces an evocative game-asset placeholder as an SVG data URL so the
// product is fully demoable in mock mode (no API keys, no network).

interface PlaceholderOpts {
  title: string;
  type: AssetTypeId;
  palette?: string[];
  seedStr: string;
}

function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

function motif(type: AssetTypeId, w: number, h: number, accent: string, ink: string, r: () => number): string {
  const cx = w / 2;
  const cy = h / 2;
  switch (type) {
    case "character": {
      const bw = w * 0.26;
      const bh = h * 0.5;
      return `
        <g opacity="0.92">
          <path d="M${cx} ${cy - bh / 2} q${bw} ${bh * 0.35} ${bw * 0.55} ${bh} q-${bw * 0.55} ${bh * 0.18} -${bw * 1.1} 0 q-${bw * 0.55} -${bh * 0.65} ${bw * 0.55} -${bh}Z"
            fill="${accent}" opacity="0.85"/>
          <circle cx="${cx}" cy="${cy - bh * 0.18}" r="${bw * 0.42}" fill="${ink}" opacity="0.35"/>
          <circle cx="${cx - bw * 0.16}" cy="${cy - bh * 0.2}" r="${w * 0.018}" fill="#fff" opacity="0.9"/>
          <circle cx="${cx + bw * 0.16}" cy="${cy - bh * 0.2}" r="${w * 0.018}" fill="#fff" opacity="0.9"/>
        </g>`;
    }
    case "model3d": {
      const s = w * 0.2;
      return `
        <g transform="translate(${cx} ${cy})" opacity="0.95">
          <polygon points="0,${-s} ${s},${-s / 2} 0,0 ${-s},${-s / 2}" fill="${accent}"/>
          <polygon points="${-s},${-s / 2} 0,0 0,${s} ${-s},${s / 2}" fill="${ink}" opacity="0.55"/>
          <polygon points="${s},${-s / 2} 0,0 0,${s} ${s},${s / 2}" fill="${accent}" opacity="0.7"/>
        </g>`;
    }
    case "icon": {
      const s = Math.min(w, h) * 0.32;
      return `
        <g transform="translate(${cx} ${cy})">
          <rect x="${-s}" y="${-s}" width="${s * 2}" height="${s * 2}" rx="${s * 0.4}" fill="${ink}" opacity="0.4"/>
          <rect x="${-s}" y="${-s}" width="${s * 2}" height="${s * 2}" rx="${s * 0.4}" fill="none" stroke="${accent}" stroke-width="${w * 0.012}"/>
          <path d="M0 ${-s * 0.5} L${s * 0.5} 0 L0 ${s * 0.5} L${-s * 0.5} 0Z" fill="${accent}"/>
        </g>`;
    }
    case "gui": {
      const pw = w * 0.6;
      const ph = h * 0.62;
      const x = cx - pw / 2;
      const y = cy - ph / 2;
      let slots = "";
      const cols = 3;
      const rows = 2;
      const gap = pw * 0.05;
      const sw = (pw - gap * (cols + 1)) / cols;
      const sh = (ph - ph * 0.22 - gap * (rows + 1)) / rows;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          slots += `<rect x="${x + gap + j * (sw + gap)}" y="${y + ph * 0.22 + gap + i * (sh + gap)}" width="${sw}" height="${sh}" rx="${sw * 0.12}" fill="${ink}" opacity="0.5" stroke="${accent}" stroke-opacity="0.4"/>`;
        }
      }
      return `
        <g>
          <rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="${pw * 0.05}" fill="${ink}" opacity="0.45" stroke="${accent}" stroke-opacity="0.5"/>
          <rect x="${x}" y="${y}" width="${pw}" height="${ph * 0.16}" rx="${pw * 0.05}" fill="${accent}" opacity="0.55"/>
          ${slots}
        </g>`;
    }
    case "hud": {
      const bw = w * 0.5;
      const x = cx - bw / 2;
      const mk = (y: number, fill: number, col: string) => `
        <rect x="${x}" y="${y}" width="${bw}" height="${h * 0.07}" rx="${h * 0.035}" fill="${ink}" opacity="0.55"/>
        <rect x="${x}" y="${y}" width="${bw * fill}" height="${h * 0.07}" rx="${h * 0.035}" fill="${col}"/>`;
      return `<g>${mk(cy - h * 0.12, 0.72, accent)}${mk(cy + h * 0.02, 0.46, "#FF6A3D")}</g>`;
    }
    case "thumbnail":
    default: {
      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${h * 0.26}" fill="${accent}" opacity="0.85"/>
          <circle cx="${cx}" cy="${cy}" r="${h * 0.26}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="${w * 0.006}"/>
          <path d="M0 ${h * 0.7} L${w} ${h * 0.45} L${w} ${h} L0 ${h}Z" fill="${ink}" opacity="0.5"/>
          <path d="M0 ${h * 0.8} L${w} ${h * 0.62} L${w} ${h} L0 ${h}Z" fill="${accent}" opacity="0.3"/>
        </g>`;
    }
  }
}

export function placeholderImage(opts: PlaceholderOpts): {
  dataUrl: string;
  width: number;
  height: number;
} {
  const def = ASSET_TYPE_MAP[opts.type];
  const w = def.width;
  const h = def.height;
  const r = rng(hashStr(opts.seedStr + opts.type));

  const palette = opts.palette && opts.palette.length >= 2
    ? opts.palette
    : ["#2A4A7A", "#13131a", "#7C5CFF", "#FF6A3D", "#0E1118"];

  const bgA = pick(palette, r);
  const bgB = "#0B0B0F";
  const accent = pick([palette[2] ?? "#7C5CFF", "#7C5CFF", palette[0] ?? "#8FC9FF"], r);
  const ink = palette[1] ?? "#13131a";
  const rot = Math.floor(r() * 360);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${rot} 0.5 0.5)">
      <stop offset="0" stop-color="${bgA}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${bgB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="${w / 16}" height="${w / 16}" patternUnits="userSpaceOnUse">
      <path d="M ${w / 16} 0 L 0 0 0 ${w / 16}" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${motif(opts.type, w, h, accent, ink, r)}
  <text x="${w - 18}" y="${h - 16}" text-anchor="end" font-family="monospace" font-size="${Math.round(w * 0.018)}" fill="#ffffff" fill-opacity="0.35">artifex · ${def.label.toLowerCase()}</text>
</svg>`;

  return {
    dataUrl: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    width: w,
    height: h,
  };
}
