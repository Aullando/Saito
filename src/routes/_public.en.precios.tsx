import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/site/PricingPage";

export const Route = createFileRoute("/_public/en/precios")({
  head: () => ({
    meta: [
      { title: "Pricing — SAITO" },
      { name: "description", content: "Plans that grow with your club." },
    ],
  }),
  component: () => <PricingPage locale="en" />,
});
