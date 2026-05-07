import { Bell, Moon, Sun, Search } from "lucide-react";
import { useCurrentUser, useUserAvatar } from "@/lib/store";
import { Logo } from "./Logo";
import { useTheme } from "@/lib/theme";

export function Topbar() {
  const user = useCurrentUser();
  const { theme, toggle } = useTheme();
  const avatar = useUserAvatar(user?.id ?? "");
  if (!user) return null;
  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
      <div className="flex w-[208px] shrink-0 items-center">
        <Logo size={28} />
      </div>
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={user.language === "es" ? "Buscar en SAITO" : "Search in SAITO"}
            className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {avatar ? <img src={avatar} alt={user.name} className="h-full w-full object-cover" /> : user.initials}
        </div>
      </div>
    </header>
  );
}
