import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ClipboardList,
  CalendarPlus,
  ArrowLeft,
  Plus,
  Paperclip,
  CheckCircle2,
  Stethoscope,
  Clock,
  User as UserIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/medical/$tool")({
  component: MedicalToolPage,
});

const META: Record<string, { title: string; desc: string; icon: LucideIcon }> = {
  incidents: {
    title: "Registro de incidencias",
    desc: "Registro operativo de molestias y partes — bajo supervisión profesional",
    icon: AlertTriangle,
  },
  treatments: {
    title: "Planes de tratamiento bajo supervisión",
    desc: "Pautas activas y finalizadas, supervisadas por profesional sanitario",
    icon: ClipboardList,
  },
  requests: {
    title: "Solicitudes de cita médica",
    desc: "Peticiones pendientes de validación por staff médico",
    icon: CalendarPlus,
  },
};

function MedicalToolPage() {
  const { tool } = Route.useParams();
  const meta = META[tool];
  if (!meta) {
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
  const Icon = meta.icon;
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{meta.desc}</p>
        </div>
      </header>
      <MedicalDisclaimer />
      {tool === "incidents" && <IncidentsView />}
      {tool === "treatments" && <TreatmentsView />}
      {tool === "requests" && <RequestsView />}
    </div>
  );
}

// ───────────────────── INCIDENCIAS ─────────────────────

type FitStatus = "Apto" | "No apto" | "En revisión";
type Incident = {
  id: string;
  athlete: string;
  date: string;
  type: string;
  description: string;
  restriction: string;
  fitness: FitStatus;
  responsible: string;
  attachments: string[];
};

const INCIDENT_TYPES = [
  "Molestia muscular",
  "Sobrecarga",
  "Contusión",
  "Esguince",
  "Tendinopatía",
  "Otro",
];

const SEED_INCIDENTS: Incident[] = [
  {
    id: "i1",
    athlete: "Alejandro Ruiz",
    date: "2026-05-15",
    type: "Esguince",
    description: "Molestia en tobillo derecho tras gesto técnico.",
    restriction: "Sin saltos ni cambios de dirección 7 días.",
    fitness: "No apto",
    responsible: "J. Romero (fisio)",
    attachments: ["parte_inicial.pdf"],
  },
  {
    id: "i2",
    athlete: "Marta Domínguez",
    date: "2026-05-12",
    type: "Sobrecarga",
    description: "Sobrecarga en isquiotibial izquierdo.",
    restriction: "Trabajo a intensidad ≤ 70%.",
    fitness: "En revisión",
    responsible: "J. Romero (fisio)",
    attachments: [],
  },
  {
    id: "i3",
    athlete: "Hugo López",
    date: "2026-05-09",
    type: "Contusión",
    description: "Contusión leve en rodilla.",
    restriction: "Sin restricciones operativas.",
    fitness: "Apto",
    responsible: "Dra. M. Vidal",
    attachments: ["alta.pdf"],
  },
];

function fitnessClass(s: FitStatus) {
  return s === "Apto"
    ? "bg-emerald-100 text-emerald-800"
    : s === "No apto"
      ? "bg-rose-100 text-rose-800"
      : "bg-amber-100 text-amber-800";
}

function IncidentsView() {
  const [items, setItems] = useState<Incident[]>(SEED_INCIDENTS);
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {items.length} registros · ordenados por fecha
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Registrar incidencia
            </Button>
          </DialogTrigger>
          <IncidentForm
            onSubmit={(inc) => {
              setItems((s) => [inc, ...s]);
              setOpen(false);
              toast.success("Incidencia registrada");
            }}
          />
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">Atleta</th>
              <th className="px-3 py-2 font-semibold">Fecha</th>
              <th className="px-3 py-2 font-semibold">Tipo</th>
              <th className="px-3 py-2 font-semibold">Estado</th>
              <th className="px-3 py-2 font-semibold">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-3 py-2.5 font-medium text-foreground">{r.athlete}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.date}</td>
                <td className="px-3 py-2.5">{r.type}</td>
                <td className="px-3 py-2.5">
                  <StatusChip>{r.fitness}</StatusChip>
                </td>

                <td className="px-3 py-2.5 text-muted-foreground">{r.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2 md:hidden">
        {items.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{r.athlete}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.date} · {r.type}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${fitnessClass(
                  r.fitness,
                )}`}
              >
                {r.fitness}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Responsable: {r.responsible}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IncidentForm({ onSubmit }: { onSubmit: (i: Incident) => void }) {
  const [athlete, setAthlete] = useState("");
  const [type, setType] = useState(INCIDENT_TYPES[0]);
  const [description, setDescription] = useState("");
  const [restriction, setRestriction] = useState("");
  const [fitness, setFitness] = useState<FitStatus>("En revisión");
  const [attach, setAttach] = useState("");

  const valid = athlete.trim() && description.trim();

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Registrar incidencia (salud deportiva)</DialogTitle>
        <DialogDescription>
          Registro operativo bajo supervisión profesional. No constituye diagnóstico clínico.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="ath">Atleta</Label>
          <Input
            id="ath"
            value={athlete}
            onChange={(e) => setAthlete(e.target.value.slice(0, 80))}
            placeholder="Nombre y apellidos"
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="desc">Descripción operativa</Label>
          <Textarea
            id="desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            placeholder="Descripción del incidente y observaciones."
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rest">Restricción operativa</Label>
          <Textarea
            id="rest"
            rows={2}
            value={restriction}
            onChange={(e) => setRestriction(e.target.value.slice(0, 300))}
            placeholder="Ej: sin saltos ni cambios de dirección durante 7 días."
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Estado</Label>
          <div className="flex flex-wrap gap-2">
            {(["Apto", "En revisión", "No apto"] as FitStatus[]).map((s) => {
              const active = fitness === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFitness(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    active ? fitnessClass(s) : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="att">Adjuntos</Label>
          <div className="flex items-center gap-2">
            <Input
              id="att"
              value={attach}
              onChange={(e) => setAttach(e.target.value.slice(0, 120))}
              placeholder="parte_inicial.pdf"
            />
            <Button type="button" variant="outline" size="icon" aria-label="Adjuntar">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Demo · los archivos solo se referencian en este registro.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={!valid}
          onClick={() =>
            onSubmit({
              id: crypto.randomUUID(),
              athlete: athlete.trim(),
              date: new Date().toISOString().slice(0, 10),
              type,
              description: description.trim(),
              restriction: restriction.trim() || "Sin restricciones operativas.",
              fitness,
              responsible: "J. Romero (fisio)",
              attachments: attach ? [attach] : [],
            })
          }
        >
          Guardar incidencia
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ───────────────────── PLANES DE TRATAMIENTO ─────────────────────

type Treatment = {
  id: string;
  athlete: string;
  title: string;
  responsible: string;
  sessionsDone: number;
  sessionsTotal: number;
  nextReview: string;
  status: "active" | "finished";
};

const SEED_TREATMENTS: Treatment[] = [
  {
    id: "t1",
    athlete: "Alejandro Ruiz",
    title: "Protocolo tobillo · 4 semanas",
    responsible: "J. Romero (fisio)",
    sessionsDone: 5,
    sessionsTotal: 12,
    nextReview: "2026-05-22",
    status: "active",
  },
  {
    id: "t2",
    athlete: "Marta Domínguez",
    title: "Readaptación isquiotibial",
    responsible: "J. Romero (fisio)",
    sessionsDone: 2,
    sessionsTotal: 8,
    nextReview: "2026-05-20",
    status: "active",
  },
  {
    id: "t3",
    athlete: "Hugo López",
    title: "Recuperación contusión rodilla",
    responsible: "Dra. M. Vidal",
    sessionsDone: 6,
    sessionsTotal: 6,
    nextReview: "—",
    status: "finished",
  },
];

function TreatmentsView() {
  const [items, setItems] = useState<Treatment[]>(SEED_TREATMENTS);
  const active = useMemo(() => items.filter((t) => t.status === "active"), [items]);
  const finished = useMemo(() => items.filter((t) => t.status === "finished"), [items]);

  const finish = (id: string) =>
    setItems((s) =>
      s.map((t) =>
        t.id === id
          ? { ...t, status: "finished", sessionsDone: t.sessionsTotal, nextReview: "—" }
          : t,
      ),
    );

  return (
    <section className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Activos
          </h2>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            {active.length}
          </span>
        </div>
        {active.length === 0 ? (
          <EmptyBlock label="No hay planes activos." />
        ) : (
          <ul className="grid gap-2">
            {active.map((t) => (
              <TreatmentCard
                key={t.id}
                t={t}
                onFinish={() => {
                  finish(t.id);
                  toast.success("Plan finalizado");
                }}
              />
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Finalizados
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {finished.length}
          </span>
        </div>
        {finished.length === 0 ? (
          <EmptyBlock label="Aún no hay planes finalizados." />
        ) : (
          <ul className="grid gap-2">
            {finished.map((t) => (
              <TreatmentCard key={t.id} t={t} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function TreatmentCard({ t, onFinish }: { t: Treatment; onFinish?: () => void }) {
  const pct = Math.round((t.sessionsDone / t.sessionsTotal) * 100);
  const finished = t.status === "finished";
  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{t.athlete}</div>
          <div className="text-xs text-muted-foreground">{t.title}</div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            finished
              ? "bg-muted text-muted-foreground"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {finished ? "Finalizado" : "Activo"}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Sesión {t.sessionsDone} de {t.sessionsTotal}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full ${finished ? "bg-muted-foreground/40" : "bg-emerald-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <UserIcon className="h-3.5 w-3.5" /> {t.responsible}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> Próx. revisión: {t.nextReview}
        </span>
      </div>

      {!finished && onFinish && (
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onFinish}>
            <CheckCircle2 className="h-4 w-4" /> Finalizar plan
          </Button>
        </div>
      )}
    </li>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

// ───────────────────── SOLICITUDES DE CITA ─────────────────────

type ApptRequest = {
  id: string;
  athlete: string;
  reason: string;
  specialty: string;
  preferred: string;
  requestedAt: string;
  status: "pending" | "managed";
};

const SEED_REQUESTS: ApptRequest[] = [
  {
    id: "r1",
    athlete: "Lucía Martín",
    reason: "Reconocimiento anual",
    specialty: "Medicina deportiva",
    preferred: "2026-05-22",
    requestedAt: "hoy 09:12",
    status: "pending",
  },
  {
    id: "r2",
    athlete: "Pablo Sánchez",
    reason: "Molestia aductor",
    specialty: "Fisioterapia",
    preferred: "2026-05-20",
    requestedAt: "ayer",
    status: "pending",
  },
  {
    id: "r3",
    athlete: "Nadia Abad",
    reason: "Revisión post-incidencia",
    specialty: "Medicina deportiva",
    preferred: "2026-05-23",
    requestedAt: "hace 2 días",
    status: "managed",
  },
];

function RequestsView() {
  const [items, setItems] = useState<ApptRequest[]>(SEED_REQUESTS);
  const [creating, setCreating] = useState<ApptRequest | null>(null);

  const pending = items.filter((r) => r.status === "pending");
  const managed = items.filter((r) => r.status === "managed");

  const markManaged = (id: string) =>
    setItems((s) => s.map((r) => (r.id === id ? { ...r, status: "managed" } : r)));

  return (
    <section className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Pendientes
          </h2>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            {pending.length}
          </span>
        </div>
        {pending.length === 0 ? (
          <EmptyBlock label="No hay solicitudes pendientes." />
        ) : (
          <ul className="grid gap-2">
            {pending.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{r.athlete}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.reason} · {r.specialty}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Fecha preferida: {r.preferred} · solicitada {r.requestedAt}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    Pendiente
                  </span>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setCreating(r)}
                  >
                    <Stethoscope className="h-4 w-4" /> Crear cita médica
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Gestionadas
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {managed.length}
          </span>
        </div>
        {managed.length === 0 ? (
          <EmptyBlock label="Aún no hay solicitudes gestionadas." />
        ) : (
          <ul className="grid gap-2">
            {managed.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-card p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{r.athlete}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.reason} · cita programada
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                    Gestionada
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!creating} onOpenChange={(o) => !o && setCreating(null)}>
        {creating && (
          <CreateAppointmentForm
            req={creating}
            onSubmit={() => {
              markManaged(creating.id);
              setCreating(null);
              toast.success("Cita creada y solicitud marcada como gestionada");
            }}
          />
        )}
      </Dialog>
    </section>
  );
}

function CreateAppointmentForm({
  req,
  onSubmit,
}: {
  req: ApptRequest;
  onSubmit: () => void;
}) {
  const [date, setDate] = useState(req.preferred);
  const [time, setTime] = useState("12:00");
  const [staff, setStaff] = useState("J. Romero (fisio)");
  const [notes, setNotes] = useState("");
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Crear cita médica</DialogTitle>
        <DialogDescription>
          Para {req.athlete} · {req.specialty}. Bajo supervisión profesional.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="d">Fecha</Label>
            <Input id="d" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t">Hora</Label>
            <Input id="t" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="s">Responsable</Label>
          <Input
            id="s"
            value={staff}
            onChange={(e) => setStaff(e.target.value.slice(0, 80))}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="n">Notas para el atleta</Label>
          <Textarea
            id="n"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 300))}
            placeholder="Indicaciones previas, sala, material…"
          />
        </div>
      </div>
      <DialogFooter>
        <Button disabled={!date || !time || !staff.trim()} onClick={onSubmit}>
          Confirmar cita
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
