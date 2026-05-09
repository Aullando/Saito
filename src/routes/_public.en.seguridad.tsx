import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/components/site/SecurityPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/seguridad")({
  head: () => ({
    meta: [
      { title: "Security & privacy — SAITO" },
      {
        name: "description",
        content:
          "How SAITO protects data on players, families and teams: role-based access, encryption, traceability and privacy-by-design AI.",
      },
      { property: "og:title", content: "Security & privacy — SAITO" },
      { property: "og:description", content: "Privacy and security built for sports clubs." },
    ],
    links: hrefLangLinks("/seguridad", "en"),
  }),
  component: () => <SecurityPage locale="en" />,
});
