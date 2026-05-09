import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/site/PricingPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/precios")({
  head: () => ({
    meta: [
      { title: "Pricing — SAITO" },
      { name: "description", content: "Plans that grow with your club." },
    ],
    links: hrefLangLinks("/precios", "en"),
  }),
  component: () => <PricingPage locale="en" />,
});
