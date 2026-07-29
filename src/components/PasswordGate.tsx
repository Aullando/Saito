import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import saitoHero from "@/assets/saito-hero.png.asset.json";
import { useAuth as useLocalAuth } from "@/lib/store";

const STORAGE_KEY = "site-password-ok";
const PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? "SIHSAITO";
const ENABLED = import.meta.env.VITE_ENABLE_PASSWORD_GATE !== "false";
const MISCONFIGURED = ENABLED && !PASSWORD;

type Lang = "es" | "en" | "sr";
const detectLang = (): Lang => {
  if (typeof navigator === "undefined") return "en";
  const l = (navigator.language || "en").toLowerCase();
  if (l.startsWith("es")) return "es";
  if (l.startsWith("sr")) return "sr";
  return "en";
};

const COPY: Record<Lang, {
  misTitle: string; misBody: (env: ReactNode, envPass: ReactNode) => ReactNode;
  hero: string; tagline: string; badge: string; title: string;
  intro: string; placeholder: string; wrong: string; submit: string;
}> = {
  es: {
    misTitle: "Acceso bloqueado: configuración incompleta",
    misBody: (env, envPass) => (<>El gate de demo está activado ({env}) pero no se ha definido {envPass}. Configura la variable de entorno o desactiva el gate para continuar.</>),
    hero: "SAITO",
    tagline: "Sport Innovation Hub",
    badge: "Acceso demo",
    title: "Introduce la contraseña",
    intro: "Esta demo está restringida. Solicita el acceso a tu contacto SAITO.",
    placeholder: "Contraseña",
    wrong: "Contraseña incorrecta.",
    submit: "Entrar",
  },
  en: {
    misTitle: "Access blocked: incomplete configuration",
    misBody: (env, envPass) => (<>The demo gate is enabled ({env}) but {envPass} has not been set. Configure the environment variable or disable the gate to continue.</>),
    hero: "SAITO",
    tagline: "Sport Innovation Hub",
    badge: "Demo access",
    title: "Enter the password",
    intro: "This demo is restricted. Request access from your SAITO contact.",
    placeholder: "Password",
    wrong: "Incorrect password.",
    submit: "Enter",
  },
  sr: {
    misTitle: "Pristup blokiran: konfiguracija nije potpuna",
    misBody: (env, envPass) => (<>Demo pristup je omogućen ({env}), ali {envPass} nije definisan. Podesite promenljivu okruženja ili isključite pristup da biste nastavili.</>),
    hero: "SAITO",
    tagline: "Sport Innovation Hub",
    badge: "Demo pristup",
    title: "Unesite lozinku",
    intro: "Ova demo je ograničena. Zatražite pristup od vaše SAITO kontakt osobe.",
    placeholder: "Lozinka",
    wrong: "Netačna lozinka.",
    submit: "Uđi",
  },
};

const SUBHEADS: Record<Lang, string> = {
  es: "La plataforma que integra club, cuerpo técnico, staff médico y atleta.",
  en: "The platform that integrates club, technical staff, medical team and athlete.",
  sr: "Platforma koja objedinjuje klub, tehničko osoblje, medicinski tim i sportistu.",
};

export function PasswordGate({ children }: { children: ReactNode }) {
  const storedLang = useLocalAuth((s) => s.langOverride) as Lang | null | undefined;
  const setLangOverride = useLocalAuth((s) => s.setLangOverride);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(!ENABLED);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const initialLang = useMemo<Lang>(() => storedLang ?? detectLang(), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [lang, setLang] = useState<Lang>(initialLang);
  const c = COPY[lang];

  const pickLang = (l: Lang) => {
    setLang(l);
    try { setLangOverride(l); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!ENABLED) {
      setReady(true);
      return;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  if (MISCONFIGURED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-3 rounded-2xl border border-destructive/40 bg-card p-6 shadow-lg">
          <h1 className="text-lg font-semibold text-destructive">{c.misTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {c.misBody(<code>VITE_ENABLE_PASSWORD_GATE=true</code>, <code>VITE_DEMO_PASSWORD</code>)}
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (PASSWORD && value === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b1a35] text-white" lang={lang}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 45% at 15% 20%, rgba(59,130,246,0.55), transparent 60%), radial-gradient(55% 45% at 85% 15%, rgba(236,72,153,0.45), transparent 60%), radial-gradient(60% 55% at 80% 90%, rgba(250,204,21,0.45), transparent 60%), radial-gradient(55% 55% at 10% 90%, rgba(16,185,129,0.5), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,26,53,0.2) 0%, rgba(11,26,53,0.55) 100%)",
        }}
      />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-md">
        {(["es", "en", "sr"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => pickLang(l)}
            aria-pressed={lang === l}
            className={
              "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition " +
              (lang === l
                ? "bg-white text-[#0b1a35] shadow"
                : "text-white/70 hover:text-white")
            }
          >
            {l}
          </button>
        ))}
      </div>


      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-10 px-6 py-12 md:grid md:grid-cols-2 md:gap-16">
        <div className="flex w-full flex-col items-center text-center md:items-start md:text-left">
          <img
            src={saitoHero.url}
            alt={c.hero}
            className="w-full max-w-[520px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:max-w-none"
          />
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.32em] text-white/70">
            {c.tagline}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
            {SUBHEADS[lang]}
          </h2>
        </div>

        <div className="w-full max-w-md md:justify-self-end">
          <form
            onSubmit={onSubmit}
            className="w-full space-y-5 rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl"
          >
            <div>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                {c.badge}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-white">{c.title}</h1>
              <p className="mt-1 text-sm text-white/70">{c.intro}</p>
            </div>
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder-white/50 outline-none transition focus:border-white/60 focus:bg-white/15"
              placeholder={c.placeholder}
            />
            {error && (
              <p className="text-xs font-medium text-rose-200">{c.wrong}</p>
            )}
            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-[#0b1a35] shadow-lg transition hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(90deg, #f59e0b 0%, #ec4899 35%, #6366f1 70%, #10b981 100%)",
              }}
            >
              {c.submit}
            </button>
            <p className="text-center text-[11px] text-white/50">
              © {new Date().getFullYear()} SAITO · Sport Innovation Hub
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
