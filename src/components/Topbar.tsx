import { Bell } from "lucide-react";
import { useCurrentUser } from "@/lib/store";

export function Topbar() {
  const user = useCurrentUser();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-3 border-b border-border bg-background/80 px-6 backdrop-blur">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3 rounded-full bg-card px-3 py-1.5 shadow-sm">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
          style={{
            background:
              "conic-gradient(from 180deg, oklch(0.58 0.17 252), oklch(0.7 0.16 155), oklch(0.78 0.15 75), oklch(0.65 0.2 27), oklch(0.58 0.17 252))",
          }}
        >
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-card text-foreground">
            {user.initials}
          </span>
        </div>
        <span className="pr-1 text-sm font-medium">{user.name}</span>
      </div>
    </header>
  );
}
