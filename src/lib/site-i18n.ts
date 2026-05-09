import { useLocation } from "@tanstack/react-router";

export type Locale = "es" | "en";

export function useLocale(): Locale {
  const { pathname } = useLocation();
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

export function localizedPath(path: string, locale: Locale): string {
  if (locale === "en") {
    if (path === "/") return "/en";
    return `/en${path}`;
  }
  return path;
}

export function switchLocalePath(pathname: string): { es: string; en: string } {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  if (isEn) {
    const es = pathname === "/en" ? "/" : pathname.replace(/^\/en/, "");
    return { es: es || "/", en: pathname };
  }
  const en = pathname === "/" ? "/en" : `/en${pathname}`;
  return { es: pathname, en };
}
