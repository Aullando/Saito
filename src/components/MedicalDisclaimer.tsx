import { Shield } from "lucide-react";

/**
 * Standard medical-information notice required on every screen that surfaces
 * health-related data in SAITO. Keeps wording consistent across the product
 * and avoids any wording that could imply automated clinical judgement.
 */
export function MedicalDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="Aviso sobre información médica"
      className={`flex items-start gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-foreground ${className}`}
    >
      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>
        Información gestionada por personal autorizado. SAITO no sustituye el criterio profesional.
      </span>
    </div>
  );
}
