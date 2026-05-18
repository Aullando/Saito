import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Clock, MapPin, Users } from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/")({
  component: MobileHome,
});

function MobileHome() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const today = new Date().toISOString().slice(0, 10);

  const todays = useMemo(
    () => events.filter((e) => e.date === today).slice(0, 4),
    [events, today],
  );

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold tracking-tight">
          Hola, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hoy
        </h2>
        {todays.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Sin actividades programadas.
          </div>
        ) : (
          <ul className="space-y-2">
            {todays.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border border-border bg-card p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{e.title}</div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {e.startTime}
                      </span>
                      {e.groupId && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Grupo
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                    {e.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid grid-cols-2 gap-2">
        <Stat label="Esta semana" value="4 sesiones" />
        <Stat label="Asistencia" value="92%" />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
