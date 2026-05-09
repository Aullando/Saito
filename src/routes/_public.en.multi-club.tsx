import { createFileRoute } from "@tanstack/react-router";
import { MultiClubPage } from "@/components/site/MultiClubPage";

export const Route = createFileRoute("/_public/en/multi-club")({
  head: () => ({
    meta: [
      { title: "Multi-club — SAITO" },
      { name: "description", content: "For historic clubs and multi-sport organisations." },
    ],
  }),
  component: () => <MultiClubPage locale="en" />,
});
