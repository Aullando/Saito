import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Search, Menu, ChevronDown } from "lucide-react";
import { useCurrentUser, useUserAvatar, useAuth } from "@/lib/store";
import { DEMO_USERS } from "@/lib/seed";
import { Logo } from "./Logo";
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
};

export function Topbar() {
  const user = useCurrentUser();
  const { theme, toggle } = useTheme();
  const avatar = useUserAvatar(user?.id ?? "");
  const setMobileNavOpen = useAuth((s) => s.setMobileNavOpen);
  const setUser = useAuth((s) => s.setUser);
  const { club } = useClub();
  const [open, setOpen] = useState(false);
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
    <header className="fixed top-0 right-0 left-0 z-30 flex h-14 md:h-16 items-center gap-2 md:gap-4 border-b border-border bg-background/90 px-3 backdrop-blur md:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex md:w-[208px] shrink-0 items-center">
        <Logo size={28} />
      </div>
      <div className="flex flex-1 justify-center min-w-0">
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={user.language === "es" ? `Buscar en ${club.name}` : `Search in ${club.name}`}
            className="h-9 md:h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
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
            className="flex items-center gap-1.5 rounded-full bg-card pl-1 pr-2 py-1 shadow-sm hover:bg-muted"
            aria-label="Switch role"
          >
            <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {avatar ? <img src={avatar} alt={user.name} className="h-full w-full object-cover" /> : user.initials}
            </span>
            <span className="hidden sm:inline text-xs font-medium">{ROLE_LABEL[user.role] ?? user.role}</span>
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
                      onClick={() => { setUser(u.id); setOpen(false); }}
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
    </header>
  );
}
