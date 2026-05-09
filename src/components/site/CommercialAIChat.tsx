import { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocation, Link } from "@tanstack/react-router";
import saitoAiLogo from "@/assets/saito-ai.png";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS_ES = [
  "¿Qué módulos incluye SAITO?",
  "¿Cómo gestiona la privacidad de menores?",
  "¿Sirve para clubes multi-deporte?",
  "¿Cómo pido una demo?",
];

const SUGGESTIONS_EN = [
  "What modules does SAITO include?",
  "How do you handle minors' privacy?",
  "Does it support multi-sport clubs?",
  "How do I request a demo?",
];

export function CommercialAIChat() {
  const { pathname } = useLocation();
  const isEn = pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/");
  const locale: "es" | "en" = isEn ? "en" : "es";

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const ask = async (q: string) => {
    if (!q.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: q };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/commercial-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, locale }),
      });

      if (!resp.ok || !resp.body) {
        const errTxt = await resp.text().catch(() => "");
        let errMsg = t("Error al contactar la IA.", "Error contacting the AI.");
        try {
          const j = JSON.parse(errTxt);
          if (j.error) errMsg = j.error;
        } catch { /* ignore */ }
        if (resp.status === 429)
          errMsg = t(
            "Demasiadas peticiones. Espera un momento.",
            "Too many requests. Try again shortly.",
          );
        if (resp.status === 402)
          errMsg = t("Sin créditos de IA disponibles.", "AI credits exhausted.");
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
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: t("Error de conexión con la IA.", "Connection error with the AI."),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = locale === "en" ? SUGGESTIONS_EN : SUGGESTIONS_ES;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary shadow-xl ring-2 ring-primary/30 transition hover:scale-105"
        aria-label={t("Asistente comercial SAITO", "SAITO sales assistant")}
      >
        <img src={saitoAiLogo} alt="" className="h-10 w-10 rounded-full object-cover" />
      </button>
      {open && (
        <div className="fixed inset-x-3 bottom-20 md:inset-x-auto md:bottom-24 md:right-6 z-40 flex h-[70vh] md:h-[540px] md:w-[400px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-saito-gradient px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              {t("SAITO Assistant", "SAITO Assistant")}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="close"
              className="opacity-80 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.length === 0 && (
              <>
                <div className="text-xs text-muted-foreground">
                  {t(
                    "Hola 👋 Soy el asistente comercial de SAITO. Puedo contarte qué módulos tenemos, cómo gestionamos privacidad o cómo pedir una demo.",
                    "Hi 👋 I'm SAITO's sales assistant. I can tell you about modules, privacy and how to book a demo.",
                  )}
                </div>
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
              </>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2",
                  m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
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
                {t("Pensando…", "Thinking…")}
              </div>
            )}
          </div>
          <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            {t("¿Quieres ver SAITO en acción?", "Want to see SAITO in action?")}{" "}
            <Link
              to={(locale === "en" ? "/en/contacto" : "/contacto") as unknown as never}
              className="font-semibold text-primary hover:underline"
            >
              {t("Solicitar demo", "Book a demo")}
            </Link>
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
              placeholder={t("Pregunta sobre SAITO…", "Ask about SAITO…")}
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
