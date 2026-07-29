import { useState, useRef, useEffect } from "react";
import { Search, Menu, ChevronDown, X, RotateCcw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUser, useUserAvatar, useAuth } from "@/lib/store";
import { DEMO_USERS } from "@/lib/seed";
import { Logo, LogoMark } from "./Logo";
import { NotificationsBell } from "./NotificationsBell";
import { ResetDemoDialog } from "./ResetDemoDialog";
// import { ClubSwitcher } from "./ClubSwitcher"; // re-mount here to reactivate multi-club demo

import { useClub } from "@/clubs/ClubProvider";

import { cn } from "@/lib/utils";

// Perfiles SAITO expuestos en el selector de rol de la demo.
const SAITO_ROLE_IDS = new Set(["u-mgr", "u-adm", "u-med", "u-tec", "u-ath"]);

const ROLE_LABEL: Record<string, { es: string; en: string; sr: string }> = {
  sysadmin: { es: "SysAdmin", en: "SysAdmin", sr: "SysAdmin" },
  admin: { es: "Administración", en: "Admin", sr: "Administracija" },
  manager: { es: "Dirección", en: "Manager", sr: "Direkcija" },
  technical: { es: "Entrenador", en: "Coach", sr: "Trener" },
  medical: { es: "Staff médico", en: "Medical staff", sr: "Medicinsko osoblje" },
  athlete: { es: "Deportista", en: "Athlete", sr: "Sportista" },
};

export function Topbar() {
  const user = useCurrentUser();
  
  const avatar = useUserAvatar(user?.id ?? "");
  const setMobileNavOpen = useAuth((s) => s.setMobileNavOpen);
  const setUser = useAuth((s) => s.setUser);
  const navigate = useNavigate();
  const roleLabel = (role: string) =>
    ROLE_LABEL[role]?.[user?.language ?? "en"] ?? role;
  const collapsed = useAuth((s) => s.sidebarCollapsed);
  const setLangOverride = useAuth((s) => s.setLangOverride);
  const { club } = useClub();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;
  const isGff = club.id === "gff-demo";
  const lang = user.language;
  return (
    <header
      className="fixed right-0 left-0 z-30 flex h-14 md:h-[72px] items-center gap-1.5 sm:gap-2 md:gap-4 px-2 sm:px-3 md:px-6"
      style={{
        top: "var(--demo-bar-h, 0px)",
        background: "#F7F9FC",
        borderBottom: "1px solid #DDE6F0",
      }}
    >
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div
        className="hidden md:flex shrink-0 items-center transition-[width] duration-200"
        style={{ width: collapsed ? 72 : 264, paddingLeft: 24 }}
      >
        <Logo size={collapsed ? 32 : 40} withText={!collapsed} />
      </div>
      <div className="flex md:hidden items-center shrink-0 pl-1">
        <Logo size={40} withText />
      </div>

      {/* Desktop / tablet search */}
      <div className="hidden sm:flex flex-1 justify-center min-w-0">
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={
              lang === "es"
                ? `Buscar en ${club.brand.name}`
                : lang === "sr"
                  ? `Pretraga u ${club.brand.name}`
                  : `Search ${club.brand.name}`
            }
            className="h-9 md:h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      {/* Mobile spacer pushes actions right */}
      <div className="flex sm:hidden flex-1" />

      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="flex sm:hidden h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <NotificationsBell />
        {/* Multi-club switcher: re-mount <ClubSwitcher /> here if more than one club is visible */}

        {/* ES / EN language toggle (hidden inside the GFF Arabic workspace) */}
        {!isGff && (
          <div
            className="hidden sm:inline-flex items-center rounded-full border border-border bg-card p-0.5 text-[11px] font-semibold shadow-sm"
            role="group"
            aria-label="Language"
          >
            {(["es", "en", "sr"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLangOverride(code)}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  lang === code
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={lang === code}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-card pl-1 pr-1.5 sm:pr-2 py-1 shadow-sm hover:bg-muted"
            aria-label="Switch role"
          >
            <span
              className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full p-[2px]"
              style={{
                background:
                  "conic-gradient(from 0deg, #F12F4A, #FDB113, #00A74D, #0067C9, #8A2BE2, #F12F4A)",
              }}
            >
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-card text-[11px] font-bold text-foreground">
                {avatar ? (
                  <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.initials
                )}
              </span>
            </span>
            <span className="hidden md:inline text-xs font-medium">
              {roleLabel(user.role)}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {lang === "es" ? "Cambiar de rol" : lang === "sr" ? "Promeni ulogu" : "Switch role"}
              </div>
              <ul className="max-h-80 overflow-y-auto pb-1">
                {DEMO_USERS.filter((u) => SAITO_ROLE_IDS.has(u.id)).map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => {
                        setUser(u.id);
                        setOpen(false);
                        // Perfiles de superficie móvil aterrizan en /mobile
                        if (u.role === "athlete" || u.role === "technical") {
                          navigate({ to: "/mobile" });
                        } else {
                          navigate({ to: "/dashboard" });
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted",
                        u.id === user.id && "bg-primary/10",
                      )}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                        {u.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{u.name}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {roleLabel(u.role)} · {u.language.toUpperCase()}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border p-2">
                <ResetDemoDialog
                  trigger={
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {lang === "es"
                        ? "Reiniciar demo"
                        : lang === "sr"
                          ? "Resetuj demo"
                          : "Reset demo"}
                    </button>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {searchOpen && (
        <div className="absolute inset-x-0 top-full sm:hidden border-b border-border bg-background/95 backdrop-blur px-3 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              placeholder={
                user.language === "es"
                  ? `Buscar en ${club.brand.name}`
                  : user.language === "sr"
                    ? `Pretraga u ${club.brand.name}`
                    : `Search ${club.brand.name}`
              }
              className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
