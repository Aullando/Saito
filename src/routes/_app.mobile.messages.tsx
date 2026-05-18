import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/messages")({
  component: MobileMessages,
});

function MobileMessages() {
  const conversations = useData((s) => s.conversations).slice(0, 8);

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Mensajes</h1>
      </header>

      <ul className="space-y-2">
        {conversations.map((c) => {
          const last = c.messages[c.messages.length - 1];
          return (
            <li
              key={c.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {c.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold">{c.title}</div>
                  {c.unreadCount > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                {last && (
                  <div className="truncate text-[11px] text-muted-foreground">
                    {last.content}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
