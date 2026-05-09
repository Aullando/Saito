import { useLocation } from "@tanstack/react-router";

export type Locale = "es" | "en";

// The EN home route is registered as "/en/" (trailing slash) by the file-based
// router, so we ALWAYS generate "/en/" for the EN home and detect both
// "/en" and "/en/" as English to keep the experience stable.

export function useLocale(): Locale {
  const { pathname } = useLocation();
  return pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/") ? "en" : "es";
}

export function localizedPath(path: string, locale: Locale): string {
  if (locale === "en") {
    if (path === "/") return "/en/";
    return `/en${path}`;
  }
  return path;
}

export function switchLocalePath(pathname: string): { es: string; en: string } {
  const isEn = pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/");
  if (isEn) {
    if (pathname === "/en" || pathname === "/en/") return { es: "/", en: "/en/" };
    const es = pathname.replace(/^\/en/, "");
    return { es: es || "/", en: pathname };
  }
  const en = pathname === "/" ? "/en/" : `/en${pathname}`;
  return { es: pathname, en };
}
