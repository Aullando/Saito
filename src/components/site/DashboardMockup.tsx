import { Activity, CalendarDays, CreditCard, Users, Bell, Search, Sparkles } from "lucide-react";
import iso from "@/assets/brand/saito-iso.svg";

const bars = [
  { d: "L", v: 62 },
  { d: "M", v: 78 },
  { d: "X", v: 54 },
  { d: "J", v: 92 },
  { d: "V", v: 71 },
  { d: "S", v: 96 },
  { d: "D", v: 48 },
];

export function DashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-saito-radial blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-saito-navy/20">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-saito-red" />
            <span className="size-2.5 rounded-full bg-saito-yellow" />
            <span className="size-2.5 rounded-full bg-saito-green" />
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            <Search className="size-3" /> saito.app/club
          </div>
          <Bell className="size-4 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-12">
          <aside className="col-span-3 hidden border-r border-border bg-muted/40 p-3 sm:block">
            <div className="flex items-center gap-2 px-2 py-2">
              <img src={iso} alt="" className="size-6" />
              <span className="text-sm font-semibold">Club FC</span>
            </div>
            <nav className="mt-3 space-y-1 text-xs">
              {[
                { i: Activity, l: "Resumen", a: true },
                { i: Users, l: "Socios" },
                { i: CalendarDays, l: "Calendario" },
                { i: CreditCard, l: "Pagos" },
                { i: Sparkles, l: "IA" },
              ].map(({ i: I, l, a }) => (
                <div
                  key={l}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                    a ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"
                  }`}
                >
                  <I className="size-3.5" /> {l}
                </div>
              ))}
            </nav>
          </aside>

          <div className="col-span-12 space-y-4 p-4 sm:col-span-9">
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Socios activos", v: "1.284", d: "+4,2%" },
                { l: "Cuotas al día", v: "94%", d: "+1,1%" },
                { l: "Reservas semana", v: "312", d: "+12" },
              ].map((k) => (
                <div key={k.l} className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {k.l}
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">{k.v}</p>
                  <p className="text-[10px] font-semibold text-saito-green">{k.d}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Asistencia semanal</p>
                  <p className="text-[10px] text-muted-foreground">
                    Entrenamientos · todas las secciones
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">Esta semana</p>
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {bars.map((b, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-saito-blue to-[oklch(0.7_0.16_220)]"
                      style={{ height: `${b.v}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">Cuotas pendientes</p>
                <span className="rounded-full bg-saito-yellow/15 px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.55_0.15_75)]">
                  6 abiertas
                </span>
              </div>
              <ul className="mt-2 divide-y divide-border text-xs">
                {[
                  ["María L.", "Senior · Fútbol", "45 €"],
                  ["Diego R.", "Cantera · Sub-14", "30 €"],
                  ["Ana T.", "Pádel · Adultos", "55 €"],
                ].map(([n, s, v]) => (
                  <li key={n} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-foreground">{n}</p>
                      <p className="text-[10px] text-muted-foreground">{s}</p>
                    </div>
                    <span className="font-semibold text-foreground">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
