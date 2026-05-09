import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/site/CustomersPage";

export const Route = createFileRoute("/_public/en/clientes")({
  head: () => ({
    meta: [
      { title: "Customers — SAITO" },
      { name: "description", content: "Clubs and federations that trust SAITO." },
    ],
  }),
  component: () => <CustomersPage locale="en" />,
});
