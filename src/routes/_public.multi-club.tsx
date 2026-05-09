import { createFileRoute } from "@tanstack/react-router";
import { MultiClubPage } from "@/components/site/MultiClubPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/multi-club")({
  head: () => ({
    meta: [
      { title: "Multi-club — SAITO" },
      { name: "description", content: "Para clubes históricos y entidades polideportivas con varias sedes y secciones." },
      { property: "og:title", content: "Multi-club — SAITO" },
      { property: "og:description", content: "Gobierno central, autonomía por sección y datos consolidados." },
    ],
    links: hrefLangLinks("/multi-club", "es"),
  }),
  component: () => <MultiClubPage locale="es" />,
});
