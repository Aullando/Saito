import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/site/ProductPage";

export const Route = createFileRoute("/_public/producto")({
  head: () => ({
    meta: [
      { title: "Producto — SAITO" },
      { name: "description", content: "Una plataforma. Todos los módulos del club: socios, calendario, pagos, comunicación, salud, instalaciones e IA." },
      { property: "og:title", content: "Producto — SAITO" },
      { property: "og:description", content: "Una plataforma. Todos los módulos del club." },
    ],
  }),
  component: () => <ProductPage locale="es" />,
});
