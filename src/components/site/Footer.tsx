import { Link } from "@tanstack/react-router";
import logoBlanco from "@/assets/brand/saito-logo-frase-blanco.png";
import { useLocale, localizedPath } from "@/lib/site-i18n";

export function Footer() {
  const locale = useLocale();
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const cols = [
    {
      title: t("Producto", "Product"),
      links: [
        { to: "/producto", label: t("Funcionalidades", "Features") },
        { to: "/ia", label: t("IA por rol", "AI by role") },
        { to: "/multi-club", label: t("Multi-club", "Multi-club") },
        { to: "/precios", label: t("Precios", "Pricing") },
      ],
    },
    {
      title: t("Empresa", "Company"),
      links: [
        { to: "/clientes", label: t("Clientes", "Customers") },
        { to: "/contacto", label: t("Contacto", "Contact") },
      ],
    },
  ];

  return (
    <footer className="bg-saito-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src={logoBlanco} alt="SAITO" className="h-9 w-auto" />
            <p className="mt-4 max-w-sm text-sm text-white/70">
              {t(
                "La plataforma de gestión todo-en-uno para clubes deportivos. Powered by Gemini.",
                "The all-in-one management platform for sports clubs. Powered by Gemini.",
              )}
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">{c.title}</h4>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={localizedPath(l.to, locale) as any}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SAITO. {t("Todos los derechos reservados.", "All rights reserved.")}</p>
          <p>{t("Hecho para clubes que crecen.", "Built for clubs that grow.")}</p>
        </div>
      </div>
    </footer>
  );
}
