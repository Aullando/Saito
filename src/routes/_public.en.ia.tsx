import { createFileRoute } from "@tanstack/react-router";
import { AIPage } from "@/components/site/AIPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/ia")({
  head: () => ({
    meta: [
      { title: "Smart Copilot — SAITO" },
      {
        name: "description",
        content: "An AI that understands how a club works. SAITO AI, privacy by design.",
      },
    ],
    links: hrefLangLinks("/ia", "en"),
  }),
  component: () => <AIPage locale="en" />,
});
