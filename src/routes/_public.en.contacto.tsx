import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/ContactPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/contacto")({
  head: () => ({
    meta: [
      { title: "Contact — SAITO" },
      { name: "description", content: "Book a SAITO demo with your own data." },
    ],
    links: hrefLangLinks("/contacto", "en"),
  }),
  component: () => <ContactPage locale="en" />,
});
