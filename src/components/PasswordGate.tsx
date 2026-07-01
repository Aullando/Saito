import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import saitoHero from "@/assets/saito-hero.png.asset.json";

const STORAGE_KEY = "site-password-ok";
const PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? "SIHSAITO";
const ENABLED = import.meta.env.VITE_ENABLE_PASSWORD_GATE !== "false";
const MISCONFIGURED = ENABLED && !PASSWORD;

export function PasswordGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(!ENABLED);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

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
          <h1 className="text-lg font-semibold text-destructive">
            Acceso bloqueado: configuración incompleta
          </h1>
          <p className="text-sm text-muted-foreground">
            El gate de demo está activado (<code>VITE_ENABLE_PASSWORD_GATE=true</code>) pero no se
            ha definido <code>VITE_DEMO_PASSWORD</code>. Configura la variable de entorno o
            desactiva el gate para continuar.
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b1a35] text-white">
      {/* Animated color aura echoing the SAITO ring */}
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-10 px-6 py-12 md:grid md:grid-cols-2 md:gap-16">
        {/* Hero */}
        <div className="flex w-full flex-col items-center text-center md:items-start md:text-left">
          <img
            src={saitoHero.url}
            alt="SAITO"
            className="w-full max-w-[520px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:max-w-none"
          />
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.32em] text-white/70">
            Sport Innovation Hub
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
            La plataforma que integra club, cuerpo técnico, staff médico y atleta.
          </h2>
        </div>

        {/* Form */}
        <div className="w-full max-w-md md:justify-self-end">
          <form
            onSubmit={onSubmit}
            className="w-full space-y-5 rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl"
          >
            <div>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                Acceso demo
              </span>
              <h1 className="mt-3 text-2xl font-bold text-white">Introduce la contraseña</h1>
              <p className="mt-1 text-sm text-white/70">
                Esta demo está restringida. Solicita el acceso a tu contacto SAITO.
              </p>
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
              placeholder="Contraseña"
            />
            {error && (
              <p className="text-xs font-medium text-rose-200">Contraseña incorrecta.</p>
            )}
            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-[#0b1a35] shadow-lg transition hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(90deg, #f59e0b 0%, #ec4899 35%, #6366f1 70%, #10b981 100%)",
              }}
            >
              Entrar
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
