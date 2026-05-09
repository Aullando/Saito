import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const STORAGE_KEY = "site-password-ok";
const PASSWORD = "hola";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {}
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Acceso restringido</h1>
          <p className="mt-1 text-sm text-muted-foreground">Introduce la contraseña para continuar.</p>
        </div>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Contraseña"
        />
        {error && <p className="text-xs text-destructive">Contraseña incorrecta.</p>}
        <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Entrar
        </button>
      </form>
    </div>
  );
}
