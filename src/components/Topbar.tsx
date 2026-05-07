import { Bell } from "lucide-react";
import { useCurrentUser } from "@/lib/store";
import { LogoMark } from "./Logo";

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
      <div className="flex items-center gap-2.5 rounded-full bg-card px-3 py-1.5 shadow-sm">
        <LogoMark size={28} />
        <span className="pr-1 text-sm font-medium">{user.name}</span>
      </div>
    </header>
  );
}
