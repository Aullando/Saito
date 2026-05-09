import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/en/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie policy — SAITO" },
      {
        name: "description",
        content: "Information about the cookies used on the SAITO site and how to manage them.",
      },
    ],
    links: hrefLangLinks("/cookies", "en"),
  }),
  component: () => (
    <LegalPage
      locale="en"
      eyebrow="Legal"
      title="Cookie policy"
      updated="May 9, 2026"
      sections={[
        {
          title: "1. What are cookies?",
          body: [
            "Cookies are small files that a website stores in your browser to remember information about your visit, improve the experience or measure site usage.",
          ],
        },
        {
          title: "2. Cookies we use",
          body: [
            "• Technical: required for the site to work (session, language, theme preference). No consent needed.",
            "• Analytics: help us understand aggregated usage. Loaded only with your consent.",
            "• Third-party: if we add embedded videos, maps or advertising pixels in the future, we will inform you and request prior consent.",
          ],
        },
        {
          title: "3. Managing and revoking",
          body: [
            "You can accept, reject or configure cookies from the consent banner. You can also delete them at any time from your browser settings.",
          ],
        },
        {
          title: "4. More information",
          body: ["For any cookie or privacy enquiry, please write to hola@saito.app."],
        },
      ]}
    />
  ),
});
