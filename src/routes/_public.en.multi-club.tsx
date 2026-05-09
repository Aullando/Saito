import { createFileRoute } from "@tanstack/react-router";
import { MultiClubPage } from "@/components/site/MultiClubPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/multi-club")({
  head: () => ({
    meta: [
      { title: "Multi-club — SAITO" },
      { name: "description", content: "For historic clubs and multi-sport organisations." },
    ],
    links: hrefLangLinks("/multi-club", "en"),
  }),
  component: () => <MultiClubPage locale="en" />,
});
