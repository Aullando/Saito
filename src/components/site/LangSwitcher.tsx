import { Link, useLocation } from "@tanstack/react-router";
import { switchLocalePath, useLocale } from "@/lib/site-i18n";

export function LangSwitcher() {
  const { pathname } = useLocation();
  const locale = useLocale();
  const paths = switchLocalePath(pathname);

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-semibold">
      <Link
        to={paths.es as any}
        className={`rounded-full px-3 py-1 transition-colors ${
          locale === "es" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        ES
      </Link>
      <Link
        to={paths.en as any}
        className={`rounded-full px-3 py-1 transition-colors ${
          locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
