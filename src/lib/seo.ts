// Centralised SEO helpers for the public site.
// Canonical and hreflang links keep ES/EN variants in sync for crawlers.

export const SITE_URL = "https://saitopilot.lovable.app";

/**
 * Given an ES path like "/precios", return canonical + hreflang links
 * for both the ES and EN variants. Pass "/" for the home.
 */
export function hrefLangLinks(esPath: string, locale: "es" | "en") {
  const es = esPath === "/" ? "/" : esPath;
  const en = esPath === "/" ? "/en/" : `/en${esPath}`;
  const current = locale === "en" ? en : es;
  return [
    { rel: "canonical", href: `${SITE_URL}${current}` },
    { rel: "alternate", hrefLang: "es", href: `${SITE_URL}${es}` },
    { rel: "alternate", hrefLang: "en", href: `${SITE_URL}${en}` },
    { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${es}` },
  ];
}

/** JSON-LD for the Organization (used on home pages). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SAITO",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hola@saito.app",
        contactType: "sales",
        availableLanguage: ["es", "en"],
      },
    ],
  };
}

/** JSON-LD for the SaaS product (used on home pages). */
export function softwareJsonLd(locale: "es" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SAITO",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      locale === "en"
        ? "All-in-one platform for sports clubs: members, calendar, payments, communication and role-based AI."
        : "Plataforma todo-en-uno para clubes deportivos: socios, calendario, pagos, comunicación e IA por rol.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };
}
