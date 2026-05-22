import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const STORAGE_KEY = "site-password-ok";
const PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? "SIHSAITO";
// Gate siempre activo para proteger todo el proyecto.
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
            desactiva el gate para continuar. No existe contraseña por defecto.
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg"
      >
        <div>
          <h1 className="text-lg font-semibold text-foreground">Acceso restringido</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Introduce la contraseña para continuar.
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
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Contraseña"
        />
        {error && <p className="text-xs text-destructive">Contraseña incorrecta.</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
