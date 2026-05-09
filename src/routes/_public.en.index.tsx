import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/HomePage";

export const Route = createFileRoute("/_public/en/")({
  head: () => ({
    meta: [
      { title: "SAITO — Run your sports club from a single platform" },
      { name: "description", content: "All-in-one platform for sports clubs: members, calendar, payments, communication and role-based AI. Powered by Gemini." },
      { property: "og:title", content: "SAITO — Sports club platform" },
      { property: "og:description", content: "Members, calendar, payments and communication in one place. Powered by Gemini." },
    ],
  }),
  component: () => <HomePage locale="en" />,
});
