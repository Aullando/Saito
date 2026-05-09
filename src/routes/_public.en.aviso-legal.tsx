import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Legal notice — SAITO" },
      { name: "description", content: "Legal information and identifying details of the SAITO service provider." },
    ],
    links: hrefLangLinks("/aviso-legal", "en"),
  }),
  component: () => (
    <LegalPage
      locale="en"
      eyebrow="Legal"
      title="Legal notice"
      updated="May 9, 2026"
      sections={[
        {
          title: "1. Provider information",
          body: [
            "In compliance with Spanish Law 34/2002 (LSSI-CE), this page provides identifying information about the operator of saito.app (“SAITO”).",
            "Full company details are available on request at hola@saito.app.",
          ],
        },
        {
          title: "2. Purpose",
          body: [
            "This notice regulates the use of the website and the SAITO platform, a SaaS management solution for sports clubs. Browsing the website is free; access to the platform requires a contract and, where applicable, a subscription.",
          ],
        },
        {
          title: "3. Intellectual property",
          body: [
            "All content (text, trademarks, logos, code, interface and design) belongs to SAITO or its licensors. Reproduction without express authorisation is prohibited.",
          ],
        },
        {
          title: "4. Liability",
          body: [
            "SAITO is not liable for damages resulting from improper use of the website or temporary unavailability caused by circumstances beyond its control.",
          ],
        },
        {
          title: "5. Applicable law",
          body: [
            "This notice is governed by Spanish law. Any dispute will be submitted to the courts of the provider's domicile, unless mandatory law dictates a different jurisdiction.",
          ],
        },
      ]}
    />
  ),
});
