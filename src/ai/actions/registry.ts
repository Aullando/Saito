// Registry of AI-callable actions for SAITO demo.
// Each action validates role, declares destructive flag, and applies a mutation
// against the local Zustand store. The model is told (server-side) which
// actions are available for the caller's role.

import { useData } from "@/lib/store";
import type { Role } from "@/lib/types";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export interface ActionDef<TArgs = Record<string, unknown>> {
  name: string;
  description: string;
  destructive: boolean;
  roles: Role[];
  /** Plain-text parameter list shown to the model. */
  params: string;
  /** Human-readable preview of the action for the confirm modal. */
  preview: (args: TArgs) => string;
  /** Apply the action against the live store. */
  apply: (args: TArgs) => ActionResult;
}

const store = () => useData.getState();

const findAthleteName = (athleteId: string) => {
  const a = store().athletes.find((x) => x.id === athleteId);
  return a ? `${a.firstName} ${a.lastName}` : athleteId;
};

const findEventTitle = (id: string) => store().events.find((e) => e.id === id)?.title ?? id;

// ---------- Action implementations ----------

const ACTIONS: ActionDef[] = [
  {
    name: "markPaymentAsPaid",
    description: "Marca un pago como cobrado.",
    destructive: false,
    roles: ["admin", "manager"],
    params: "paymentId: string",
    preview: (a) => `Marcar pago ${(a as { paymentId: string }).paymentId} como Paid`,
    apply: (a) => {
      const { paymentId } = a as { paymentId: string };
      const p = store().payments.find((x) => x.id === paymentId);
      if (!p) return { ok: false, error: `Pago ${paymentId} no encontrado` };
      store().setPaymentStatus(paymentId, "Paid");
      return { ok: true, message: `Pago de ${findAthleteName(p.athleteId)} marcado como cobrado (${p.amount}€).` };
    },
  },
  {
    name: "markPaymentAsFailed",
    description: "Marca un pago como fallido (devuelto).",
    destructive: true,
    roles: ["admin"],
    params: "paymentId: string, reason?: string",
    preview: (a) => `Marcar pago ${(a as { paymentId: string }).paymentId} como Failed`,
    apply: (a) => {
      const { paymentId } = a as { paymentId: string; reason?: string };
      const p = store().payments.find((x) => x.id === paymentId);
      if (!p) return { ok: false, error: `Pago ${paymentId} no encontrado` };
      store().setPaymentStatus(paymentId, "Failed");
      return { ok: true, message: `Pago de ${findAthleteName(p.athleteId)} marcado como fallido.` };
    },
  },
  {
    name: "markPaymentAsPending",
    description: "Devuelve un pago al estado Pendiente.",
    destructive: false,
    roles: ["admin", "manager"],
    params: "paymentId: string",
    preview: (a) => `Marcar pago ${(a as { paymentId: string }).paymentId} como Pending`,
    apply: (a) => {
      const { paymentId } = a as { paymentId: string };
      const p = store().payments.find((x) => x.id === paymentId);
      if (!p) return { ok: false, error: `Pago ${paymentId} no encontrado` };
      store().setPaymentStatus(paymentId, "Pending");
      return { ok: true, message: `Pago marcado como pendiente.` };
    },
  },
  {
    name: "scheduleAppointment",
    description: "Crea una cita médica para un deportista.",
    destructive: false,
    roles: ["medical", "admin"],
    params: "athleteId: string, date: YYYY-MM-DD, time: HH:mm, reason: string, staffId?: string",
    preview: (a) => {
      const x = a as { athleteId: string; date: string; time: string; reason: string };
      return `Cita ${x.date} ${x.time} para ${findAthleteName(x.athleteId)}: ${x.reason}`;
    },
    apply: (a) => {
      const x = a as { athleteId: string; date: string; time: string; reason: string; staffId?: string };
      if (!store().athletes.find((y) => y.id === x.athleteId))
        return { ok: false, error: `Deportista ${x.athleteId} no existe` };
      store().addAppointment({
        athleteId: x.athleteId,
        staffId: x.staffId ?? "u-medical",
        date: x.date,
        time: x.time,
        reason: x.reason,
        status: "Scheduled",
        notes: "",
      });
      return { ok: true, message: `Cita programada el ${x.date} ${x.time} para ${findAthleteName(x.athleteId)}.` };
    },
  },
  {
    name: "cancelAppointment",
    description: "Cancela una cita médica existente.",
    destructive: true,
    roles: ["medical", "admin"],
    params: "appointmentId: string",
    preview: (a) => `Cancelar cita ${(a as { appointmentId: string }).appointmentId}`,
    apply: (a) => {
      const { appointmentId } = a as { appointmentId: string };
      const apt = store().appointments.find((x) => x.id === appointmentId);
      if (!apt) return { ok: false, error: `Cita ${appointmentId} no encontrada` };
      store().updateAppointment(appointmentId, { status: "Cancelled" });
      return { ok: true, message: `Cita del ${apt.date} cancelada.` };
    },
  },
  {
    name: "completeAppointment",
    description: "Marca una cita como completada y añade notas.",
    destructive: false,
    roles: ["medical"],
    params: "appointmentId: string, notes?: string",
    preview: (a) => `Completar cita ${(a as { appointmentId: string }).appointmentId}`,
    apply: (a) => {
      const x = a as { appointmentId: string; notes?: string };
      const apt = store().appointments.find((y) => y.id === x.appointmentId);
      if (!apt) return { ok: false, error: `Cita ${x.appointmentId} no encontrada` };
      store().updateAppointment(x.appointmentId, {
        status: "Completed",
        notes: (apt.notes ? apt.notes + "\n" : "") + (x.notes ?? ""),
      });
      return { ok: true, message: `Cita marcada como completada.` };
    },
  },
  {
    name: "addAppointmentNote",
    description: "Añade una nota a una cita médica.",
    destructive: false,
    roles: ["medical"],
    params: "appointmentId: string, note: string",
    preview: (a) => `Añadir nota a cita ${(a as { appointmentId: string }).appointmentId}`,
    apply: (a) => {
      const x = a as { appointmentId: string; note: string };
      if (!store().appointments.find((y) => y.id === x.appointmentId))
        return { ok: false, error: `Cita ${x.appointmentId} no encontrada` };
      store().addAppointmentNote(x.appointmentId, x.note);
      return { ok: true, message: `Nota añadida.` };
    },
  },
  {
    name: "setAthleteMedicalStatus",
    description: "Cambia el estado médico operativo del deportista.",
    destructive: true,
    roles: ["medical"],
    params: "athleteId: string, status: 'Fit' | 'Injured' | 'Under review' | 'Unknown'",
    preview: (a) => {
      const x = a as { athleteId: string; status: string };
      return `Estado médico de ${findAthleteName(x.athleteId)} → ${x.status}`;
    },
    apply: (a) => {
      const x = a as { athleteId: string; status: "Fit" | "Injured" | "Under review" | "Unknown" };
      if (!store().athletes.find((y) => y.id === x.athleteId))
        return { ok: false, error: `Deportista ${x.athleteId} no existe` };
      store().updateAthlete(x.athleteId, { medicalStatus: x.status });
      return { ok: true, message: `Estado médico de ${findAthleteName(x.athleteId)} actualizado a ${x.status}.` };
    },
  },
  {
    name: "createEvent",
    description: "Crea un evento en el calendario (entrenamiento, reunión, etc.).",
    destructive: false,
    roles: ["admin", "manager", "technical"],
    params:
      "title: string, date: YYYY-MM-DD, startTime: HH:mm, type: 'training'|'match'|'medical'|'meeting'|'club', sectionId?: string, groupId?: string, location?: string",
    preview: (a) => {
      const x = a as { title: string; date: string; startTime: string };
      return `Crear "${x.title}" el ${x.date} ${x.startTime}`;
    },
    apply: (a) => {
      const x = a as {
        title: string;
        date: string;
        startTime: string;
        type: "training" | "match" | "medical" | "meeting" | "club";
        sectionId?: string;
        groupId?: string;
        location?: string;
      };
      store().addEvent({
        title: x.title,
        date: x.date,
        startTime: x.startTime,
        type: x.type,
        sectionId: x.sectionId,
        groupId: x.groupId,
        location: x.location,
      });
      return { ok: true, message: `Evento "${x.title}" creado (${x.date} ${x.startTime}).` };
    },
  },
  {
    name: "moveEvent",
    description: "Cambia la fecha y/u hora de un evento existente.",
    destructive: false,
    roles: ["admin", "manager", "technical"],
    params: "eventId: string, newDate?: YYYY-MM-DD, newStartTime?: HH:mm, newLocation?: string",
    preview: (a) => {
      const x = a as { eventId: string; newDate?: string; newStartTime?: string };
      return `Mover "${findEventTitle(x.eventId)}" → ${x.newDate ?? "(misma fecha)"} ${x.newStartTime ?? ""}`;
    },
    apply: (a) => {
      const x = a as { eventId: string; newDate?: string; newStartTime?: string; newLocation?: string };
      const ev = store().events.find((y) => y.id === x.eventId);
      if (!ev) return { ok: false, error: `Evento ${x.eventId} no encontrado` };
      store().updateEvent(x.eventId, {
        ...(x.newDate ? { date: x.newDate } : {}),
        ...(x.newStartTime ? { startTime: x.newStartTime } : {}),
        ...(x.newLocation ? { location: x.newLocation } : {}),
      });
      return { ok: true, message: `"${ev.title}" reprogramado.` };
    },
  },
  {
    name: "cancelEvent",
    description: "Elimina un evento del calendario.",
    destructive: true,
    roles: ["admin", "manager", "technical"],
    params: "eventId: string",
    preview: (a) => `Eliminar evento "${findEventTitle((a as { eventId: string }).eventId)}"`,
    apply: (a) => {
      const { eventId } = a as { eventId: string };
      const ev = store().events.find((y) => y.id === eventId);
      if (!ev) return { ok: false, error: `Evento ${eventId} no encontrado` };
      store().deleteEvent(eventId);
      return { ok: true, message: `Evento "${ev.title}" eliminado.` };
    },
  },
  {
    name: "sendCircular",
    description: "Envía una circular (mensaje) a una conversación existente.",
    destructive: false,
    roles: ["admin", "manager", "technical"],
    params: "conversationId: string, content: string",
    preview: (a) => {
      const x = a as { conversationId: string; content: string };
      const conv = store().conversations.find((c) => c.id === x.conversationId);
      return `Enviar a "${conv?.title ?? x.conversationId}": ${x.content.slice(0, 80)}…`;
    },
    apply: (a) => {
      const x = a as { conversationId: string; content: string };
      const conv = store().conversations.find((c) => c.id === x.conversationId);
      if (!conv) return { ok: false, error: `Conversación ${x.conversationId} no encontrada` };
      store().sendMessage(x.conversationId, {
        authorId: "ai-assistant",
        authorRole: "admin",
        targetLabel: conv.title,
        content: x.content,
      });
      return { ok: true, message: `Mensaje enviado a "${conv.title}".` };
    },
  },
  {
    name: "toggleOrgAi",
    description: "Activa o desactiva la IA para una organización.",
    destructive: false,
    roles: ["sysadmin"],
    params: "orgId: string",
    preview: (a) => `Cambiar IA en organización ${(a as { orgId: string }).orgId}`,
    apply: (a) => {
      const { orgId } = a as { orgId: string };
      const org = store().organizations.find((o) => o.id === orgId);
      if (!org) return { ok: false, error: `Organización ${orgId} no encontrada` };
      store().toggleOrgAi(orgId);
      return { ok: true, message: `IA ${!org.aiEnabled ? "activada" : "desactivada"} en ${org.name}.` };
    },
  },
  {
    name: "setOrgStatus",
    description: "Activa o desactiva una organización completa.",
    destructive: true,
    roles: ["sysadmin"],
    params: "orgId: string, status: 'Active' | 'Inactive'",
    preview: (a) => {
      const x = a as { orgId: string; status: string };
      return `Cambiar estado de organización ${x.orgId} → ${x.status}`;
    },
    apply: (a) => {
      const x = a as { orgId: string; status: "Active" | "Inactive" };
      const org = store().organizations.find((o) => o.id === x.orgId);
      if (!org) return { ok: false, error: `Organización ${x.orgId} no encontrada` };
      store().setOrgStatus(x.orgId, x.status);
      return { ok: true, message: `${org.name}: estado → ${x.status}.` };
    },
  },
];

export const ACTION_REGISTRY: Record<string, ActionDef> = Object.fromEntries(
  ACTIONS.map((a) => [a.name, a]),
);

export function actionsForRole(role: Role): ActionDef[] {
  return ACTIONS.filter((a) => a.roles.includes(role));
}
