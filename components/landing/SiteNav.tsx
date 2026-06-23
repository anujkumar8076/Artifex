import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const LINKS = ["Product", "Platforms", "Pricing", "Docs"];

export function SiteNav() {
  return (
    <nav className="flex h-[74px] items-center justify-between">
      <Logo />
      <div className="flex items-center gap-[30px]">
        <div className="hidden items-center gap-7 text-sm text-fg-muted md:flex">
          {LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="cursor-pointer transition hover:text-fg">
              {l}
            </a>
          ))}
        </div>
        <div className="hidden h-[22px] w-px bg-line-strong md:block" />
        <Link href="/studio" className="hidden text-sm text-fg-muted transition hover:text-fg sm:block">
          Sign in
        </Link>
        <Link href="/studio" className="btn-primary px-[18px] py-[9px] text-sm">
          Start free
        </Link>
      </div>
    </nav>
  );
}
