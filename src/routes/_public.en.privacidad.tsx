import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/privacidad")({
  head: () => ({
    meta: [
      { title: "Privacy policy — SAITO" },
      { name: "description", content: "How SAITO processes the personal data of visitors, customers and platform users." },
    ],
    links: hrefLangLinks("/privacidad", "en"),
  }),
  component: () => (
    <LegalPage
      locale="en"
      eyebrow="Legal"
      title="Privacy policy"
      updated="May 9, 2026"
      sections={[
        {
          title: "1. Data controller",
          body: [
            "The data controller is SAITO, contact address hola@saito.app. Full company details are available on request.",
          ],
        },
        {
          title: "2. Data we process",
          body: [
            "We process the data you provide via contact, registration and platform usage forms: name, email, phone, club or organisation, role and exchanged communications.",
            "When acting as a data processor for our customers (clubs), we process member and athlete data strictly under their instructions.",
          ],
        },
        {
          title: "3. Purposes and legal basis",
          body: [
            "• Handling sales enquiries and demos (legitimate interest and consent).",
            "• Providing the contracted service (contract performance).",
            "• Compliance with legal obligations (tax, accounting and security).",
            "• Marketing communications, only with your consent.",
          ],
        },
        {
          title: "4. Retention periods",
          body: [
            "We retain data for the duration of the contractual relationship and the legally required periods thereafter. Prospect data is deleted after 24 months of inactivity.",
          ],
        },
        {
          title: "5. Recipients",
          body: [
            "We do not sell data. We rely on technology providers (hosting, email, analytics, AI) acting as data processors under GDPR-compliant agreements. Providers outside the EEA operate under appropriate safeguards (standard contractual clauses).",
          ],
        },
        {
          title: "6. Your rights",
          body: [
            "You can exercise your rights of access, rectification, erasure, objection, restriction and portability at any time by writing to hola@saito.app. You may also lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).",
          ],
        },
      ]}
    />
  ),
});
