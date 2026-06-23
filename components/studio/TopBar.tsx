"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { CreditCard, LogOut, Plus } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { useStudio } from "@/lib/store";
import { BuyCreditsModal } from "./BuyCreditsModal";

export function TopBar({ onNewAsset }: { onNewAsset: () => void }) {
  const projects = useStudio((s) => s.projects);
  const activeId = useStudio((s) => s.activeProjectId);
  const credits = useStudio((s) => s.credits);
  const configuredProvider = useStudio((s) => s.configuredProvider);
  const user = useStudio((s) => s.user);
  const authEnabled = useStudio((s) => s.authEnabled);
  const active = projects.find((p) => p.id === activeId);
  const live = configuredProvider && configuredProvider !== "mock";

  const [menuOpen, setMenuOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  const initial = (user?.name || user?.email || "M").charAt(0).toUpperCase();

  return (
    <header className="flex h-14 flex-none items-center justify-between border-b border-line-soft bg-ink-800 px-4">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Home">
          <LogoMark size={28} />
        </Link>
        <div className="flex items-center gap-[7px] text-[13px] text-fg-subtle">
          <span className="font-medium text-[#cfcfda]">{active?.name ?? "Project"}</span>
          <span className="text-[#3a3a47]">/</span>
          <span className="hidden sm:inline">Boss assets</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {configuredProvider && (
          <span
            className="hidden items-center gap-[6px] rounded-full border px-[10px] py-[5px] text-[11px] font-medium sm:inline-flex"
            style={
              live
                ? { borderColor: "rgba(124,92,255,.3)", background: "rgba(124,92,255,.12)", color: "#b9a6ff" }
                : { borderColor: "#262630", background: "#101016", color: "#9a9aa8" }
            }
            title={live ? `Live generation · ${configuredProvider}` : "Demo mode · procedural previews (set an API key for live generation)"}
          >
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: live ? "#7C5CFF" : "#5C5C6B", boxShadow: live ? "0 0 8px #7C5CFF" : "none" }}
            />
            {live ? "Live" : "Demo mode"}
          </span>
        )}

        <button
          onClick={() => setBuyOpen(true)}
          title="Buy more credits"
          className="flex items-center gap-2 rounded-[9px] border border-line bg-ink-850 px-3 py-[6px] transition hover:border-line-strong"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" stroke="#FF6A3D" strokeWidth="1.6" />
          </svg>
          <span className="text-[13px] font-semibold text-[#cfcfda]">{credits.toLocaleString()}</span>
          <span className="hidden text-[12px] text-fg-faint sm:inline">credits</span>
        </button>

        <button onClick={onNewAsset} className="btn-primary px-[14px] py-2 text-[13px]">
          <Plus size={13} />
          <span className="hidden sm:inline">New asset</span>
        </button>

        {/* account */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Account"
              className="grid h-[30px] w-[30px] place-items-center overflow-hidden rounded-full text-[12px] font-bold text-white"
              style={{ backgroundImage: "linear-gradient(150deg,#FF6A3D,#7C5CFF)" }}
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-[38px] z-50 w-[208px] overflow-hidden rounded-xl border border-line bg-ink-850 py-1 shadow-panel">
                  <div className="border-b border-line-soft px-3 py-2">
                    <div className="truncate text-[13px] font-medium text-fg">{user.name ?? "Signed in"}</div>
                    <div className="truncate text-[11.5px] text-fg-faint">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setBuyOpen(true);
                    }}
                    className="flex w-full items-center gap-[10px] px-3 py-2 text-[13px] text-fg-dim transition hover:bg-ink-700 hover:text-fg"
                  >
                    <CreditCard size={15} /> Buy credits
                  </button>
                  <button
                    onClick={() => void signOut()}
                    className="flex w-full items-center gap-[10px] px-3 py-2 text-[13px] text-fg-dim transition hover:bg-ink-700 hover:text-fg"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : authEnabled ? (
          <button onClick={() => void signIn("github")} className="btn-ghost px-[14px] py-2 text-[13px]">
            Sign in
          </button>
        ) : (
          <div
            className="grid h-[30px] w-[30px] place-items-center rounded-full text-[12px] font-bold text-white"
            style={{ backgroundImage: "linear-gradient(150deg,#FF6A3D,#7C5CFF)" }}
            title="Demo mode — configure auth to enable accounts"
          >
            M
          </div>
        )}
      </div>

      {buyOpen && <BuyCreditsModal onClose={() => setBuyOpen(false)} />}
    </header>
  );
}
