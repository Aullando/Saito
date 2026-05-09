import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/site/CustomersPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — SAITO" },
      { name: "description", content: "Clubes y entidades polideportivas que confían en SAITO." },
      { property: "og:title", content: "Clientes — SAITO" },
      { property: "og:description", content: "Casos reales de clubes que dejaron las hojas de cálculo." },
    ],
    links: hrefLangLinks("/clientes", "es"),
  }),
  component: () => <CustomersPage locale="es" />,
});
