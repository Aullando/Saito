import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoFrase from "@/assets/brand/saito-logo-frase.png";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "./LangSwitcher";
import { useLocale, localizedPath } from "@/lib/site-i18n";
import { useAuth } from "@/lib/auth";

const navEs = [
  { to: "/", label: "Inicio" },
  { to: "/producto", label: "Producto" },
  { to: "/ia", label: "IA" },
  { to: "/multi-club", label: "Multi-club" },
  { to: "/clientes", label: "Clientes" },
  { to: "/seguridad", label: "Seguridad" },
  { to: "/precios", label: "Precios" },
  { to: "/contacto", label: "Contacto" },
];
const navEn = [
  { to: "/", label: "Home" },
  { to: "/producto", label: "Product" },
  { to: "/ia", label: "AI" },
  { to: "/multi-club", label: "Multi-club" },
  { to: "/clientes", label: "Customers" },
  { to: "/seguridad", label: "Security" },
  { to: "/precios", label: "Pricing" },
  { to: "/contacto", label: "Contact" },
];

export function Header() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const items = locale === "en" ? navEn : navEs;
  const cta = locale === "en" ? "Book a demo" : "Solicitar demo";
  const { session } = useAuth();
  const panelLabel = locale === "en" ? "Go to panel" : "Ir al panel";
  const loginLabel = locale === "en" ? "Log in" : "Entrar";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={localizedPath("/", locale) as unknown as never}
          className="flex items-center gap-2"
        >
          <img
            src={logoFrase}
            alt="SAITO — gestión inteligente para clubes deportivos"
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((it) => (
            <Link
              key={it.to}
              to={localizedPath(it.to, locale) as unknown as never}
              activeOptions={it.to === "/" ? { exact: true } : undefined}
              className="story-link rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className:
                  "story-link rounded-md px-3 py-2 text-sm font-semibold text-foreground",
              }}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitcher />
          {session ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link to="/login">{panelLabel}</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="rounded-full px-4">
              <Link to="/login">{loginLabel}</Link>
            </Button>
          )}
          <Button asChild className="rounded-full px-5">
            <Link to={localizedPath("/contacto", locale) as unknown as never}>{cta}</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-4 pb-[env(safe-area-inset-bottom)] pt-3">
            {items.map((it) => (
              <Link
                key={it.to}
                to={localizedPath(it.to, locale) as unknown as never}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-accent active:bg-accent"
                activeProps={{
                  className:
                    "block rounded-lg px-3 py-3 text-base font-semibold text-primary bg-accent",
                }}
                activeOptions={it.to === "/" ? { exact: true } : undefined}
              >
                {it.label}
              </Link>
            ))}
            <div className="flex items-center justify-between gap-2 pt-4">
              <LangSwitcher />
              {session && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    {panelLabel}
                  </Link>
                </Button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {!session && (
                <Button asChild variant="outline" className="h-11 w-full rounded-full">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    {loginLabel}
                  </Link>
                </Button>
              )}
              <Button asChild className="h-11 w-full rounded-full">
                <Link
                  to={localizedPath("/contacto", locale) as unknown as never}
                  onClick={() => setOpen(false)}
                >
                  {cta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
