import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">{children}</div>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function ComingSoon({
  label,
  clubName,
  message,
  backLabel,
}: {
  label: string;
  clubName: string;
  message?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {message ?? `Este módulo de ${clubName} está en preparación. Pronto estará disponible aquí dentro de SAITO.`}
      </p>
      <Link
        to="/dashboard"
        className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        {backLabel ?? "Volver al Dashboard"}
      </Link>
    </div>
  );
}
