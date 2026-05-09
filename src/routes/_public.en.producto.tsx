import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/site/ProductPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/producto")({
  head: () => ({
    meta: [
      { title: "Product — SAITO" },
      { name: "description", content: "One platform. All your club modules." },
    ],
    links: hrefLangLinks("/producto", "en"),
  }),
  component: () => <ProductPage locale="en" />,
});
