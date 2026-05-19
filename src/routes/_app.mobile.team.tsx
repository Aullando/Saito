import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { useClub } from "@/clubs/ClubProvider";
import { GffMobileTeam } from "@/clubs/gff/GffMobileWorkspace";

export const Route = createFileRoute("/_app/mobile/team")({
  component: MobileTeamRoute,
});

function MobileTeamRoute() {
  const { club } = useClub();
  if (club.id === "gff-demo") return <GffMobileTeam />;
  return <MobileTeam />;
}

function MobileTeam() {
  const athletes = useData((s) => s.athletes).slice(0, 12);

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Equipo</h1>
        <p className="text-sm text-muted-foreground">{athletes.length} deportistas</p>
      </header>

      <ul className="space-y-2">
        {athletes.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {a.firstName[0]}
              {a.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {a.firstName} {a.lastName}
              </div>
              <div className="text-[11px] text-muted-foreground">{a.status}</div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                a.medicalStatus === "Fit"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
              }`}
            >
              {a.medicalStatus}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
