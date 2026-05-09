import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoFrase from "@/assets/brand/saito-logo-frase.png";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "./LangSwitcher";
import { useLocale, localizedPath } from "@/lib/site-i18n";
import { useAuth } from "@/lib/auth";

const navEs = [
  { to: "/producto", label: "Producto" },
  { to: "/ia", label: "IA" },
  { to: "/multi-club", label: "Multi-club" },
  { to: "/precios", label: "Precios" },
  { to: "/clientes", label: "Clientes" },
];
const navEn = [
  { to: "/producto", label: "Product" },
  { to: "/ia", label: "AI" },
  { to: "/multi-club", label: "Multi-club" },
  { to: "/precios", label: "Pricing" },
  { to: "/clientes", label: "Customers" },
];

export function Header() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const items = locale === "en" ? navEn : navEs;
  const cta = locale === "en" ? "Book a demo" : "Pide una demo";
  const { session } = useAuth();
  const panelLabel = locale === "en" ? "Go to panel" : "Ir al panel";
  const loginLabel = locale === "en" ? "Log in" : "Entrar";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={localizedPath("/", locale) as any} className="flex items-center gap-2">
          <img src={logoFrase} alt="SAITO — powered by Gemini" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((it) => (
            <Link
              key={it.to}
              to={localizedPath(it.to, locale) as any}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-foreground bg-accent" }}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitcher />
          {session ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link to="/dashboard">{panelLabel}</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="rounded-full px-4">
              <Link to="/login">{loginLabel}</Link>
            </Button>
          )}
          <Button asChild className="rounded-full px-5">
            <Link to={localizedPath("/contacto", locale) as any}>{cta}</Link>
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {items.map((it) => (
              <Link
                key={it.to}
                to={localizedPath(it.to, locale) as any}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              >
                {it.label}
              </Link>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
              <LangSwitcher />
              <div className="flex items-center gap-2">
                {session ? (
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>{panelLabel}</Link>
                  </Button>
                ) : (
                  <Button asChild variant="ghost" className="rounded-full">
                    <Link to="/login" onClick={() => setOpen(false)}>{loginLabel}</Link>
                  </Button>
                )}
                <Button asChild className="rounded-full">
                  <Link to={localizedPath("/contacto", locale) as any} onClick={() => setOpen(false)}>
                    {cta}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
