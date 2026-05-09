import { Link } from "@tanstack/react-router";
import logoBlanco from "@/assets/brand/saito-logo-frase-blanco.png";
import { useLocale, localizedPath } from "@/lib/site-i18n";

export function Footer() {
  const locale = useLocale();
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const links = [
    { to: "/producto", label: t("Producto", "Product") },
    { to: "/ia", label: t("IA", "AI") },
    { to: "/multi-club", label: t("Multi-club", "Multi-club") },
    { to: "/clientes", label: t("Clientes", "Customers") },
    { to: "/seguridad", label: t("Seguridad", "Security") },
    { to: "/precios", label: t("Precios", "Pricing") },
    { to: "/contacto", label: t("Contacto", "Contact") },
  ];

  return (
    <footer className="bg-saito-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <img src={logoBlanco} alt="SAITO — Sport AI Training Optimisation" className="h-9 w-auto" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Sport AI Training Optimisation
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/70">
              {t(
                "La plataforma de gestión todo-en-uno para clubes deportivos. IA integrada y privada por diseño.",
                "The all-in-one management platform for sports clubs. Built-in, privacy-by-design AI.",
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("Navegación", "Navigation")}
            </h4>
            <ul className="mt-4 space-y-2">
              {links.map((l) => (
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
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SAITO. {t("Todos los derechos reservados.", "All rights reserved.")}</p>
          <div className="flex items-center gap-4">
            <Link to={localizedPath("/aviso-legal", locale) as any} className="text-white/70 transition-colors hover:text-white">
              {t("Aviso legal", "Legal notice")}
            </Link>
            <Link to={localizedPath("/privacidad", locale) as any} className="text-white/70 transition-colors hover:text-white">
              {t("Privacidad", "Privacy")}
            </Link>
            <Link to={localizedPath("/cookies", locale) as any} className="text-white/70 transition-colors hover:text-white">
              {t("Cookies", "Cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
