import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/HomePage";
import { hrefLangLinks, organizationJsonLd, softwareJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/")({
  head: () => ({
    meta: [
      { title: "SAITO — Run your sports club from a single platform" },
      { name: "description", content: "All-in-one platform for sports clubs: members, calendar, payments, communication and role-based AI. Privacy-by-design AI." },
      { property: "og:title", content: "SAITO — Sports club platform" },
      { property: "og:description", content: "Members, calendar, payments and communication in one place. Built-in AI." },
    ],
    links: hrefLangLinks("/", "en"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationJsonLd()) },
      { type: "application/ld+json", children: JSON.stringify(softwareJsonLd("en")) },
    ],
  }),
  component: () => <HomePage locale="en" />,
});
