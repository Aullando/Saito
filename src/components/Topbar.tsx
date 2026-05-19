import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Search, Menu, ChevronDown, X } from "lucide-react";
import { useCurrentUser, useUserAvatar, useAuth } from "@/lib/store";
import { DEMO_USERS } from "@/lib/seed";
import { Logo, LogoMark } from "./Logo";
import saitoLogo from "@/assets/brand/saito-logo.png";
import { NotificationsBell } from "./NotificationsBell";
import { ClubSwitcher } from "./ClubSwitcher";
import { useTheme } from "@/lib/theme";
import { useClub } from "@/clubs/ClubProvider";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  sysadmin: "SysAdmin",
  admin: "Admin",
  manager: "Manager",
  technical: "Technical",
  medical: "Medical",
  athlete: "Atleta",
};

export function Topbar() {
  const user = useCurrentUser();
  const { theme, toggle } = useTheme();
  const avatar = useUserAvatar(user?.id ?? "");
  const setMobileNavOpen = useAuth((s) => s.setMobileNavOpen);
  const setUser = useAuth((s) => s.setUser);
  const collapsed = useAuth((s) => s.sidebarCollapsed);
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
      <div className="flex md:hidden items-center shrink-0">
        <img
          src={saitoLogo}
          alt="SAITO"
          style={{ height: 40 }}
          className="shrink-0 object-contain"
        />
      </div>

      {/* Desktop / tablet search */}
      <div className="hidden sm:flex flex-1 justify-center min-w-0">
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={
              user.language === "es" ? `Buscar en ${club.brand.name}` : `Search ${club.brand.name}`
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
        <button
          onClick={toggle}
          className="hidden sm:flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <NotificationsBell />
        <ClubSwitcher />

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-card pl-1 pr-1.5 sm:pr-2 py-1 shadow-sm hover:bg-muted"
            aria-label="Switch role"
          >
            <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {avatar ? (
                <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.initials
              )}
            </span>
            <span className="hidden md:inline text-xs font-medium">
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {user.language === "es" ? "Cambiar de rol" : "Switch role"}
              </div>
              <ul className="max-h-80 overflow-y-auto pb-1">
                {DEMO_USERS.filter((u) => ROLE_LABEL[u.role]).map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => {
                        setUser(u.id);
                        setOpen(false);
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
                          {ROLE_LABEL[u.role]} · {u.language.toUpperCase()}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
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
