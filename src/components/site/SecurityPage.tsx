import type { Locale } from "@/lib/site-i18n";
import { HeroSection } from "./security/HeroSection";
import { WhyItMattersSection } from "./security/WhyItMattersSection";
import { PrinciplesSection } from "./security/PrinciplesSection";
import { AiSection } from "./security/AiSection";
import { ComplianceSection } from "./security/ComplianceSection";
import { RoadmapSection } from "./security/RoadmapSection";
import { FaqSection } from "./security/FaqSection";
import { ImplementationStatusSection } from "./security/ImplementationStatusSection";
import { CtaSection } from "./security/CtaSection";

export function SecurityPage({ locale }: { locale: Locale }) {
  return (
    <main>
      <HeroSection locale={locale} />
      <WhyItMattersSection locale={locale} />
      <PrinciplesSection locale={locale} />
      <AiSection locale={locale} />
      <ComplianceSection locale={locale} />
      <RoadmapSection locale={locale} />
      <FaqSection locale={locale} />
      <ImplementationStatusSection locale={locale} />
      <CtaSection locale={locale} />
    </main>
  );
}
