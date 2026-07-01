import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui-kit";
import { useT } from "@/lib/i18n";
import type { AthleteRow, SectionRow, CategoryRow, GroupRow } from "./data";

export interface AthletesTableProps {
  rows: AthleteRow[];
  sections: SectionRow[];
  categories: CategoryRow[];
  groups: GroupRow[];
  groupsByAthlete: (id: string) => string[];
  isMedical: boolean;
  isTechnical: boolean;
  canManage: boolean;
  onView: (a: AthleteRow) => void;
  onDelete: (id: string) => void;
}

export function AthletesTable({
  rows,
  sections,
  categories,
  groups,
  groupsByAthlete,
  isMedical,
  isTechnical,
  canManage,
  onView,
  onDelete,
}: AthletesTableProps) {
  const t = useT();
  return (
    <div className="saito-card overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-3 font-semibold">{t("name")}</th>
            <th className="px-5 py-3 font-semibold">{t("section")}</th>
            <th className="px-5 py-3 font-semibold">{t("category")}</th>
            {!isMedical && <th className="px-5 py-3 font-semibold">{t("groups")}</th>}
            {isTechnical && <th className="px-5 py-3 font-semibold">{t("performance")}</th>}
            <th className="px-5 py-3 font-semibold">
              {isMedical || isTechnical ? t("medical_status") : t("status")}
            </th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const sec = sections.find((s) => s.id === a.section_id);
            const cat = categories.find((c) => c.id === a.category_id);
            const grpIds = groupsByAthlete(a.id);
            return (
              <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-5 py-3 font-medium">
                  {a.first_name} {a.last_name.toUpperCase()}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{sec?.name ?? "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{cat?.name ?? "—"}</td>
                {!isMedical && (
                  <td className="px-5 py-3 text-muted-foreground">
                    {grpIds
                      .map((id) => groups.find((g) => g.id === id)?.name)
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                )}
                {isTechnical && (
                  <td className="px-5 py-3">
                    <Pill
                      tone={
                        a.performance_status === "High"
                          ? "success"
                          : a.performance_status === "Low"
                            ? "warning"
                            : "info"
                      }
                    >
                      {a.performance_status}
                    </Pill>
                  </td>
                )}
                <td className="px-5 py-3">
                  {isMedical || isTechnical ? (
                    <Pill
                      tone={
                        a.medical_status === "Fit"
                          ? "success"
                          : a.medical_status === "Injured"
                            ? "danger"
                            : a.medical_status === "Under review"
                              ? "warning"
                              : "default"
                      }
                    >
                      {a.medical_status}
                    </Pill>
                  ) : (
                    <Pill
                      tone={
                        a.status === "Active"
                          ? "success"
                          : a.status === "Pending"
                            ? "warning"
                            : "default"
                      }
                    >
                      {a.status}
                    </Pill>
                  )}
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => onView(a)}>
                    {t("view_profile")}
                  </Button>
                  {canManage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm(t("delete_confirm"))) onDelete(a.id);
                      }}
                    >
                      {t("delete")}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
