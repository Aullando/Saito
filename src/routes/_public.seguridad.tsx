import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/components/site/SecurityPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/seguridad")({
  head: () => ({
    meta: [
      { title: "Seguridad y privacidad — SAITO" },
      {
        name: "description",
        content:
          "Cómo SAITO protege datos de jugadores, familias y equipos: control de acceso por rol, cifrado, trazabilidad e IA privada por diseño.",
      },
      { property: "og:title", content: "Seguridad y privacidad — SAITO" },
      {
        property: "og:description",
        content: "Privacidad y seguridad diseñadas para clubes deportivos.",
      },
    ],
    links: hrefLangLinks("/seguridad", "es"),
  }),
  component: () => <SecurityPage locale="es" />,
});
