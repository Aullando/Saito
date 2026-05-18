import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/calendar")({
  component: MobileCalendar,
});

function MobileCalendar() {
  const events = useData((s) => s.events);
  const [days] = useState(7);
  const upcoming = useMemo(() => {
    const today = new Date();
    const horizon = new Date(today);
    horizon.setDate(today.getDate() + days);
    const t = today.toISOString().slice(0, 10);
    const h = horizon.toISOString().slice(0, 10);
    return events
      .filter((e) => e.date >= t && e.date <= h)
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [events, days]);

  const grouped = upcoming.reduce<Record<string, typeof upcoming>>((acc, e) => {
    (acc[e.date] ||= []).push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Calendario</h1>
        <p className="text-sm text-muted-foreground">Próximos {days} días</p>
      </header>

      {Object.keys(grouped).length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Sin eventos próximos.
        </div>
      )}

      {Object.entries(grouped).map(([date, list]) => (
        <section key={date}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {new Date(date).toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </h2>
          <ul className="space-y-2">
            {list.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[10px] font-semibold uppercase">
                    {e.startTime.split(":")[0]}h
                  </span>
                  <span className="text-[10px]">{e.startTime.split(":")[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{e.title}</div>
                  <div className="text-[11px] capitalize text-muted-foreground">
                    {e.type}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
