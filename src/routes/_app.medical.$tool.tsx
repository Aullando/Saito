import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ClipboardList,
  CalendarPlus,
  ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/medical/$tool")({
  component: MedicalToolPage,
});

type ToolInfo = {
  title: string;
  desc: string;
  icon: LucideIcon;
  rows: { title: string; subtitle: string; status?: string }[];
};

const TOOLS: Record<string, ToolInfo> = {
  incidents: {
    title: "Incidencias",
    desc: "Lesiones, molestias y partes médicos",
    icon: AlertTriangle,
    rows: [
      { title: "Alejandro RUIZ — Esguince tobillo grado I", subtitle: "Abierta hace 3 días", status: "Activa" },
      { title: "Marta DOMÍNGUEZ — Sobrecarga isquiotibial", subtitle: "Seguimiento semanal", status: "En revisión" },
      { title: "Hugo LÓPEZ — Contusión rodilla", subtitle: "Cerrada el lunes", status: "Resuelta" },
    ],
  },
  treatments: {
    title: "Planes de tratamiento",
    desc: "Pautas activas de fisioterapia y rehabilitación",
    icon: ClipboardList,
    rows: [
      { title: "Alejandro RUIZ — Protocolo tobillo 4 semanas", subtitle: "Sesión 5 de 12", status: "En curso" },
      { title: "Marta DOMÍNGUEZ — Readaptación isquios", subtitle: "Sesión 2 de 8", status: "En curso" },
    ],
  },
  requests: {
    title: "Solicitudes de cita",
    desc: "Peticiones pendientes de validación",
    icon: CalendarPlus,
    rows: [
      { title: "Lucía MARTÍN — Reconocimiento anual", subtitle: "Solicitada hoy 09:12", status: "Pendiente" },
      { title: "Pablo SÁNCHEZ — Molestia aductor", subtitle: "Solicitada ayer", status: "Pendiente" },
      { title: "Nadia ABAD — Revisión post-lesión", subtitle: "Confirmada para el viernes", status: "Confirmada" },
    ],
  },
};

function MedicalToolPage() {
  const { tool } = Route.useParams();
  const info = TOOLS[tool];
  if (!info) {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <Link to="/medical/calendar" className="text-xs text-muted-foreground">
          <ArrowLeft className="mr-1 inline h-3 w-3" /> Volver
        </Link>
        <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Sección no encontrada.
        </div>
      </div>
    );
  }
  const Icon = info.icon;
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{info.title}</h1>
          <p className="text-sm text-muted-foreground">{info.desc}</p>
        </div>
      </header>
      <ul className="space-y-2">
        {info.rows.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.subtitle}</div>
            </div>
            {r.status && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                {r.status}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
