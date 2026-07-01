import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui-kit";

export const DAY_NAMES_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const DAY_NAMES_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function categoryName(categories: { id: string; name: string }[], id: string) {
  return categories.find((c) => c.id === id)?.name ?? "";
}

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function RoleCard({
  icon: Icon,
  label,
  count,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  tone: string;
}) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`rounded-lg p-2 ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-semibold text-slate-900 leading-none">{count}</div>
        <div className="mt-1 truncate text-xs text-slate-500">{label}</div>
      </div>
    </Card>
  );
}

export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-2">
      <div className="text-lg font-semibold text-slate-900 leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
