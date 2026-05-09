import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/site/ProductPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/producto")({
  head: () => ({
    meta: [
      { title: "Producto — SAITO" },
      { name: "description", content: "Una plataforma. Todos los módulos del club: socios, calendario, pagos, comunicación, salud, instalaciones e IA." },
      { property: "og:title", content: "Producto — SAITO" },
      { property: "og:description", content: "Una plataforma. Todos los módulos del club." },
    ],
    links: hrefLangLinks("/producto", "es"),
  }),
  component: () => <ProductPage locale="es" />,
});
