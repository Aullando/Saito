import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/ContactPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — SAITO" },
      { name: "description", content: "Pide una demo de SAITO. Te enseñamos la plataforma con tus datos." },
      { property: "og:title", content: "Contacto — SAITO" },
      { property: "og:description", content: "Pide una demo personalizada para tu club." },
    ],
    links: hrefLangLinks("/contacto", "es"),
  }),
  component: () => <ContactPage locale="es" />,
});
