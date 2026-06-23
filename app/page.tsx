import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Showcase } from "@/components/landing/Showcase";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink-950 text-fg">
      <Hero />
      <Showcase />
      <Features />
      <HowItWorks />
      <SiteFooter />
    </main>
  );
}
