import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces (near-black → elevated)
        ink: {
          950: "#0B0B0F",
          900: "#0E0E13",
          850: "#13131a",
          800: "#101016",
          700: "#15151c",
          600: "#1a1a22",
        },
        // Hairline borders
        line: {
          DEFAULT: "#23232e",
          soft: "#1d1d26",
          strong: "#2b2b38",
          faint: "#181820",
        },
        // Foreground text ramp
        fg: {
          DEFAULT: "#F4F4F7",
          muted: "#A1A1B0",
          dim: "#9a9aa8",
          faint: "#6f6f7e",
          subtle: "#8B8B9A",
          ghost: "#5C5C6B",
        },
        // Brand violet
        brand: {
          DEFAULT: "#7C5CFF",
          deep: "#534AB7",
          600: "#5e49d6",
          border: "#8a6dff",
          soft: "#b9a6ff",
          softer: "#cdbcff",
        },
        // Forge ember
        ember: "#FF6A3D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 8px 28px rgba(124,92,255,.5), inset 0 1px 0 rgba(255,255,255,.3)",
        "glow-sm": "0 4px 16px rgba(124,92,255,.35)",
        panel: "0 40px 90px rgba(0,0,0,.5)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulse: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 4s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
