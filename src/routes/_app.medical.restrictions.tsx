import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ATHLETES } from "@/lib/seed";
import { ShieldAlert, Stethoscope, Lock, Activity, Filter } from "lucide-react";

export const Route = createFileRoute("/_app/medical/restrictions")({
  head: () => ({ meta: [{ title: "Salud deportiva · Restricciones operativas — SAITO" }] }),
  component: () => (
    <RoleGate roles={["medical", "admin"]}>
      <AppLayout>
        <RestrictionsPage />
      </AppLayout>
    </RoleGate>
  ),
});

type Restriction = {
  id: string;
  athleteId: string;
  type: "Registro de incidencia" | "Restricción operativa" | "Seguimiento";
  area: string;
  status: "Activa" | "En recuperación" | "Apto";
  startDate: string;
  expectedReturn?: string;
  notes: string;
  visibility: "Solo médico" | "Médico + entrenador" | "Médico + dirección";
};

const POOL: Omit<Restriction, "athleteId" | "id">[] = [
  {
    type: "Registro de incidencia",
    area: "Isquiotibial derecho",
    status: "Activa",
    startDate: "2026-04-30",
    expectedReturn: "2026-05-21",
    notes: "No carrera. Sí trabajo de core y movilidad.",
    visibility: "Médico + entrenador",
  },
  {
    type: "Restricción operativa",
    area: "Hombro izquierdo",
    status: "En recuperación",
    startDate: "2026-04-12",
    expectedReturn: "2026-05-12",
    notes: "Carga progresiva. Sin contacto pleno.",
    visibility: "Médico + entrenador",
  },
  {
    type: "Seguimiento",
    area: "Tendón rotuliano",
    status: "Activa",
    startDate: "2026-04-25",
    notes: "Control semanal. No saltos repetidos.",
    visibility: "Solo médico",
  },
  {
    type: "Registro de incidencia",
    area: "Tobillo derecho",
    status: "Apto",
    startDate: "2026-03-20",
    expectedReturn: "2026-04-15",
    notes: "Apto. Mantener vendaje funcional 2 semanas.",
    visibility: "Médico + dirección",
  },
  {
    type: "Restricción operativa",
    area: "Cervical",
    status: "En recuperación",
    startDate: "2026-04-28",
    notes: "Evitar cabezazos. Sin contacto frontal.",
    visibility: "Médico + entrenador",
  },
  {
    type: "Registro de incidencia",
    area: "Cuádriceps",
    status: "Activa",
    startDate: "2026-05-02",
    expectedReturn: "2026-05-30",
    notes: "Trabajo en piscina. Reevaluar en 7 días.",
    visibility: "Solo médico",
  },
  {
    type: "Seguimiento",
    area: "Carga de entrenamiento",
    status: "Activa",
    startDate: "2026-04-18",
    notes: "Sobrecarga acumulada. Reducir volumen 20%.",
    visibility: "Médico + entrenador",
  },
];

const RESTRICTIONS: Restriction[] = ATHLETES.slice(0, 7).map((a, i) => ({
  id: `r-${i + 1}`,
  athleteId: a.id,
  ...POOL[i % POOL.length],
}));

function RestrictionsPage() {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<"all" | Restriction["status"]>("all");

  const filtered = RESTRICTIONS.filter((r) => {
    const a = ATHLETES.find((x) => x.id === r.athleteId);
    const name = `${a?.firstName ?? ""} ${a?.lastName ?? ""}`.toLowerCase();
    const matchQ =
      !q || name.includes(q.toLowerCase()) || r.area.toLowerCase().includes(q.toLowerCase());
    const matchS = statusF === "all" || r.status === statusF;
    return matchQ && matchS;
  });

  const counts = {
    activa: RESTRICTIONS.filter((r) => r.status === "Activa").length,
    recup: RESTRICTIONS.filter((r) => r.status === "En recuperación").length,
    alta: RESTRICTIONS.filter((r) => r.status === "Apto").length,
  };

  return (
    <>
      <PageHeader
        title="Salud deportiva · Restricciones operativas"
        subtitle="Registro operativo bajo supervisión profesional. Estados apto / no apto introducidos por personal autorizado."
      />

      <MedicalDisclaimer className="mb-4" />

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs">
        <Lock className="h-4 w-4 shrink-0 text-primary" />
        <span>
          Solo personal médico autorizado y dirección con permiso explícito ven el detalle.
          Todos los accesos quedan registrados en{" "}
          <a className="font-semibold text-primary hover:underline" href="/settings/privacy">
            Privacidad y seguridad
          </a>
          .
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Restricciones activas
            </span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold">{counts.activa}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              En recuperación
            </span>
            <Activity className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold">{counts.recup}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Apto (mes)
            </span>
            <Stethoscope className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold">{counts.alta}</div>
        </Card>
      </div>

      <div className="mt-6 mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar deportista o zona…"
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {(["all", "Activa", "En recuperación", "Alta médica"] as const).map((s) => (
          <Button
            key={s}
            variant={statusF === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusF(s)}
          >
            {s === "all" ? "Todas" : s}
          </Button>
        ))}
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2 font-semibold">Deportista</th>
                <th className="px-3 py-2 font-semibold">Tipo</th>
                <th className="px-3 py-2 font-semibold">Zona / motivo</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 font-semibold">Inicio</th>
                <th className="px-3 py-2 font-semibold">Vuelta prevista</th>
                <th className="px-3 py-2 font-semibold">Visibilidad</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const a = ATHLETES.find((x) => x.id === r.athleteId);
                return (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="px-5 py-3">
                      <div className="font-medium">
                        {a?.firstName} {a?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{r.notes}</div>
                    </td>
                    <td className="px-3 py-3">
                      <Pill
                        tone={
                          r.type === "Lesión"
                            ? "danger"
                            : r.type === "Restricción"
                              ? "warning"
                              : "info"
                        }
                      >
                        {r.type}
                      </Pill>
                    </td>
                    <td className="px-3 py-3">{r.area}</td>
                    <td className="px-3 py-3">
                      <Pill
                        tone={
                          r.status === "Activa"
                            ? "danger"
                            : r.status === "En recuperación"
                              ? "warning"
                              : "success"
                        }
                      >
                        {r.status}
                      </Pill>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.startDate}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {r.expectedReturn ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.visibility}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Las restricciones activas se reflejan en asistencia, calendario y comunicación al staff
        técnico, sin exponer detalle clínico salvo a personal autorizado.
      </p>
    </>
  );
}
