import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artifex — Conjure any game asset from a single prompt",
  description:
    "Artifex is an AI design platform for game developers. Generate thumbnails, icons, GUIs, 3D models and characters — all visually consistent — and export to Roblox, UEFN, Minecraft, Unity, Unreal and Blender.",
  metadataBase: new URL("https://artifex.local"),
  openGraph: {
    title: "Artifex — Conjure any game asset from a single prompt",
    description:
      "An AI design platform for game developers. One prompt, a whole consistent asset set, exported to every engine.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
