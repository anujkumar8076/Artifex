"use client";

import { useCallback, useEffect, useState } from "react";
import { AssetDetail } from "@/components/studio/AssetDetail";
import { BrandDnaModal } from "@/components/studio/BrandDnaModal";
import { Composer } from "@/components/studio/Composer";
import { Gallery } from "@/components/studio/Gallery";
import { LeftRail } from "@/components/studio/LeftRail";
import { Toast } from "@/components/studio/Toast";
import { TopBar } from "@/components/studio/TopBar";
import { useStudio } from "@/lib/store";

export default function StudioPage() {
  const [dnaOpen, setDnaOpen] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const error = useStudio((s) => s.error);
  const clearError = useStudio((s) => s.clearError);
  const selectAsset = useStudio((s) => s.selectAsset);
  const loadProvider = useStudio((s) => s.loadProvider);

  useEffect(() => {
    void loadProvider();
  }, [loadProvider]);

  const focusComposer = useCallback(() => {
    document.getElementById("composer-input")?.focus();
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col bg-ink-950 text-fg">
      <TopBar onNewAsset={focusComposer} />

      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[236px_1fr]">
        <LeftRail onOpenDna={() => setDnaOpen(true)} />
        <div className="grid grid-rows-[auto_1fr] overflow-hidden">
          <Composer />
          <Gallery onOpenAsset={(id) => selectAsset(id)} />
        </div>
      </div>

      <AssetDetail onToast={setInfo} />
      {dnaOpen && <BrandDnaModal onClose={() => setDnaOpen(false)} />}

      {info && <Toast message={info} tone="info" onClose={() => setInfo(null)} />}
      {error && <Toast message={error} tone="error" onClose={clearError} />}
    </div>
  );
}
