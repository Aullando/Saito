import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/ContactPage";

export const Route = createFileRoute("/_public/en/contacto")({
  head: () => ({
    meta: [
      { title: "Contact — SAITO" },
      { name: "description", content: "Book a SAITO demo with your own data." },
    ],
  }),
  component: () => <ContactPage locale="en" />,
});
