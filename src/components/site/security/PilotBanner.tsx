import { AlertTriangle } from "lucide-react";
import type { Locale } from "@/lib/site-i18n";
import { t } from "./data";

export function PilotBanner({ locale }: { locale: Locale }) {
  return (
    <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-left text-xs leading-relaxed text-amber-900 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <span>
        {t(locale, {
          es: "Esta página describe el modelo de seguridad y privacidad sobre el que SAITO está siendo construido y validado en piloto. Los controles marcados como “Activo” están operativos hoy; los marcados como “En piloto” o “Planificado” se completan antes del despliegue general.",
          en: "This page describes the security and privacy model SAITO is being built and validated against during piloting. Controls marked “Active” are operational today; those marked “In pilot” or “Planned” are completed before general availability.",
        })}
      </span>
    </div>
  );
}
