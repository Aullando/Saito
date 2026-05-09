import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/site/ProductPage";

export const Route = createFileRoute("/_public/en/producto")({
  head: () => ({
    meta: [
      { title: "Product — SAITO" },
      { name: "description", content: "One platform. All your club modules." },
    ],
  }),
  component: () => <ProductPage locale="en" />,
});
