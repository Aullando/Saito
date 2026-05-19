import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Check, ArrowLeft, LogOut, Sparkles } from "lucide-react";
import { useActiveClubStore } from "@/clubs/activeClub";
import { useClub } from "@/clubs/ClubProvider";
import { CLUBS } from "@/clubs/registry";
import { useAuth, useCurrentUser } from "@/lib/store";
import saitoMark from "@/assets/brand/saito-iso.svg";

// Demo narrative order — SAITO → RGCC → GFF.
const CLUB_ORDER = ["saito", "rgcc", "gff-demo"] as const;

const ROLE_LABEL: Record<string, string> = {
  manager: "Gestor / Dirección",
  admin: "Administración",
  sysadmin: "Sistema",
  medical: "Staff médico",
  technical: "Entrenador",
  athlete: "Atleta",
};

/**
 * Persistent commercial-demo bar.
 * - Visible across the whole app (hidden only on /login).
 * - Lets the salesperson swap club, jump back to role picker, or exit.
 * - Pushes Topbar down via the global `--demo-bar-h` CSS variable.
 */
export function DemoBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { club } = useClub();
  const switchClub = useActiveClubStore((s) => s.switchClub);
  const setUser = useAuth((s) => s.setUser);
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Hide on the demo hub itself.
  const hidden = pathname.startsWith("/login");

  // Publish bar height so Topbar / main padding can offset themselves.
  useEffect(() => {
    const root = document.documentElement;
    if (hidden) {
      root.style.removeProperty("--demo-bar-h");
      return;
    }
    root.style.setProperty("--demo-bar-h", "36px");
    return () => {
      root.style.removeProperty("--demo-bar-h");
    };
  }, [hidden]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (hidden) return null;

  const pickClub = (id: string) => {
    setOpen(false);
    if (id === club.id) return;
    switchClub(id);
    // Send the user to the role picker for the new club so the commercial
    // can pick the persona that best fits the pitch.
    setUser(null);
    navigate({ to: "/login" });
  };

  const exitDemo = () => {
    setUser(null);
    switchClub(null);
    navigate({ to: "/login" });
  };

  const changeRole = () => {
    setUser(null);
    navigate({ to: "/login" });
  };

  const roleLabel = user ? (ROLE_LABEL[user.role] ?? user.role) : null;
  const logo = club.brand.logoMark ?? (club.id === "saito" ? saitoMark : undefined);

  return (
    <div
      ref={ref}
      dir="ltr"
      lang="en"
      className="fixed inset-x-0 top-0 z-40 flex h-9 items-center gap-2 border-b border-[#21324a]/20 bg-[#21324a] px-2 text-white shadow-sm sm:px-4"
      role="region"
      aria-label="Modo demo comercial"
    >
      <div className="hidden h-4 w-px bg-white/15 sm:block" />


      {/* Club switcher */}
      <div className="relative min-w-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Cambiar entidad"
        >
          {logo ? (
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 rounded bg-white/90 object-contain p-0.5"
            />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-[9px] font-bold">
              {club.brand.shortName.slice(0, 3)}
            </span>
          )}
          <span className="max-w-[140px] truncate sm:max-w-[220px]">{club.brand.name}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-border bg-popover text-foreground shadow-xl"
          >
            <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cambiar entidad
            </li>
            {CLUB_ORDER.map((id) => {
              const c = CLUBS[id];
              if (!c) return null;
              const active = id === club.id;
              const src = c.brand.logoMark ?? (id === "saito" ? saitoMark : undefined);
              const subtitle =
                id === "gff-demo"
                  ? "Demo · Gulf federation"
                  : `${c.seed.live ? "Live" : "Demo"} · ${c.brand.defaultLanguage.toUpperCase()}`;
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pickClub(id)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-muted ${
                      active ? "bg-primary/10" : ""
                    }`}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-7 rounded-md bg-muted/40 object-contain p-0.5"
                      />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary">
                        {c.brand.shortName.slice(0, 3)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{c.brand.name}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {subtitle}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {roleLabel && (
        <>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden truncate text-xs text-white/85 sm:inline">{roleLabel}</span>
        </>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={changeRole}
          className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium hover:bg-white/15"
          aria-label="Cambiar rol del club actual"
          title="Volver al selector de roles de esta entidad"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Cambiar rol</span>
        </button>
        <button
          type="button"
          onClick={exitDemo}
          className="flex items-center gap-1 rounded-full bg-[#F12F4A]/90 px-2.5 py-1 text-[11px] font-semibold hover:bg-[#F12F4A]"
          aria-label="Salir del modo demo"
          title="Salir del modo demo"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  );
}

export default DemoBar;
