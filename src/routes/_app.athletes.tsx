import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AthleteProfileSheet } from "@/components/AthleteProfileSheet";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAthletesData, type AthleteRow } from "@/features/athletes/data";
import { AthletesFilters } from "@/features/athletes/AthletesFilters";
import { AthletesTable } from "@/features/athletes/AthletesTable";
import { NewAthleteDialog } from "@/features/athletes/NewAthleteDialog";

export const Route = createFileRoute("/_app/athletes")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <AthletesPage />
      </AppLayout>
    </RoleGate>
  ),
});

function AthletesPage() {
  const t = useT();
  const { roles, profile } = useAuth();
  const orgId = profile?.organization_id ?? null;
  const qc = useQueryClient();
  const isMedical = roles.includes("medical") && !roles.includes("admin");
  const isTechnical = roles.includes("technical") && !roles.includes("admin");
  const canManage = roles.includes("admin") || roles.includes("manager");

  const { athletes, sections, categories, groups, athleteGroups, isLoading } =
    useAthletesData(orgId);
  const groupsByAthlete = (athleteId: string) =>
    athleteGroups.filter((ag) => ag.athlete_id === athleteId).map((ag) => ag.group_id);

  // ------------- Filters -------------
  const [statusF, setStatusF] = useState("all");
  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [grpF, setGrpF] = useState("all");
  const [medF, setMedF] = useState("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<AthleteRow | null>(null);

  const filtered = athletes.filter((a) => {
    if (statusF !== "all" && a.status !== statusF) return false;
    if (secF !== "all" && a.section_id !== secF) return false;
    if (catF !== "all" && a.category_id !== catF) return false;
    if (grpF !== "all" && !groupsByAthlete(a.id).includes(grpF)) return false;
    if (medF !== "all" && a.medical_status !== medF) return false;
    if (q && !`${a.first_name} ${a.last_name}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  const removeAthlete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("athletes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["athletes", orgId] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const loading = !!orgId && isLoading;

  return (
    <>
      <PageHeader
        title={t("athletes_management")}
        actions={
          canManage && (
            <NewAthleteDialog
              orgId={orgId}
              sections={sections}
              categories={categories}
              groups={groups}
            />
          )
        }
      />

      <AthletesFilters
        q={q}
        onQ={setQ}
        statusF={statusF}
        onStatus={setStatusF}
        secF={secF}
        onSec={setSecF}
        catF={catF}
        onCat={setCatF}
        grpF={grpF}
        onGrp={setGrpF}
        medF={medF}
        onMed={setMedF}
        sections={sections}
        categories={categories}
        groups={groups}
        isMedical={isMedical}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState>{t("no_athletes")}</EmptyState>
      ) : (
        <AthletesTable
          rows={filtered}
          sections={sections}
          categories={categories}
          groups={groups}
          groupsByAthlete={groupsByAthlete}
          isMedical={isMedical}
          isTechnical={isTechnical}
          canManage={canManage}
          onView={setDetail}
          onDelete={(id) => removeAthlete.mutate(id)}
        />
      )}

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {detail && (
            <AthleteProfileSheet
              athlete={detail}
              roles={roles}
              sectionName={sections.find((s) => s.id === detail.section_id)?.name ?? "—"}
              categoryName={categories.find((c) => c.id === detail.category_id)?.name ?? "—"}
              groupNames={groupsByAthlete(detail.id)
                .map((id) => groups.find((g) => g.id === id)?.name)
                .filter((x): x is string => Boolean(x))}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
