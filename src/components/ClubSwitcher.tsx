import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Check, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useClub } from "@/clubs/ClubProvider";
import { cn } from "@/lib/utils";
import saitoMark from "@/assets/brand/saito-iso.svg";

export function ClubSwitcher() {
  const { club, availableClubs, switchClub } = useClub();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} dir="ltr" lang="en" className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1.5 shadow-sm hover:bg-muted"
        aria-label="Switch club"
      >
        {club.brand.logoMark || club.id === "saito" ? (
          <img
            src={club.brand.logoMark ?? saitoMark}
            alt=""
            className="h-5 w-5 rounded object-contain"
          />
        ) : (
          <Building2 className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="hidden sm:inline text-xs font-medium">{club.brand.shortName}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Clubes
          </div>
          <ul className="max-h-80 overflow-y-auto pb-1">
            {availableClubs.map((c) => {
              const active = c.id === club.id;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      switchClub(c.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted",
                      active && "bg-primary/10",
                    )}
                  >
                    {(() => {
                      const src = c.brand.logoMark ?? (c.id === "saito" ? saitoMark : undefined);
                      return src ? (
                        <img
                          src={src}
                          alt=""
                          className="h-7 w-7 rounded object-contain bg-muted/40"
                        />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-primary/15 text-[10px] font-bold text-primary">
                          {c.brand.shortName.slice(0, 3)}
                        </span>
                      );
                    })()}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{c.brand.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {c.seed.live ? "Live" : "Demo"} · {c.brand.defaultLanguage.toUpperCase()}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">Volver a la web</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  Sitio comercial de SAITO
                </span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
