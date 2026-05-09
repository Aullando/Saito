import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/site/CustomersPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/clientes")({
  head: () => ({
    meta: [
      { title: "Customers — SAITO" },
      { name: "description", content: "Clubs and federations that trust SAITO." },
    ],
    links: hrefLangLinks("/clientes", "en"),
  }),
  component: () => <CustomersPage locale="en" />,
});
