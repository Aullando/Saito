import { createFileRoute } from "@tanstack/react-router";
import { AIPage } from "@/components/site/AIPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/ia")({
  head: () => ({
    meta: [
      { title: "IA por rol — SAITO" },
      { name: "description", content: "Una IA que entiende cómo funciona un club. SAITO AI, privada por diseño." },
      { property: "og:title", content: "IA por rol — SAITO" },
      { property: "og:description", content: "Respuestas accionables a cada rol del club." },
    ],
    links: hrefLangLinks("/ia", "es"),
  }),
  component: () => <AIPage locale="es" />,
});
