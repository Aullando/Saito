import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/HomePage";
import { hrefLangLinks, organizationJsonLd, softwareJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "SAITO — Gestiona tu club deportivo en una sola plataforma" },
      {
        name: "description",
        content:
          "Plataforma todo-en-uno para clubes deportivos: socios, calendario, pagos, comunicación e IA por rol. IA privada por diseño.",
      },
      { property: "og:title", content: "SAITO — Plataforma para clubes deportivos" },
      {
        property: "og:description",
        content: "Socios, calendario, pagos y comunicación en un solo lugar. IA integrada.",
      },
    ],
    links: hrefLangLinks("/", "es"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationJsonLd()) },
      { type: "application/ld+json", children: JSON.stringify(softwareJsonLd("es")) },
    ],
  }),
  component: () => <HomePage locale="es" />,
});
