import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/site/PricingPage";

export const Route = createFileRoute("/_public/precios")({
  head: () => ({
    meta: [
      { title: "Precios — SAITO" },
      { name: "description", content: "Planes que crecen con tu club. Sin permanencia y con migración asistida." },
      { property: "og:title", content: "Precios — SAITO" },
      { property: "og:description", content: "Planes Club, Pro y Multi-club. Habla con ventas para una propuesta a medida." },
    ],
  }),
  component: () => <PricingPage locale="es" />,
});
