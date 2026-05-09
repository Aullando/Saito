import { createFileRoute } from "@tanstack/react-router";
import { AIPage } from "@/components/site/AIPage";

export const Route = createFileRoute("/_public/ia")({
  head: () => ({
    meta: [
      { title: "IA por rol — SAITO" },
      { name: "description", content: "Una IA que entiende cómo funciona un club. Powered by Gemini." },
      { property: "og:title", content: "IA por rol — SAITO" },
      { property: "og:description", content: "Respuestas accionables a cada rol del club." },
    ],
  }),
  component: () => <AIPage locale="es" />,
});
