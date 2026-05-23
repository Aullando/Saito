import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCurrentUser, useData } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import saitoAiLogo from "@/assets/saito-ai.png";
import { useClub } from "@/clubs/ClubProvider";
import {
  buildRgccContextFromIdentity,
  rgccLocalFallback,
  rgccSuggestions,
} from "@/clubs/rgcc/aiContext";
import { resolveRgccIdentity } from "@/clubs/rgcc/identity";
import {
  gffFederation,
  gffTeams,
  gffPlayers,
  gffStaff,
  gffMatches,
  gffStats,
  gffAffiliatedClubs,
} from "@/clubs/gff/seed";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  sysadmin: "SysAdmin AI",
  admin: "Club Admin AI",
  manager: "Manager AI",
  technical: "Technical Staff AI",
  medical: "Medical Staff AI",
};

const TITLES_AR: Record<string, string> = {
  sysadmin: "مساعد مدير النظام",
  admin: "مساعد إدارة الاتحاد",
  manager: "مساعد المدير",
  technical: "مساعد الجهاز الفني",
  medical: "مساعد الجهاز الطبي",
};

const SUGGESTIONS: Record<string, string[]> = {
  sysadmin: ["¿Qué organizaciones tienen IA activada?", "¿Cuántas organizaciones están activas?"],
  admin: [
    "¿Qué pagos han fallado esta semana?",
    "¿Qué deportistas no están aptos?",
    "¿Qué cuotas tiene Juan Granados?",
  ],
  manager: [
    "¿Qué grupos entrenan hoy en Valencia?",
    "¿Pagos fallidos esta semana?",
    "¿Cuotas de Juan Granados?",
  ],
  technical: [
    "¿Atletas con estado médico desconocido?",
    "¿Mis entrenamientos esta semana?",
    "Resumen de notas de Raul",
  ],
  medical: [
    "¿Qué citas tengo hoy?",
    "¿Atletas con tratamiento activo?",
    "¿Deportistas en revisión?",
  ],
};

const SUGGESTIONS_EN: Record<string, string[]> = {
  sysadmin: ["Which organizations have AI enabled?", "How many organizations are active?"],
  admin: [
    "Which payments failed this week?",
    "Which athletes are not fit?",
    "What fees does Juan Granados have?",
  ],
  manager: [
    "Which groups train today in Valencia?",
    "Failed payments this week?",
    "Juan Granados' fees?",
  ],
  technical: [
    "Athletes with unknown medical status?",
    "My training sessions this week?",
    "Summary of notes for Raul",
  ],
  medical: [
    "What appointments do I have today?",
    "Athletes with an active treatment?",
    "Athletes under review?",
  ],
};

const SUGGESTIONS_GFF: Record<string, string[]> = {
  sysadmin: ["ما الاتحادات التي فعّلت الذكاء الاصطناعي؟", "كم عدد الاتحادات النشطة؟"],
  admin: [
    "ما المباريات القادمة للمنتخب الأول؟",
    "ما حالة تسجيل اللاعبين هذا الموسم؟",
    "ما الأندية المنتسبة الأكثر نشاطًا؟",
  ],
  manager: [
    "ما تدريبات المنتخب هذا الأسبوع؟",
    "من اللاعبون المستدعون للمعسكر القادم؟",
    "ما حالة جاهزية اللاعبين؟",
  ],
  technical: [
    "من اللاعبون ذوو الحالة البدنية المجهولة؟",
    "ما تدريباتي هذا الأسبوع؟",
    "ملخص ملاحظات اللاعب أحمد",
  ],
  medical: [
    "ما المواعيد الطبية اليوم؟",
    "اللاعبون الخاضعون للعلاج؟",
    "اللاعبون قيد المراجعة الطبية؟",
  ],
};

type Msg = { role: "user" | "assistant"; content: string };

function buildContext(role: string, data: ReturnType<typeof useData.getState>) {
  const base = {
    today: new Date().toISOString().slice(0, 10),
    sections: data.sections,
    categories: data.categories,
    groups: data.groups,
    facilities: data.facilities,
    athletes: data.athletes,
    events: data.events,
  };
  if (role === "sysadmin") {
    return { ...base, organizations: data.organizations, users: data.users };
  }
  if (role === "admin" || role === "manager") {
    return {
      ...base,
      fees: data.fees,
      payments: data.payments,
      appointments: role === "admin" ? data.appointments : undefined,
    };
  }
  if (role === "technical") {
    return base;
  }
  if (role === "medical") {
    return { ...base, appointments: data.appointments };
  }
  return base;
}

function buildGffContext(role: string) {
  // GFF federation seed — replaces generic athlete/payment/event store for
  // Arabic federation questions.
  const base = {
    today: new Date().toISOString().slice(0, 10),
    federation: gffFederation,
    teams: gffTeams,
    affiliatedClubs: gffAffiliatedClubs,
  };
  if (role === "sysadmin") {
    return { ...base, players: gffPlayers, staff: gffStaff, matches: gffMatches, stats: gffStats };
  }
  if (role === "admin") {
    return { ...base, players: gffPlayers, staff: gffStaff, matches: gffMatches, stats: gffStats };
  }
  if (role === "manager") {
    return { ...base, players: gffPlayers, staff: gffStaff, matches: gffMatches, stats: gffStats };
  }
  if (role === "technical") {
    return { ...base, players: gffPlayers, staff: gffStaff, matches: gffMatches, stats: gffStats };
  }
  if (role === "medical") {
    return { ...base, players: gffPlayers, staff: gffStaff };
  }
  return base;
}

export function AIChat() {
  const u = useCurrentUser();
  const { user, roles } = useAuth();
  const { club } = useClub();
  const aiAvatar = club.brand.aiAvatar ?? saitoAiLogo;
  const aiName = `${club.brand.shortName} AI`;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  if (!u) return null;
  const role = u.role;
  const lang = u.language; // "es" | "en"
  const isRgcc = club.id === "rgcc";
  const isGff = club.id === "gff-demo";
  const rgccIdentity = isRgcc ? resolveRgccIdentity(user, roles) : null;
  const aiScope = rgccIdentity?.scope ?? null;
  const title = isGff ? (TITLES_AR[role] ?? TITLES[role]) : TITLES[role];
  const suggestions = isGff
    ? (SUGGESTIONS_GFF[role] ?? [])
    : isRgcc
      ? rgccSuggestions(role, user, roles)
      : ((lang === "en" ? SUGGESTIONS_EN[role] : SUGGESTIONS[role]) ?? []);
  const placeholder = isGff ? "اكتب سؤالك…" : lang === "en" ? "Ask something…" : "Pregunta algo…";
  const thinking = isGff ? "جارٍ التفكير…" : lang === "en" ? "Thinking…" : "Pensando…";
  const emptyHint = isGff
    ? "مساعد ذكاء اصطناعي سياقي مع وصول إلى بيانات الاتحاد. اسأل ما تشاء:"
    : lang === "en"
      ? "Contextual AI assistant with access to club data. Ask anything:"
      : "Asistente IA contextual con acceso a los datos del club. Pregunta lo que quieras:";
  const connError = isGff
    ? "خطأ في الاتصال بالذكاء الاصطناعي."
    : lang === "en"
      ? "AI connection error."
      : "Error de conexión con la IA.";

  const ask = async (q: string) => {
    if (!q.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: q };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);

    try {
      const data = useData.getState();
      const context = isGff
        ? buildGffContext(role)
        : isRgcc && rgccIdentity
          ? buildRgccContextFromIdentity(rgccIdentity)
          : buildContext(role, data);
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          role,
          context,
          club: club.id,
          aiScope,
          lang: isGff ? "ar" : lang,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errTxt = await resp.text().catch(() => "");
        let errMsg = isGff
          ? "خطأ في الاتصال بالذكاء الاصطناعي."
          : lang === "en"
            ? "Could not contact the AI."
            : "Error al contactar la IA.";
        try {
          const j = JSON.parse(errTxt);
          if (j.error) errMsg = j.error;
        } catch {
          /* ignore */
        }
        if (resp.status === 429)
          errMsg = isGff
            ? "طلبات كثيرة جدًا. انتظر لحظة."
            : lang === "en"
              ? "Too many requests. Try again shortly."
              : "Demasiadas peticiones. Espera un momento.";
        if (resp.status === 402)
          errMsg = isGff
            ? "لا توجد أرصدة ذكاء اصطناعي."
            : lang === "en"
              ? "No AI credits available."
              : "Sin créditos de IA disponibles.";
        // RGCC fallback local cuando la IA no responde.
        if (isRgcc && rgccIdentity) {
          const local = rgccLocalFallback(
            role,
            context as ReturnType<typeof buildRgccContextFromIdentity>,
            q,
          );
          if (local) {
            setMsgs((m) => [...m, { role: "assistant", content: local }]);
            setLoading(false);
            return;
          }
        }
        setMsgs((m) => [...m, { role: "assistant", content: errMsg }]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let started = false;
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acc += delta;
              if (!started) {
                started = true;
                setMsgs((m) => [...m, { role: "assistant", content: acc }]);
              } else {
                setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, content: acc } : x)));
              }
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (isRgcc && rgccIdentity) {
        try {
          const ctx = buildRgccContextFromIdentity(rgccIdentity);
          const local = rgccLocalFallback(role, ctx, q);
          if (local) {
            setMsgs((m) => [...m, { role: "assistant", content: local }]);
            return;
          }
        } catch {
          /* ignore */
        }
      }
      setMsgs((m) => [...m, { role: "assistant", content: connError }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-primary shadow-lg ring-1 ring-primary/30 transition hover:scale-105 hover:opacity-95"
        aria-label={aiName}
      >
        <img src={aiAvatar} alt={aiName} className="h-10 w-10 rounded-full object-cover" />
      </button>
      {open && (
        <div
          dir={isGff ? "rtl" : "ltr"}
          lang={isGff ? "ar" : undefined}
          className="fixed inset-x-3 bottom-20 md:inset-x-auto md:bottom-24 md:right-6 z-40 flex h-[70vh] md:h-[520px] md:w-[380px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <img src={aiAvatar} alt="" className="h-5 w-5 rounded-full object-cover" />
              {title}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.length === 0 && <div className="text-xs text-muted-foreground">{emptyHint}</div>}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2",
                  m.role === "user"
                    ? cn("bg-primary text-primary-foreground", isGff ? "mr-auto" : "ml-auto")
                    : "bg-muted",
                )}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {loading && msgs[msgs.length - 1]?.role === "user" && (
              <div className="max-w-[88%] rounded-2xl bg-muted px-3 py-2 text-muted-foreground">
                {thinking}
              </div>
            )}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={placeholder}
              className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
