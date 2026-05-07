import { useState } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";
import { cn } from "@/lib/utils";
import { formatMoneyEs } from "@/lib/format";

const TITLES: Record<string, string> = {
  sysadmin: "SysAdmin AI",
  admin: "Club Admin AI",
  manager: "Manager AI",
  technical: "Technical Staff AI",
  medical: "Medical Staff AI",
};

const SUGGESTIONS: Record<string, string[]> = {
  sysadmin: ["¿Qué organizaciones tienen IA activada?", "¿Cuántas organizaciones están activas?"],
  admin: ["¿Qué pagos han fallado esta semana?", "¿Qué deportistas no están aptos?", "¿Qué cuotas tiene Juan Granados?"],
  manager: ["¿Qué grupos entrenan hoy en Valencia?", "¿Pagos fallidos esta semana?", "¿Cuotas de Juan Granados?"],
  technical: ["¿Atletas con estado médico desconocido?", "¿Mis entrenamientos esta semana?", "Resumen de notas de Raul"],
  medical: ["¿Qué citas tengo hoy?", "¿Atletas con tratamiento activo?", "¿Deportistas en revisión?"],
};

type Msg = { role: "user" | "ai"; text: string };

function answer(role: string, q: string, data: ReturnType<typeof useData.getState>): string {
  const lq = q.toLowerCase();
  // Permission gates
  if (role !== "sysadmin" && (lq.includes("organiza") || lq.includes("organization"))) {
    if (role === "sysadmin") {} else return "Esta consulta queda fuera de los permisos de tu rol.";
  }
  if ((role === "technical" || role === "medical") && (lq.includes("pago") || lq.includes("cuota") || lq.includes("ingreso"))) {
    return "Esta consulta económica queda fuera de los permisos de tu rol.";
  }

  if (lq.includes("ia activ") || lq.includes("ai enabled")) {
    const list = data.organizations.filter((o) => o.aiEnabled).map((o) => `- ${o.name}`).join("\n");
    return `Organizaciones con IA activada (${data.organizations.filter((o) => o.aiEnabled).length}):\n${list}`;
  }
  if (lq.includes("activas") || lq.includes("active organi")) {
    return `Hay ${data.organizations.filter((o) => o.status === "Active").length} organizaciones activas de ${data.organizations.length}.`;
  }
  if (lq.includes("fall")) {
    const failed = data.payments.filter((p) => p.status === "Failed");
    return `Hay ${failed.length} pagos fallidos. Atletas afectados: ${[...new Set(failed.map((p) => {
      const a = data.athletes.find((x) => x.id === p.athleteId);
      return a ? `${a.firstName} ${a.lastName}` : p.athleteId;
    }))].slice(0, 5).join(", ")}.`;
  }
  if (lq.includes("granados") && (lq.includes("cuota") || lq.includes("fee"))) {
    const granados = data.athletes.find((a) => a.lastName.toLowerCase().includes("granados"));
    if (!granados) return "No encuentro a Granados en el sistema.";
    const fees = data.fees.filter((f) => f.kind === "fee" && f.appliesToGroupIds.some((g) => granados.groupIds.includes(g)));
    return `Cuotas aplicables a Juan Granados:\n${fees.map((f) => `- ${f.name} · ${formatMoneyEs(f.amount)} · ${f.frequency}`).join("\n") || "(ninguna)"}`;
  }
  if (lq.includes("desconocid") || lq.includes("unknown")) {
    const list = data.athletes.filter((a) => a.medicalStatus === "Unknown");
    return `Hay ${list.length} deportistas con estado médico desconocido: ${list.slice(0, 6).map((a) => `${a.firstName} ${a.lastName}`).join(", ")}.`;
  }
  if (lq.includes("revisi")) {
    const list = data.athletes.filter((a) => a.medicalStatus === "Under review");
    return `${list.length} deportistas en revisión: ${list.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "(ninguno)"}.`;
  }
  if (lq.includes("cita") && lq.includes("hoy")) {
    const today = new Date().toISOString().slice(0, 10);
    const list = data.appointments.filter((a) => a.date === today);
    return `Citas hoy: ${list.length}. ${list.map((a) => {
      const at = data.athletes.find((x) => x.id === a.athleteId);
      return `${a.time} ${at ? at.firstName + " " + at.lastName : ""}`;
    }).join(" · ") || "(sin citas)"}`;
  }
  if (lq.includes("entrenam") || lq.includes("entrenamientos")) {
    const today = new Date().toISOString().slice(0, 10);
    const list = data.events.filter((e) => e.date === today);
    return `Hoy hay ${list.length} entrenamientos programados.`;
  }
  if (lq.includes("valencia") && lq.includes("hoy")) {
    return "Hoy entrenan en Valencia: Grupo A (18:00) y Senior (11:00).";
  }
  return "No tengo datos suficientes para responder eso de forma precisa. Prueba con una de las sugerencias.";
}

export function AIChat() {
  const u = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  if (!u) return null;
  const role = u.role;
  const data = useData.getState();

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: answer(role, q, data) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
        aria-label="AI"
      >
        <Sparkles className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-x-3 bottom-20 md:inset-x-auto md:bottom-24 md:right-6 z-40 flex h-[70vh] md:h-[520px] md:w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />{TITLES[role]}
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.length === 0 && (
              <div className="text-xs text-muted-foreground">Asistente contextual basado en tus datos. Prueba:</div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={cn("max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2", m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted")}>
                {m.text}
              </div>
            ))}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS[role].map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] hover:border-primary hover:text-primary">{s}</button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-border p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pregunta algo…" className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
